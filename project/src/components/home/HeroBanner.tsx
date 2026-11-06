import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Container, Stack, Typography } from '@mui/material';
import { ArrowRight } from 'lucide-react';

const HERO_IMAGE_URL =
  'https://images.pexels.com/photos/10414975/pexels-photo-10414975.jpeg?auto=compress&cs=tinysrgb&h=650&w=940';

export default function HeroBanner() {
  return (
    <Box
      sx={{
        position: 'relative',
        overflow: 'hidden',
        backgroundColor: 'primary.main',
        color: '#FFFFFF',
        '@keyframes heroFadeUp': {
          from: { opacity: 0, transform: 'translateY(24px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      }}
    >
      <Container maxWidth="lg">
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: '1.1fr 0.9fr' },
            alignItems: 'center',
            gap: { xs: 4, md: 6 },
            minHeight: { xs: 'auto', md: 620 },
            py: { xs: 8, md: 10 },
          }}
        >
          <Stack spacing={3} sx={{ animation: 'heroFadeUp 800ms ease both' }}>
            <Typography variant="overline" sx={{ color: 'secondary.main', letterSpacing: 3 }}>
              Welcome to TickTock Store
            </Typography>
            <Typography variant="h1" sx={{ fontSize: { xs: '2.5rem', md: '3.75rem' }, color: '#FFFFFF' }}>
              Time, worn with <Box component="span" sx={{ color: 'secondary.main', fontStyle: 'italic' }}>intention</Box>.
            </Typography>
            <Typography variant="body1" sx={{ color: 'rgba(255,255,255,0.78)', maxWidth: 480, fontSize: '1.05rem' }}>
              Discover refined analog classics, bold digital sports watches and smart companions, all chosen to suit every moment of your day.
            </Typography>
            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ pt: 1 }}>
              <Button
                component={RouterLink}
                to="/products"
                variant="contained"
                color="secondary"
                size="large"
                endIcon={<ArrowRight size={18} />}
                sx={{ boxShadow: 'none' }}
              >
                Shop now
              </Button>
              <Button
                component={RouterLink}
                to="/about"
                variant="outlined"
                size="large"
                sx={{ color: '#FFFFFF', borderColor: 'rgba(255,255,255,0.4)', '&:hover': { borderColor: '#FFFFFF', backgroundColor: 'rgba(255,255,255,0.06)' } }}
              >
                Our story
              </Button>
            </Stack>
          </Stack>

          <Box
            sx={{
              position: 'relative',
              animation: 'heroFadeUp 900ms ease 150ms both',
              '&::before': {
                content: '""',
                position: 'absolute',
                inset: { xs: -12, md: -20 },
                border: '1px solid rgba(201,162,74,0.45)',
                borderRadius: 4,
                pointerEvents: 'none',
              },
            }}
          >
            <Box
              component="img"
              src={HERO_IMAGE_URL}
              alt="Premium wristwatch on a dark background"
              sx={{
                display: 'block',
                width: '100%',
                height: { xs: 320, sm: 420, md: 520 },
                objectFit: 'cover',
                borderRadius: 3,
                boxShadow: '0 30px 60px rgba(0,0,0,0.45)',
              }}
            />
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
