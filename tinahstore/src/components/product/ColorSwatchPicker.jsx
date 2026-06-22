export default function ColorSwatchPicker({ colors, selected, onChange }) {
  return (
    <div className="color-options">
      {colors.map((color) => (
        <button
          className={`color-dot ${selected.name === color.name ? 'active' : ''}`}
          key={color.name}
          type="button"
          aria-label={color.name}
          onClick={() => onChange(color)}
        >
          <span className="fill" style={{ background: color.hex }} />
        </button>
      ))}
    </div>
  );
}
