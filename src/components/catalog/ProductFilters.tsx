interface Props {
  categories: string[]; brands: string[];
  selCategories: string[]; selBrands: string[];
  onToggle: (key: 'category' | 'brand', value: string) => void;
}
export default function ProductFilters({ categories, brands, selCategories, selBrands, onToggle }: Props) {
  const group = (title: string, key: 'category' | 'brand', items: string[], sel: string[]) => (
    <fieldset className="tt-fieldset">
      <legend>{title}</legend>
      {items.length === 0 && <p className="tt-muted">None available</p>}
      {items.map((i) => (
        <label key={i}><input type="checkbox" checked={sel.includes(i)} onChange={() => onToggle(key, i)} /> {i}</label>
      ))}
    </fieldset>
  );
  return <aside className="tt-filters">{group('Category', 'category', categories, selCategories)}{group('Brand', 'brand', brands, selBrands)}</aside>;
}
