export default function RatingStars({ value, count }: { value: number; count?: number }) {
  const full = Math.round(value);
  return (
    <span className="tt-stars" aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => <span key={n} className={n <= full ? 'on' : ''}>★</span>)}
      {count !== undefined && <small> {count > 0 ? `${value.toFixed(1)} (${count})` : 'No reviews yet'}</small>}
    </span>
  );
}
