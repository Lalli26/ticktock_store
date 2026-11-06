import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, CardActions, CardContent, Card, Chip, Stack, Typography } from '@mui/material';
import AddToCartButton from '@/components/products/AddToCartButton';
import { formatPrice } from '@/lib/format';
import type { Product } from '@/types/product';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const detailsPath = `/products/${product.id}`;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 250ms ease, box-shadow 250ms ease',
        '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 16px 36px rgba(17,17,17,0.10)' },
        '&:hover .product-image': { transform: 'scale(1.05)' },
      }}
    >
      <Box
        component={RouterLink}
        to={detailsPath}
        aria-label={`View details for ${product.name}`}
        sx={{ position: 'relative', display: 'block', aspectRatio: '1 / 1', overflow: 'hidden', backgroundColor: '#F3EFE6' }}
      >
        <Box
          component="img"
          className="product-image"
          src={product.imageUrl}
          alt={product.name}
          loading="lazy"
          sx={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 500ms ease' }}
        />
        <Chip
          label={product.category}
          size="small"
          sx={{ position: 'absolute', top: 12, left: 12, backgroundColor: 'rgba(17,17,17,0.85)', color: '#FFFFFF' }}
        />
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', gap: 1, p: 2.5 }}>
        <Typography variant="overline" sx={{ color: 'secondary.dark', lineHeight: 1.4 }}>
          {product.brand}
        </Typography>
        <Typography variant="h6" component={RouterLink} to={detailsPath} sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'secondary.dark' } }}>
          {product.name}
        </Typography>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto', pt: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            {formatPrice(product.price)}
          </Typography>
          {product.stock === 0 && <Chip label="Out of stock" size="small" color="error" variant="outlined" />}
        </Stack>
      </CardContent>

      <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
        <Stack spacing={1} sx={{ width: '100%' }}>
          <Button component={RouterLink} to={detailsPath} variant="outlined" color="primary" fullWidth>
            View details
          </Button>
          <AddToCartButton product={product} fullWidth />
        </Stack>
      </CardActions>
    </Card>
  );
}
