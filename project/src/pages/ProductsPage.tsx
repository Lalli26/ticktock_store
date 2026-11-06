import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { RotateCcw } from 'lucide-react';
import ErrorState from '@/components/common/ErrorState';
import LoadingState from '@/components/common/LoadingState';
import ProductFiltersPanel from '@/components/products/ProductFilters';
import ProductGrid from '@/components/products/ProductGrid';
import { useProducts } from '@/hooks/useProducts';
import { filterProducts, type ProductFilters } from '@/lib/filterProducts';
import { WATCH_CATEGORIES, type Product, type WatchCategory } from '@/types/product';

interface PriceBounds {
  min: number;
  max: number;
}

function getPriceBounds(products: Product[]): PriceBounds {
  if (products.length === 0) return { min: 0, max: 0 };
  const prices = products.map((product) => product.price);
  return { min: Math.floor(Math.min(...prices)), max: Math.ceil(Math.max(...prices)) };
}

function readFilters(params: URLSearchParams, bounds: PriceBounds): ProductFilters {
  const category = params.get('category');
  const minParam = Number(params.get('min'));
  const maxParam = Number(params.get('max'));

  return {
    query: params.get('q') ?? '',
    category: WATCH_CATEGORIES.includes(category as WatchCategory) ? (category as WatchCategory) : '',
    brand: params.get('brand') ?? '',
    minPrice: params.has('min') && Number.isFinite(minParam) ? minParam : bounds.min,
    maxPrice: params.has('max') && Number.isFinite(maxParam) ? maxParam : bounds.max,
  };
}

const URL_KEYS: Record<keyof ProductFilters, string> = {
  query: 'q',
  category: 'category',
  brand: 'brand',
  minPrice: 'min',
  maxPrice: 'max',
};

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const { data: products, loading, error, reload } = useProducts();

  const priceBounds = useMemo(() => getPriceBounds(products ?? []), [products]);
  const brands = useMemo(
    () => [...new Set((products ?? []).map((product) => product.brand))].sort((a, b) => a.localeCompare(b)),
    [products],
  );

  if (loading) return <LoadingState message="Loading watches..." />;
  if (error || !products) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <ErrorState message={error ?? 'Watches could not be loaded.'} onRetry={reload} />
      </Container>
    );
  }

  const filters = readFilters(searchParams, priceBounds);
  const visibleProducts = filterProducts(products, filters);

  const updateFilters = (patch: Partial<ProductFilters>) => {
    const next = { ...filters, ...patch };
    const params = new URLSearchParams();
    (Object.keys(URL_KEYS) as (keyof ProductFilters)[]).forEach((key) => {
      const value = next[key];
      const isDefault =
        (key === 'minPrice' && value === priceBounds.min) ||
        (key === 'maxPrice' && value === priceBounds.max);
      if (value === '' || isDefault) return;
      params.set(URL_KEYS[key], String(value));
    });
    setSearchParams(params, { replace: true });
  };

  const resetFilters = () => setSearchParams(new URLSearchParams(), { replace: true });

  const hasActiveFilters =
    filters.query.trim() !== '' ||
    filters.category !== '' ||
    filters.brand !== '' ||
    filters.minPrice !== priceBounds.min ||
    filters.maxPrice !== priceBounds.max;

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Stack spacing={1} sx={{ mb: { xs: 4, md: 6 } }}>
        <Typography variant="overline" sx={{ color: 'secondary.dark', letterSpacing: 2.5 }}>
          The collection
        </Typography>
        <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.6rem' } }}>
          Our watches
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Showing {visibleProducts.length} of {products.length} watches
        </Typography>
      </Stack>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 4, md: 6 },
          gridTemplateColumns: { xs: '1fr', md: '260px 1fr' },
          alignItems: 'start',
        }}
      >
        <Box sx={{ position: { md: 'sticky' }, top: { md: 100 } }}>
          <ProductFiltersPanel
            filters={filters}
            brands={brands}
            priceBounds={priceBounds}
            onChange={updateFilters}
            onReset={resetFilters}
          />
        </Box>

        <Box>
          {visibleProducts.length > 0 ? (
            <ProductGrid products={visibleProducts} />
          ) : (
            <Stack spacing={2} alignItems="flex-start" sx={{ py: 8, px: 4, border: '1px dashed', borderColor: 'divider', borderRadius: 3 }}>
              <Typography variant="h5">No watches match your filters</Typography>
              <Typography variant="body2" color="text.secondary">
                Try a different search term or widen the price range.
              </Typography>
              {hasActiveFilters && (
                <Button variant="outlined" color="primary" startIcon={<RotateCcw size={16} />} onClick={resetFilters}>
                  Reset filters
                </Button>
              )}
            </Stack>
          )}
        </Box>
      </Box>
    </Container>
  );
}
