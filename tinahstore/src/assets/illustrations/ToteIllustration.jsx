export default function ToteIllustration({ color = 'currentColor', detailed = false }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M58 72 C58 42 78 26 100 26 C122 26 142 42 142 72" />
      <path d="M42 72 H158 L148 168 Q147.5 176 139 176 H61 Q52.5 176 52 168 Z" />
      {detailed && <line x1="60" y1="104" x2="140" y2="104" stroke="#AD8A52" strokeWidth="1.3" strokeDasharray="3 5" />}
      {detailed && <circle cx="100" cy="72" r="3.4" fill="#AD8A52" stroke="none" />}
    </svg>
  );
}
