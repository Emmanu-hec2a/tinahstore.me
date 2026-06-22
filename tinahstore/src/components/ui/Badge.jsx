export default function Badge({ children, tone = 'new', className = '' }) {
  return <span className={`pill pill-${tone} ${className}`}>{children}</span>;
}
