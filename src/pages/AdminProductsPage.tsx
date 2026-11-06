import { useCallback, useEffect, useState } from 'react';
import { adminCreateProduct, adminDeleteProduct, adminListProducts, adminUpdateProduct } from '../lib/catalogService';
import type { CatalogProduct, ProductInput } from '../types/catalog';
import RequireAdmin from '../components/catalog/RequireAdmin';
import '../styles/catalog.css';

const empty: ProductInput = { name: '', brand: '', category: '', price: 0, stock: 0, description: '',
  image_url: '', specifications: {}, is_featured: false, is_active: true };

const specsToText = (s: Record<string, string>) => Object.entries(s).map(([k, v]) => `${k}: ${v}`).join('\n');
const textToSpecs = (t: string): Record<string, string> => Object.fromEntries(
  t.split('\n').map((l) => l.split(/:(.+)/)).filter((p) => p[0]?.trim() && p[1]?.trim()).map((p) => [p[0].trim(), p[1].trim()]));

function AdminInner() {
  const [items, setItems] = useState<CatalogProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<ProductInput | null>(null);
  const [specText, setSpecText] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { setItems(await adminListProducts()); setError(null); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, []);
  useEffect(() => { void load(); }, [load]);

  const open = (p?: CatalogProduct) => {
    setEditId(p?.id ?? null);
    setForm(p ? { name: p.name, brand: p.brand ?? '', category: p.category ?? '', price: Number(p.price), stock: p.stock ?? 0,
      description: p.description ?? '', image_url: p.image_url ?? '', specifications: p.specifications ?? {},
      is_featured: p.is_featured, is_active: p.is_active } : empty);
    setSpecText(specsToText(p?.specifications ?? {}));
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setBusy(true); setError(null);
    const payload = { ...form, specifications: textToSpecs(specText) };
    try {
      if (editId) await adminUpdateProduct(editId, payload); else await adminCreateProduct(payload);
      setForm(null); await load();
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };

  const remove = async (p: CatalogProduct) => {
    if (!window.confirm(`Delete "${p.name}"? This cannot be undone.`)) return;
    try { await adminDeleteProduct(p.id); await load(); } catch (err) { setError((err as Error).message); }
  };

  const set = <K extends keyof ProductInput>(k: K, v: ProductInput[K]) => setForm((f) => (f ? { ...f, [k]: v } : f));

  return (
    <main className="tt-wrap">
      <div className="tt-row"><h1 className="tt-title">Manage Products</h1><button className="tt-primary" onClick={() => open()}>+ Add product</button></div>
      {error && <p className="tt-error">{error}</p>}
      {loading && <p className="tt-muted">Loading…</p>}
      {!loading && items.length === 0 && <div className="tt-empty"><h3>No products yet</h3></div>}

      {form && (
        <form className="tt-form" onSubmit={save}>
          <h3>{editId ? 'Edit product' : 'New product'}</h3>
          <input placeholder="Name" value={form.name} onChange={(e) => set('name', e.target.value)} />
          <input placeholder="Brand" value={form.brand} onChange={(e) => set('brand', e.target.value)} />
          <input placeholder="Category" value={form.category} onChange={(e) => set('category', e.target.value)} />
          <input type="number" min={0} step="0.01" placeholder="Price" value={form.price} onChange={(e) => set('price', Number(e.target.value))} />
          <input type="number" min={0} step={1} placeholder="Stock" value={form.stock} onChange={(e) => set('stock', Number(e.target.value))} />
          <input placeholder="Image URL (https://…)" value={form.image_url} onChange={(e) => set('image_url', e.target.value)} />
          <textarea rows={3} placeholder="Description" value={form.description} onChange={(e) => set('description', e.target.value)} />
          <textarea rows={4} placeholder={'Specifications, one per line:\nCase size: 40mm\nMovement: Automatic'} value={specText} onChange={(e) => setSpecText(e.target.value)} />
          <label><input type="checkbox" checked={form.is_featured} onChange={(e) => set('is_featured', e.target.checked)} /> Featured</label>
          <label><input type="checkbox" checked={form.is_active} onChange={(e) => set('is_active', e.target.checked)} /> Active (visible to customers)</label>
          <div><button type="submit" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button><button type="button" onClick={() => setForm(null)}>Cancel</button></div>
        </form>
      )}

      {items.length > 0 && (
        <div className="tt-table-wrap"><table className="tt-table">
          <thead><tr><th>Name</th><th>Brand</th><th>Category</th><th>Price</th><th>Stock</th><th>Status</th><th /></tr></thead>
          <tbody>{items.map((p) => (
            <tr key={p.id}><td>{p.name}</td><td>{p.brand}</td><td>{p.category}</td><td>${Number(p.price).toFixed(2)}</td><td>{p.stock}</td>
              <td>{p.is_active ? 'Active' : 'Inactive'}{p.is_featured && ' · Featured'}</td>
              <td><button onClick={() => open(p)}>Edit</button><button onClick={() => void remove(p)}>Delete</button></td></tr>
          ))}</tbody>
        </table></div>
      )}
    </main>
  );
}

export default function AdminProductsPage() { return <RequireAdmin><AdminInner /></RequireAdmin>; }
