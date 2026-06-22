export default function CrossbodyIllustration({ color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M70 86 H132 L126 158 Q125.5 162 121.5 162 H80.5 Q76.5 162 76 158 Z" />
      <path d="M70 86 L34 34 M132 86 L168 34" />
    </svg>
  );
}
