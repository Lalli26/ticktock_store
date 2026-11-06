import { useState } from 'react';
import { NavLink, Link as RouterLink } from 'react-router-dom';
import { AppBar, Badge, Box, Button, Container, Drawer, IconButton, List, ListItemButton, ListItemText, Stack, Toolbar, Typography } from '@mui/material';
import { Menu as MenuIcon, ShoppingBag, Watch, X } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

const NAV_LINKS = [
  { label: 'Home', to: '/' },
  { label: 'Watches', to: '/products' },
  { label: 'About', to: '/about' },
];

const navLinkSx = {
  color: 'rgba(255,255,255,0.82)',
  px: 1.5,
  transition: 'color 200ms ease',
  '&:hover': { color: '#FFFFFF', backgroundColor: 'transparent' },
  '&.active': { color: 'secondary.main' },
};

export default function Navbar() {
  const { itemCount } = useCart();
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <AppBar position="sticky" elevation={0} sx={{ backgroundColor: 'primary.main', borderBottom: '1px solid rgba(201,162,74,0.25)' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters sx={{ minHeight: 72, justifyContent: 'space-between' }}>
          <Box
            component={RouterLink}
            to="/"
            sx={{ display: 'flex', alignItems: 'center', gap: 1.25, color: 'inherit', textDecoration: 'none' }}
          >
            <Watch size={28} color="#C9A24A" strokeWidth={1.75} aria-hidden />
            <Typography variant="h6" component="span" sx={{ color: '#FFFFFF', letterSpacing: 1.5, textTransform: 'uppercase', fontSize: '1.05rem' }}>
              TickTock <Box component="span" sx={{ color: 'secondary.main' }}>Store</Box>
            </Typography>
          </Box>

          <Stack direction="row" alignItems="center" spacing={0.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {NAV_LINKS.map((link) => (
              <Button key={link.to} component={NavLink} to={link.to} end={link.to === '/'} sx={navLinkSx}>
                {link.label}
              </Button>
            ))}
            <IconButton component={RouterLink} to="/cart" aria-label="View cart" sx={{ ml: 1, color: '#FFFFFF' }}>
              <Badge badgeContent={itemCount} color="secondary" max={99}>
                <ShoppingBag size={22} />
              </Badge>
            </IconButton>
          </Stack>

          <Stack direction="row" alignItems="center" spacing={1} sx={{ display: { xs: 'flex', md: 'none' } }}>
            <IconButton component={RouterLink} to="/cart" aria-label="View cart" sx={{ color: '#FFFFFF' }}>
              <Badge badgeContent={itemCount} color="secondary" max={99}>
                <ShoppingBag size={22} />
              </Badge>
            </IconButton>
            <IconButton aria-label="Open menu" onClick={() => setDrawerOpen(true)} sx={{ color: '#FFFFFF' }}>
              <MenuIcon size={24} />
            </IconButton>
          </Stack>
        </Toolbar>
      </Container>

      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        slotProps={{ paper: { sx: { width: 280, backgroundColor: 'primary.main', color: '#FFFFFF' } } }}
      >
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 2, py: 1.5 }}>
          <Typography variant="h6" sx={{ color: '#FFFFFF' }}>Menu</Typography>
          <IconButton aria-label="Close menu" onClick={() => setDrawerOpen(false)} sx={{ color: '#FFFFFF' }}>
            <X size={22} />
          </IconButton>
        </Stack>
        <List>
          {NAV_LINKS.map((link) => (
            <ListItemButton
              key={link.to}
              component={NavLink}
              to={link.to}
              end={link.to === '/'}
              onClick={() => setDrawerOpen(false)}
              sx={{ '&.active': { color: 'secondary.main' } }}
            >
              <ListItemText primary={link.label} slotProps={{ primary: { fontWeight: 500 } }} />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </AppBar>
  );
}
