import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getProductById } from '../lib/catalogService';
import type { CatalogProduct } from '../types/catalog';
import RatingStars from '../components/catalog/RatingStars';
import ProductReviews from '../components/catalog/ProductReviews';
import '../styles/catalog.css';

export default function CatalogProductDetailsPage() {
  const { id = '' } = useParams<{ id: string }>();
  const [product, setProduct] = useState<CatalogProduct | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [active, setActive] = useState(0);

  const load = useCallback(async () => {
    try { setProduct(await getProductById(id)); setError(null); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, [id]);
  useEffect(() => { setLoading(true); void load(); }, [load]);

  if (loading) return <main className="tt-wrap"><p className="tt-muted">Loading…</p></main>;
  if (error) return <main className="tt-wrap"><p className="tt-error">Error: {error}</p></main>;
  if (!product) return (
    <main className="tt-wrap tt-empty">
      <h2>Product not available</h2><p>This watch doesn’t exist or is no longer available.</p>
      <Link to="/products">Back to all watches</Link>
    </main>
  );

  const images = [...new Set([product.image_url, ...(product.images ?? [])].filter((x): x is string => !!x))];
  const stock = product.stock ?? 0;
  const specs = Object.entries(product.specifications ?? {});

  const handleAddToCart = () => {
    // TODO(Member 2): call the existing cart interface here, e.g. addToCart(product.id, 1).
    // Intentionally not re-implemented in Member 1's module.
    console.info('Add to cart requested for', product.id);
  };

  return (
    <main className="tt-wrap">
      <Link to="/products" className="tt-back">← All watches</Link>
      <div className="tt-detail">
        <div>
          <div className="tt-hero-img">{images[active] ? <img src={images[active]} alt={product.name} /> : <span>No image</span>}</div>
          {images.length > 1 && (
            <div className="tt-thumbs">
              {images.map((src, i) => <button key={src} className={i === active ? 'on' : ''} onClick={() => setActive(i)}><img src={src} alt="" /></button>)}
            </div>
          )}
        </div>
        <div>
          <small className="tt-muted">{product.brand}{product.category ? ` · ${product.category}` : ''}</small>
          <h1>{product.name}</h1>
          <RatingStars value={product.avg_rating ?? 0} count={product.review_count ?? 0} />
          <p className="tt-price">${Number(product.price).toFixed(2)}</p>
          <p className={stock > 0 ? 'tt-instock' : 'tt-error'}>
            {stock > 5 ? 'In stock' : stock > 0 ? `Only ${stock} left` : 'Out of stock'}
          </p>
          {product.description && <p>{product.description}</p>}
          <button className="tt-primary" disabled={stock <= 0} onClick={handleAddToCart}>
            {stock > 0 ? 'Add to Cart' : 'Unavailable'}
          </button>
          {specs.length > 0 && (
            <table className="tt-specs"><tbody>
              {specs.map(([k, v]) => <tr key={k}><th>{k}</th><td>{v}</td></tr>)}
            </tbody></table>
          )}
        </div>
      </div>
      <ProductReviews productId={product.id} onChanged={() => void load()} />
    </main>
  );
}
