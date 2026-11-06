import { useEffect, useState } from 'react';
import { Button } from '@mui/material';
import { Check, ShoppingBag } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import type { Product } from '@/types/product';

interface AddToCartButtonProps {
  product: Product;
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export default function AddToCartButton({ product, size = 'medium', fullWidth = false }: AddToCartButtonProps) {
  const { items, addItem } = useCart();
  const [justAdded, setJustAdded] = useState(false);

  useEffect(() => {
    if (!justAdded) return;
    const timer = window.setTimeout(() => setJustAdded(false), 1600);
    return () => window.clearTimeout(timer);
  }, [justAdded]);

  const quantityInCart = items.find((item) => item.productId === product.id)?.quantity ?? 0;
  const outOfStock = product.stock === 0;
  const limitReached = quantityInCart >= product.stock;

  let label = 'Add to cart';
  if (outOfStock) label = 'Out of stock';
  else if (limitReached) label = 'Maximum in cart';
  else if (justAdded) label = 'Added to cart';

  const handleClick = () => {
    addItem(product);
    setJustAdded(true);
  };

  return (
    <Button
      variant="contained"
      color="secondary"
      size={size}
      fullWidth={fullWidth}
      disabled={outOfStock || limitReached}
      onClick={handleClick}
      startIcon={justAdded ? <Check size={18} /> : <ShoppingBag size={18} />}
      sx={{ boxShadow: 'none', '&:hover': { boxShadow: '0 6px 16px rgba(201,162,74,0.35)' } }}
    >
      {label}
    </Button>
  );
}
