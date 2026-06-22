import Icon from '../icons/Icon.jsx';

export default function Stepper({ value, onChange }) {
  return (
    <div className="stepper">
      <button type="button" aria-label="Decrease quantity" onClick={() => onChange(Math.max(1, value - 1))}>
        <Icon name="minus" className="icon icon-sm" />
      </button>
      <span className="qty-val">{value}</span>
      <button type="button" aria-label="Increase quantity" onClick={() => onChange(Math.min(10, value + 1))}>
        <Icon name="plus" className="icon icon-sm" />
      </button>
    </div>
  );
}
