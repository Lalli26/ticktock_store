import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardActionArea, Stack, Typography } from '@mui/material';
import { ChevronRight } from 'lucide-react';
import type { Product } from '@/types/product';

interface BrandsSectionProps {
  products: Product[];
}

export default function BrandsSection({ products }: BrandsSectionProps) {
  const brandCounts = products.reduce<Map<string, number>>((counts, product) => {
    counts.set(product.brand, (counts.get(product.brand) ?? 0) + 1);
    return counts;
  }, new Map());
  const brands = [...brandCounts.entries()].sort(([a], [b]) => a.localeCompare(b));

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        gridTemplateColumns: { xs: 'repeat(2, 1fr)', md: 'repeat(4, 1fr)' },
      }}
    >
      {brands.map(([brand, count]) => (
        <Card key={brand} sx={{ transition: 'border-color 200ms ease, transform 200ms ease', '&:hover': { borderColor: 'secondary.main', transform: 'translateY(-2px)' } }}>
          <CardActionArea component={RouterLink} to={`/products?brand=${encodeURIComponent(brand)}`} sx={{ p: 3 }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="h6">{brand}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {count} {count === 1 ? 'watch' : 'watches'}
                </Typography>
              </Box>
              <ChevronRight size={20} color="#9C7A2C" aria-hidden />
            </Stack>
          </CardActionArea>
        </Card>
      ))}
    </Box>
  );
}
