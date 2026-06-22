import { iconPaths } from './iconPaths.js';

export default function Icon({ name, className = 'icon', title }) {
  const path = iconPaths[name];
  if (!path) return null;

  return (
    <span className={className} aria-hidden={title ? undefined : true}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
        role={title ? 'img' : undefined}
        dangerouslySetInnerHTML={{ __html: path }}
      />
    </span>
  );
}
