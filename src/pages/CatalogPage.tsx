import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getFilterOptions, searchProducts } from '../lib/catalogService';
import type { CatalogProduct } from '../types/catalog';
import { useDebounce } from '../hooks/useDebounce';
import CatalogProductCard from '../components/catalog/CatalogProductCard';
import ProductFilters from '../components/catalog/ProductFilters';
import '../styles/catalog.css';

export default function CatalogPage() {
  const [params, setParams] = useSearchParams();
  const search = params.get('q') ?? '';
  const categories = params.getAll('category');
  const brands = params.getAll('brand');
  const catKey = categories.join('|');
  const brandKey = brands.join('|');

  const [input, setInput] = useState(search);
  const debounced = useDebounce(input, 350);
  const [products, setProducts] = useState<CatalogProduct[]>([]);
  const [options, setOptions] = useState({ categories: [] as string[], brands: [] as string[] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => { getFilterOptions().then(setOptions).catch(() => undefined); }, []);

  // push debounced text into the URL (avoids a request per keystroke)
  useEffect(() => {
    if (debounced.trim() === search) return;
    const next = new URLSearchParams(params);
    if (debounced.trim()) next.set('q', debounced.trim()); else next.delete('q');
    setParams(next, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounced]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true); setError(null);
    searchProducts({ search, categories, brands })
      .then((d) => { if (!cancelled) setProducts(d); })
      .catch((e: Error) => { if (!cancelled) setError(e.message); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, catKey, brandKey]);

  const toggle = (key: 'category' | 'brand', value: string) => {
    const next = new URLSearchParams(params);
    const cur = next.getAll(key);
    next.delete(key);
    (cur.includes(value) ? cur.filter((v) => v !== value) : [...cur, value]).forEach((v) => next.append(key, v));
    setParams(next);
  };
  const clearAll = () => { setInput(''); setParams({}); };
  const clearSearch = () => { setInput(''); const n = new URLSearchParams(params); n.delete('q'); setParams(n); };
  const hasFilters = !!search || categories.length > 0 || brands.length > 0;

  return (
    <main className="tt-wrap">
      <h1 className="tt-title">All Watches</h1>
      <div className="tt-search">
        <input type="search" value={input} onChange={(e) => setInput(e.target.value)}
          placeholder="Search by watch name or brand…" aria-label="Search products" />
        {input && <button type="button" onClick={clearSearch} aria-label="Clear search">✕</button>}
      </div>

      {hasFilters && (
        <div className="tt-chips">
          {search && <button onClick={clearSearch}>Search: “{search}” ✕</button>}
          {categories.map((c) => <button key={c} onClick={() => toggle('category', c)}>{c} ✕</button>)}
          {brands.map((b) => <button key={b} onClick={() => toggle('brand', b)}>{b} ✕</button>)}
          <button className="tt-clear" onClick={clearAll}>Clear all</button>
        </div>
      )}

      <div className="tt-layout">
        <ProductFilters categories={options.categories} brands={options.brands}
          selCategories={categories} selBrands={brands} onToggle={toggle} />
        <section>
          {loading && <p className="tt-muted">Loading watches…</p>}
          {error && <p className="tt-error">Could not load products: {error}</p>}
          {!loading && !error && products.length === 0 && (
            <div className="tt-empty">
              <h3>No watches found</h3>
              <p>{hasFilters ? 'Try a different search term or remove some filters.' : 'No products are available yet.'}</p>
              {hasFilters && <button onClick={clearAll}>Clear all filters</button>}
            </div>
          )}
          {!loading && !error && products.length > 0 && (
            <>
              <p className="tt-muted">{products.length} watch{products.length === 1 ? '' : 'es'} found</p>
              <div className="tt-grid">{products.map((p) => <CatalogProductCard key={p.id} p={p} />)}</div>
            </>
          )}
        </section>
      </div>
    </main>
  );
}
