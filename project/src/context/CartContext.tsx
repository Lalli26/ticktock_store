import { createContext, useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import type { CartItem, Product } from '@/types/product';

const CART_STORAGE_KEY = 'ticktock-cart';

export interface CartContextValue {
  items: CartItem[];
  itemCount: number;
  subtotal: number;
  addItem: (product: Product, quantity?: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  removeItem: (productId: string) => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== 'object' || value === null) return false;
  const item = value as CartItem;
  return (
    typeof item.productId === 'string' &&
    typeof item.name === 'string' &&
    typeof item.brand === 'string' &&
    typeof item.price === 'number' &&
    typeof item.imageUrl === 'string' &&
    typeof item.stock === 'number' &&
    typeof item.quantity === 'number'
  );
}

function loadCart(): CartItem[] {
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

function clampQuantity(quantity: number, stock: number): number {
  return Math.max(0, Math.min(Math.floor(quantity), stock));
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>(loadCart);

  useEffect(() => {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem = useCallback((product: Product, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((item) => item.productId === product.id);
      const currentQuantity = existing?.quantity ?? 0;
      const nextQuantity = clampQuantity(currentQuantity + quantity, product.stock);
      if (nextQuantity === currentQuantity) return current;

      const snapshot: CartItem = {
        productId: product.id,
        name: product.name,
        brand: product.brand,
        price: product.price,
        imageUrl: product.imageUrl,
        stock: product.stock,
        quantity: nextQuantity,
      };

      if (!existing) return [...current, snapshot];
      return current.map((item) => (item.productId === product.id ? snapshot : item));
    });
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setItems((current) =>
      current
        .map((item) =>
          item.productId === productId
            ? { ...item, quantity: clampQuantity(quantity, item.stock) }
            : item,
        )
        .filter((item) => item.quantity > 0),
    );
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((current) => current.filter((item) => item.productId !== productId));
  }, []);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return { items, itemCount, subtotal, addItem, setQuantity, removeItem };
  }, [items, addItem, setQuantity, removeItem]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}
