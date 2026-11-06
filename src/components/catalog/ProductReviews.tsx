import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { deleteReview, getReviews, submitReview, updateReview } from '../../lib/catalogService';
import type { Review } from '../../types/catalog';
import { useSessionUser } from '../../hooks/useSessionUser';
import RatingStars from './RatingStars';

export default function ProductReviews({ productId, onChanged }: { productId: string; onChanged?: () => void }) {
  const { user } = useSessionUser();
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    try { setReviews(await getReviews(productId)); setError(null); }
    catch (e) { setError((e as Error).message); }
    finally { setLoading(false); }
  }, [productId]);
  useEffect(() => { void load(); }, [load]);

  const mine = reviews.find((r) => r.user_id === user?.id);
  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;
  const dist = [5, 4, 3, 2, 1].map((n) => ({ n, c: reviews.filter((r) => r.rating === n).length }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setBusy(true); setError(null);
    try {
      if (editingId) await updateReview(editingId, rating, comment);
      else await submitReview(productId, user.id, rating, comment);
      setRating(0); setComment(''); setEditingId(null);
      await load(); onChanged?.();
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  };
  const startEdit = (r: Review) => { setEditingId(r.id); setRating(r.rating); setComment(r.comment); };
  const remove = async (id: string) => {
    if (!window.confirm('Delete your review?')) return;
    try { await deleteReview(id); await load(); onChanged?.(); } catch (err) { setError((err as Error).message); }
  };

  return (
    <section className="tt-reviews">
      <h2>Customer Reviews</h2>
      {loading && <p className="tt-muted">Loading reviews…</p>}
      {error && <p className="tt-error">{error}</p>}

      {!loading && reviews.length > 0 && (
        <div className="tt-summary">
          <div><strong className="tt-avg">{avg.toFixed(1)}</strong><RatingStars value={avg} count={reviews.length} /></div>
          <div className="tt-dist">
            {dist.map(({ n, c }) => (
              <div key={n}><span>{n}★</span>
                <i><b style={{ width: `${(c / reviews.length) * 100}%` }} /></i><span>{c}</span></div>
            ))}
          </div>
        </div>
      )}
      {!loading && reviews.length === 0 && <p className="tt-muted">No reviews yet. Be the first to review this watch.</p>}

      {user ? ((!mine || editingId) && (
        <form onSubmit={save} className="tt-form">
          <h3>{editingId ? 'Edit your review' : 'Write a review'}</h3>
          <div className="tt-pick">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} className={n <= rating ? 'on' : ''} onClick={() => setRating(n)} aria-label={`${n} stars`}>★</button>
            ))}
          </div>
          <textarea value={comment} onChange={(e) => setComment(e.target.value)} rows={4} maxLength={1000}
            placeholder="Share your experience (5–1000 characters)" />
          <div>
            <button type="submit" disabled={busy}>{busy ? 'Saving…' : editingId ? 'Update review' : 'Submit review'}</button>
            {editingId && <button type="button" onClick={() => { setEditingId(null); setRating(0); setComment(''); }}>Cancel</button>}
          </div>
        </form>
      )) : <p className="tt-muted"><Link to="/login">Log in</Link> to write a review.</p>}
      {/* change "/login" if Member 2 uses another route */}

      <ul className="tt-list">
        {reviews.map((r) => (
          <li key={r.id}>
            <div><strong>{r.reviewer_name ?? 'Customer'}</strong> <RatingStars value={r.rating} />
              <small> {new Date(r.created_at).toLocaleDateString()}{r.updated_at !== r.created_at && ' (edited)'}</small></div>
            <p>{r.comment}</p>
            {r.user_id === user?.id && (
              <div><button onClick={() => startEdit(r)}>Edit</button><button onClick={() => void remove(r.id)}>Delete</button></div>
            )}
          </li>
        ))}
      </ul>
    </section>
  );
}
