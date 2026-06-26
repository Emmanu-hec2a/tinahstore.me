import { useToast } from '../../context/ToastContext.jsx';
import Icon from '../icons/Icon.jsx';

export default function ToastContainer() {
  const { toasts, removeToast } = useToast();

  if (toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type}`}>
          <span className="toast-icon">
            {toast.type === 'success' ? (
              <Icon name="checkCircle" className="icon-sm" />
            ) : (
              <Icon name="x" className="icon-sm" />
            )}
          </span>
          <span className="toast-message">{toast.message}</span>
          <button
            className="toast-close"
            onClick={() => removeToast(toast.id)}
            aria-label="Close notification"
          >
            <Icon name="x" className="icon-sm" />
          </button>
        </div>
      ))}
    </div>
  );
}
