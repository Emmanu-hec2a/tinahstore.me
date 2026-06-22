import { Link } from 'react-router-dom';

export default function Button({ to, className = 'btn btn-primary', children, ...props }) {
  if (to) {
    return (
      <Link to={to} className={className} {...props}>
        {children}
      </Link>
    );
  }
  return (
    <button className={className} {...props}>
      {children}
    </button>
  );
}
