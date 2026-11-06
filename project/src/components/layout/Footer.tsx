import { Box, Container, Divider, Link, Stack, Typography } from '@mui/material';
import { Mail, MapPin, Phone, Watch } from 'lucide-react';
import { Link as RouterLink } from 'react-router-dom';

const CONTACT_ITEMS = [
  { icon: Mail, label: 'hello@ticktockstore.in', href: 'mailto:hello@ticktockstore.in' },
  { icon: Phone, label: '+91 98765 43210', href: 'tel:+919876543210' },
  { icon: MapPin, label: 'Bandra West, Mumbai, Maharashtra 400050', href: undefined },
];

const QUICK_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Watches', to: '/products' },
  { label: 'Cart', to: '/cart' },
  { label: 'About', to: '/about' },
];

export default function Footer() {
  return (
    <Box component="footer" sx={{ backgroundColor: 'primary.main', color: 'rgba(255,255,255,0.78)', mt: 'auto', pt: 8, pb: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: 'grid', gap: 6, gridTemplateColumns: { xs: '1fr', md: '2fr 1fr 1.5fr' } }}>
          <Stack spacing={2}>
            <Stack direction="row" alignItems="center" spacing={1.25}>
              <Watch size={26} color="#C9A24A" strokeWidth={1.75} aria-hidden />
              <Typography variant="h6" sx={{ color: '#FFFFFF', letterSpacing: 1.5, textTransform: 'uppercase', fontSize: '1rem' }}>
                TickTock <Box component="span" sx={{ color: 'secondary.main' }}>Store</Box>
              </Typography>
            </Stack>
            <Typography variant="body2" sx={{ maxWidth: 320 }}>
              Timepieces chosen with care, from quiet classics to modern smartwatches, delivered across India.
            </Typography>
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2" sx={{ color: 'secondary.main', textTransform: 'uppercase', letterSpacing: 1.2 }}>
              Explore
            </Typography>
            {QUICK_LINKS.map((link) => (
              <Link
                key={link.to}
                component={RouterLink}
                to={link.to}
                underline="none"
                sx={{ color: 'inherit', width: 'fit-content', transition: 'color 200ms ease', '&:hover': { color: '#FFFFFF' } }}
              >
                {link.label}
              </Link>
            ))}
          </Stack>

          <Stack spacing={1.5}>
            <Typography variant="subtitle2" sx={{ color: 'secondary.main', textTransform: 'uppercase', letterSpacing: 1.2 }}>
              Contact
            </Typography>
            {CONTACT_ITEMS.map(({ icon: Icon, label, href }) => (
              <Stack key={label} direction="row" spacing={1.25} alignItems="flex-start">
                <Icon size={18} color="#C9A24A" aria-hidden style={{ marginTop: 3, flexShrink: 0 }} />
                {href ? (
                  <Link href={href} underline="none" sx={{ color: 'inherit', '&:hover': { color: '#FFFFFF' } }}>
                    {label}
                  </Link>
                ) : (
                  <Typography variant="body2">{label}</Typography>
                )}
              </Stack>
            ))}
          </Stack>
        </Box>

        <Divider sx={{ borderColor: 'rgba(255,255,255,0.12)', my: 4 }} />
        <Typography variant="body2" sx={{ textAlign: 'center', color: 'rgba(255,255,255,0.6)' }}>
          © {new Date().getFullYear()} TickTock Store. All rights reserved.
        </Typography>
      </Container>
    </Box>
  );
}
