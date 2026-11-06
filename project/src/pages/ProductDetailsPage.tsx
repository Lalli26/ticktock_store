import { Link as RouterLink, useParams } from 'react-router-dom';
import { Box, Breadcrumbs, Button, Chip, Container, Divider, Link, Stack, Typography } from '@mui/material';
import { ArrowLeft, Package } from 'lucide-react';
import ErrorState from '@/components/common/ErrorState';
import LoadingState from '@/components/common/LoadingState';
import AddToCartButton from '@/components/products/AddToCartButton';
import { useProduct } from '@/hooks/useProduct';
import { formatPrice } from '@/lib/format';

function stockStatus(stock: number): { label: string; color: 'success' | 'warning' | 'error' } {
  if (stock === 0) return { label: 'Out of stock', color: 'error' };
  if (stock <= 5) return { label: `Only ${stock} left in stock`, color: 'warning' };
  return { label: `In stock (${stock} available)`, color: 'success' };
}

export default function ProductDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { product, loading, error, reload } = useProduct(id);

  if (loading) return <LoadingState message="Loading watch details..." />;

  if (error) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <ErrorState message={error} onRetry={reload} />
      </Container>
    );
  }

  if (!product) {
    return (
      <Container maxWidth="lg" sx={{ py: 12, textAlign: 'center' }}>
        <Typography variant="h4" sx={{ mb: 2 }}>
          We could not find that watch
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          It may have been removed or the link is incorrect.
        </Typography>
        <Button component={RouterLink} to="/products" variant="contained" color="primary">
          Browse all watches
        </Button>
      </Container>
    );
  }

  const status = stockStatus(product.stock);

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 } }}>
      <Breadcrumbs sx={{ mb: 4 }} aria-label="breadcrumb">
        <Link component={RouterLink} to="/" underline="hover" color="text.secondary">
          Home
        </Link>
        <Link component={RouterLink} to="/products" underline="hover" color="text.secondary">
          Watches
        </Link>
        <Typography color="text.primary">{product.name}</Typography>
      </Breadcrumbs>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 4, md: 8 },
          gridTemplateColumns: { xs: '1fr', md: '1.1fr 1fr' },
          alignItems: 'start',
        }}
      >
        <Box
          sx={{
            aspectRatio: '1 / 1',
            borderRadius: 4,
            overflow: 'hidden',
            backgroundColor: '#F3EFE6',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          <Box
            component="img"
            src={product.imageUrl}
            alt={product.name}
            sx={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
        </Box>

        <Stack spacing={3}>
          <Stack direction="row" spacing={1}>
            <Chip label={product.category} size="small" sx={{ backgroundColor: 'primary.main', color: '#FFFFFF' }} />
          </Stack>

          <Box>
            <Typography variant="overline" sx={{ color: 'secondary.dark', letterSpacing: 2 }}>
              {product.brand}
            </Typography>
            <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, mt: 0.5 }}>
              {product.name}
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 600 }}>
            {formatPrice(product.price)}
          </Typography>

          <Stack direction="row" spacing={1} alignItems="center">
            <Package size={18} aria-hidden />
            <Chip label={status.label} color={status.color} variant="outlined" size="small" />
          </Stack>

          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.7 }}>
            {product.description}
          </Typography>

          <AddToCartButton product={product} size="large" />

          <Divider />

          <Box>
            <Typography variant="h5" sx={{ mb: 2 }}>
              Specifications
            </Typography>
            <Stack divider={<Divider flexItem />} spacing={0}>
              {product.specifications.map((spec) => (
                <Stack key={spec.label} direction="row" justifyContent="space-between" spacing={2} sx={{ py: 1.5 }}>
                  <Typography variant="body2" color="text.secondary">
                    {spec.label}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, textAlign: 'right' }}>
                    {spec.value}
                  </Typography>
                </Stack>
              ))}
            </Stack>
          </Box>

          <Button component={RouterLink} to="/products" startIcon={<ArrowLeft size={16} />} sx={{ alignSelf: 'flex-start', px: 0 }}>
            Back to all watches
          </Button>
        </Stack>
      </Box>
    </Container>
  );
}
