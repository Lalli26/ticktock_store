import { useCallback, useEffect, useState } from 'react';
import { fetchProductById } from '@/lib/productService';
import type { Product } from '@/types/product';

interface ProductState {
  product: Product | null;
  loading: boolean;
  error: string | null;
  reload: () => void;
}

export function useProduct(id: string | undefined): ProductState {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    if (!id) {
      setProduct(null);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);
    setError(null);

    fetchProductById(id)
      .then((result) => {
        if (!cancelled) setProduct(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : 'Something went wrong.');
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id, attempt]);

  const reload = useCallback(() => setAttempt((count) => count + 1), []);

  return { product, loading, error, reload };
}
