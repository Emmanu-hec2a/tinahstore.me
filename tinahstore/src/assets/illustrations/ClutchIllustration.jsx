export default function ClutchIllustration({ color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M48 84 Q48 78 54 78 H146 Q152 78 152 84 V148 Q152 154 146 154 H54 Q48 154 48 148 Z" />
      <path d="M86 78 Q86 64 100 64 Q114 64 114 78" />
    </svg>
  );
}
