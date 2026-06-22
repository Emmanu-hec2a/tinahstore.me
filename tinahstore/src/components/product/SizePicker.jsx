export default function SizePicker({ sizes, selected, onChange }) {
  return (
    <div className="size-options">
      {sizes.map((size) => (
        <button className={`size-pill ${selected === size ? 'active' : ''}`} key={size} type="button" onClick={() => onChange(size)}>
          {size}
        </button>
      ))}
    </div>
  );
}
