import { formatKes } from '../../data/products.js';

export default function HangTag({ price, compareAt }) {
  return (
    <span className={`tag ${compareAt ? 'tag-sale' : ''}`}>
      {compareAt && <span className="tag-strike">{compareAt.toLocaleString('en-KE')}</span>}
      {formatKes(price).replace('KSh ', '')}
    </span>
  );
}
