import { Link as RouterLink } from 'react-router-dom';
import { Box, Card, CardActionArea, Stack, Typography } from '@mui/material';
import { Activity, Clock, Timer, type LucideIcon } from 'lucide-react';
import { WATCH_CATEGORIES, type Product, type WatchCategory } from '@/types/product';

interface CategoriesSectionProps {
  products: Product[];
}

const CATEGORY_DETAILS: Record<WatchCategory, { icon: LucideIcon; description: string }> = {
  Analog: { icon: Clock, description: 'Timeless hands and dials for classic style.' },
  Digital: { icon: Timer, description: 'Precise displays with sport-ready functions.' },
  Smartwatch: { icon: Activity, description: 'Health tracking and notifications on your wrist.' },
};

export default function CategoriesSection({ products }: CategoriesSectionProps) {
  return (
    <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
      {WATCH_CATEGORIES.map((category) => {
        const { icon: Icon, description } = CATEGORY_DETAILS[category];
        const count = products.filter((product) => product.category === category).length;
        return (
          <Card key={category} sx={{ transition: 'border-color 200ms ease, transform 200ms ease', '&:hover': { borderColor: 'secondary.main', transform: 'translateY(-4px)' } }}>
            <CardActionArea component={RouterLink} to={`/products?category=${category}`} sx={{ p: 4, height: '100%' }}>
              <Stack spacing={2.5} alignItems="flex-start">
                <Box
                  sx={{
                    width: 56,
                    height: 56,
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'primary.main',
                  }}
                >
                  <Icon size={26} color="#C9A24A" aria-hidden />
                </Box>
                <Box>
                  <Typography variant="h5">{category}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                    {description}
                  </Typography>
                </Box>
                <Typography variant="body2" sx={{ color: 'secondary.dark', fontWeight: 600 }}>
                  {count} {count === 1 ? 'watch' : 'watches'} available
                </Typography>
              </Stack>
            </CardActionArea>
          </Card>
        );
      })}
    </Box>
  );
}
