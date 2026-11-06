import { Link as RouterLink } from 'react-router-dom';
import { Box, IconButton, Stack, Typography } from '@mui/material';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { formatPrice } from '@/lib/format';
import type { CartItem } from '@/types/product';

interface CartItemRowProps {
  item: CartItem;
  onQuantityChange: (quantity: number) => void;
  onRemove: () => void;
}

export default function CartItemRow({ item, onQuantityChange, onRemove }: CartItemRowProps) {
  const lineTotal = item.price * item.quantity;
  const atStockLimit = item.quantity >= item.stock;

  return (
    <Box
      sx={{
        display: 'grid',
        gap: 2,
        alignItems: 'center',
        gridTemplateColumns: { xs: '80px 1fr', sm: '96px 1fr auto' },
        py: 3,
        borderBottom: '1px solid',
        borderColor: 'divider',
      }}
    >
      <Box
        component={RouterLink}
        to={`/products/${item.productId}`}
        sx={{ width: { xs: 80, sm: 96 }, height: { xs: 80, sm: 96 }, borderRadius: 2, overflow: 'hidden', backgroundColor: '#F3EFE6', display: 'block' }}
      >
        <Box component="img" src={item.imageUrl} alt={item.name} sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
      </Box>

      <Stack spacing={1}>
        <Typography variant="overline" sx={{ color: 'secondary.dark', lineHeight: 1.2 }}>
          {item.brand}
        </Typography>
        <Typography
          component={RouterLink}
          to={`/products/${item.productId}`}
          variant="h6"
          sx={{ color: 'text.primary', textDecoration: 'none', '&:hover': { color: 'secondary.dark' } }}
        >
          {item.name}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          {formatPrice(item.price)} each
        </Typography>

        <Stack direction="row" alignItems="center" spacing={1.5} sx={{ pt: 0.5 }}>
          <IconButton
            aria-label={`Decrease quantity of ${item.name}`}
            onClick={() => onQuantityChange(item.quantity - 1)}
            size="small"
            sx={{ border: '1px solid', borderColor: 'divider' }}
          >
            <Minus size={16} />
          </IconButton>
          <Typography variant="body1" sx={{ minWidth: 24, textAlign: 'center', fontWeight: 600 }} aria-live="polite">
            {item.quantity}
          </Typography>
          <IconButton
            aria-label={`Increase quantity of ${item.name}`}
            onClick={() => onQuantityChange(item.quantity + 1)}
            disabled={atStockLimit}
            size="small"
            sx={{ border: '1px solid', borderColor: 'divider' }}
          >
            <Plus size={16} />
          </IconButton>
          {atStockLimit && (
            <Typography variant="caption" color="text.secondary">
              Maximum available
            </Typography>
          )}
        </Stack>
      </Stack>

      <Stack
        direction={{ xs: 'row', sm: 'column' }}
        justifyContent="space-between"
        alignItems={{ xs: 'center', sm: 'flex-end' }}
        sx={{ gridColumn: { xs: '1 / -1', sm: 'auto' } }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          {formatPrice(lineTotal)}
        </Typography>
        <IconButton aria-label={`Remove ${item.name} from cart`} onClick={onRemove} color="error" size="small">
          <Trash2 size={18} />
        </IconButton>
      </Stack>
    </Box>
  );
}
