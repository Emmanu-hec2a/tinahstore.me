export default function BackpackIllustration({ color = 'currentColor' }) {
  return (
    <svg viewBox="0 0 200 200" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M52 76 Q52 50 100 50 Q148 50 148 76 V154 Q148 162 140 162 H60 Q52 162 52 154 Z" />
      <line x1="68" y1="50" x2="60" y2="22" />
      <line x1="132" y1="50" x2="140" y2="22" />
    </svg>
  );
}
