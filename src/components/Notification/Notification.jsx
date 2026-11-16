import { useCart } from '../../context/CartContext';
import './Notification.css';

const Notification = () => {
  const { notification } = useCart();

  if (!notification) return null;

  const icons = {
    success: '✅',
    error: '❌',
    warning: '⚠️',
    info: 'ℹ️'
  };

  const colors = {
    success: 'var(--badge-success)',
    error: 'var(--badge-danger)',
    warning: 'var(--badge-warning)',
    info: 'var(--badge-info)'
  };

  return (
    <div
      key={notification.id}
      className="notification-toast"
      role="alert"
      aria-live="polite"
      style={{ '--toast-color': colors[notification.type] || colors.info }}
    >
      <div className="notification-content">
        <span className="notification-icon" aria-hidden="true">
          {icons[notification.type] || icons.info}
        </span>
        <p className="notification-message">{notification.message}</p>
      </div>
      <div className="notification-progress" style={{ background: `var(--toast-color)` }}></div>
    </div>
  );
};

export default Notification;