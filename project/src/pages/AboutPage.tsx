import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, Container, Stack, Typography } from '@mui/material';
import { ArrowRight, Gem, Headphones, Truck } from 'lucide-react';

const PILLARS = [
  {
    icon: Gem,
    title: 'A curated collection',
    description: 'Every watch is chosen for its design, craftsmanship and value, from quiet dress pieces to modern smartwatches.',
  },
  {
    icon: Truck,
    title: 'Clear, honest details',
    description: 'Specifications, stock levels and prices are shown plainly so you know exactly what you are buying before you add it to your cart.',
  },
  {
    icon: Headphones,
    title: 'Helpful, friendly support',
    description: 'Have a question about a model or a size? Our team is always happy to help you find the right timepiece.',
  },
];

export default function AboutPage() {
  return (
    <Box>
      <Box sx={{ backgroundColor: 'primary.main', color: '#FFFFFF', py: { xs: 10, md: 14 } }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: 3 }}>
            About TickTock Store
          </Typography>
          <Typography variant="h1" sx={{ fontSize: { xs: '2.4rem', md: '3.4rem' }, mt: 1, mb: 3, color: '#FFFFFF' }}>
            Timepieces for every moment
          </Typography>
          <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.78)', fontSize: '1.05rem', maxWidth: 640, mx: 'auto' }}>
            TickTock Store was created with one purpose: to help people discover watches they love. We focus only on watches, so every part of the store is designed around finding, comparing and choosing the right piece.
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 10 } }}>
        <Box sx={{ display: 'grid', gap: 3, gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' } }}>
          {PILLARS.map(({ icon: Icon, title, description }) => (
            <Card key={title}>
              <CardContent sx={{ p: 4 }}>
                <Stack spacing={2.5}>
                  <Box
                    sx={{
                      width: 52,
                      height: 52,
                      borderRadius: '50%',
                      backgroundColor: 'primary.main',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Icon size={24} color="#C9A24A" aria-hidden />
                  </Box>
                  <Typography variant="h5">{title}</Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                    {description}
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        <Box sx={{ mt: { xs: 8, md: 10 }, maxWidth: 760, mx: 'auto', textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontSize: { xs: '1.9rem', md: '2.3rem' }, mb: 3 }}>
            Our customer promise
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ lineHeight: 1.8, mb: 4 }}>
            Shopping for a watch should feel as considered as the watch itself. Browse by category, brand or price, open any product for its full specifications, and build your cart with quantities that always reflect real stock. Everything you see is designed to make the decision simple and confident.
          </Typography>
          <Button component={RouterLink} to="/products" variant="contained" color="secondary" size="large" endIcon={<ArrowRight size={18} />}>
            Explore the collection
          </Button>
        </Box>
      </Container>
    </Box>
  );
}
