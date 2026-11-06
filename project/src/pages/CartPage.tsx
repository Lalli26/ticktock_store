import { Link as RouterLink } from 'react-router-dom';
import { Box, Button, Card, CardContent, Container, Divider, Stack, Typography } from '@mui/material';
import { ArrowRight, ShoppingBag } from 'lucide-react';
import CartItemRow from '@/components/cart/CartItemRow';
import { useCart } from '@/hooks/useCart';
import { formatPrice } from '@/lib/format';

export default function CartPage() {
  const { items, itemCount, subtotal, setQuantity, removeItem } = useCart();

  if (items.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: { xs: 10, md: 14 }, textAlign: 'center' }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            mx: 'auto',
            mb: 3,
            borderRadius: '50%',
            backgroundColor: 'primary.main',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ShoppingBag size={34} color="#C9A24A" aria-hidden />
        </Box>
        <Typography variant="h3" sx={{ fontSize: { xs: '1.8rem', md: '2.2rem' }, mb: 2 }}>
          Your cart is empty
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Looks like you have not added any watches yet. Explore our collection and find your next favourite timepiece.
        </Typography>
        <Button component={RouterLink} to="/products" variant="contained" color="secondary" size="large" endIcon={<ArrowRight size={18} />}>
          Browse watches
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: { xs: 6, md: 8 } }}>
      <Typography variant="overline" sx={{ color: 'secondary.dark', letterSpacing: 2.5 }}>
        Your selection
      </Typography>
      <Typography variant="h2" sx={{ fontSize: { xs: '2rem', md: '2.6rem' }, mb: 4 }}>
        Shopping cart
      </Typography>

      <Box
        sx={{
          display: 'grid',
          gap: { xs: 4, md: 6 },
          gridTemplateColumns: { xs: '1fr', md: '1fr 340px' },
          alignItems: 'start',
        }}
      >
        <Card sx={{ px: { xs: 2, sm: 3 } }}>
          {items.map((item) => (
            <CartItemRow
              key={item.productId}
              item={item}
              onQuantityChange={(quantity) => setQuantity(item.productId, quantity)}
              onRemove={() => removeItem(item.productId)}
            />
          ))}
        </Card>

        <Card sx={{ position: { md: 'sticky' }, top: { md: 100 } }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h5" sx={{ mb: 3 }}>
              Order summary
            </Typography>
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Items ({itemCount})
                </Typography>
                <Typography variant="body2">{formatPrice(subtotal)}</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body2">{formatPrice(subtotal)}</Typography>
              </Stack>
            </Stack>
            <Divider sx={{ my: 2.5 }} />
            <Stack direction="row" justifyContent="space-between" alignItems="baseline">
              <Typography variant="h6">Total</Typography>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                {formatPrice(subtotal)}
              </Typography>
            </Stack>
            <Button component={RouterLink} to="/products" variant="text" color="primary" fullWidth sx={{ mt: 3 }}>
              Continue shopping
            </Button>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
}
