import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container } from '@mui/material';
import { ArrowRight } from 'lucide-react';
import BrandsSection from '@/components/home/BrandsSection';
import CategoriesSection from '@/components/home/CategoriesSection';
import HeroBanner from '@/components/home/HeroBanner';
import ErrorState from '@/components/common/ErrorState';
import LoadingState from '@/components/common/LoadingState';
import SectionHeading from '@/components/common/SectionHeading';
import ProductGrid from '@/components/products/ProductGrid';
import { useProducts } from '@/hooks/useProducts';

const FEATURED_COUNT = 4;

export default function HomePage() {
  const { data: products, loading, error, reload } = useProducts();

  return (
    <Box>
      <HeroBanner />

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <SectionHeading
          eyebrow="Handpicked for you"
          title="Featured watches"
          action={
            <Button component={RouterLink} to="/products" color="primary" endIcon={<ArrowRight size={18} />}>
              View all watches
            </Button>
          }
        />
        {loading && <LoadingState message="Loading featured watches..." />}
        {!loading && error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && products && <ProductGrid products={products.slice(0, FEATURED_COUNT)} />}
      </Container>

      <Box sx={{ backgroundColor: '#F3EFE6', py: { xs: 8, md: 10 } }}>
        <Container maxWidth="lg">
          <SectionHeading eyebrow="Find your style" title="Shop by category" />
          {loading && <LoadingState message="Loading categories..." />}
          {!loading && error && <ErrorState message={error} onRetry={reload} />}
          {!loading && !error && products && <CategoriesSection products={products} />}
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <SectionHeading eyebrow="Trusted names" title="Popular brands" />
        {loading && <LoadingState message="Loading brands..." />}
        {!loading && error && <ErrorState message={error} onRetry={reload} />}
        {!loading && !error && products && <BrandsSection products={products} />}
      </Container>
    </Box>
  );
}
