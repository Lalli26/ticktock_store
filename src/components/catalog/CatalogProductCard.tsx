import { Link } from 'react-router-dom';
import type { CatalogProduct } from '../../types/catalog';
import RatingStars from './RatingStars';

export default function CatalogProductCard({ p }: { p: CatalogProduct }) {
  const out = (p.stock ?? 0) <= 0;
  return (
    <Link to={`/products/${p.id}`} className="tt-card">
      <div className="tt-card-img">
        {p.image_url ? <img src={p.image_url} alt={p.name} loading="lazy" /> : <span>No image</span>}
        {out && <em className="tt-badge">Out of stock</em>}
      </div>
      <div className="tt-card-body">
        <small>{p.brand}</small>
        <h3>{p.name}</h3>
        <RatingStars value={p.avg_rating ?? 0} count={p.review_count ?? 0} />
        <strong>${Number(p.price).toFixed(2)}</strong>
      </div>
    </Link>
  );
}
