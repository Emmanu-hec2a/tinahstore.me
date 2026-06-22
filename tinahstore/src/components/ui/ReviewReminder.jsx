import { useState, useEffect } from 'react';
import Icon from '../icons/Icon.jsx';
import ReviewModal from './ReviewModal.jsx';

export default function ReviewReminder({ orders }) {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Look for delivered orders that haven't been reviewed
    // and where we haven't shown a reminder recently
    const deliveredOrders = orders.filter(o => o.status === 'delivered' && !o.is_fully_reviewed);

    if (deliveredOrders.length > 0) {
      const lastReminder = localStorage.getItem('review-reminder-ts');
      const now = Date.now();

      // Show if never shown or if 'remind later' was clicked more than 24 hours ago
      if (!lastReminder || (now - parseInt(lastReminder)) > 86400000) {
        const timer = setTimeout(() => {
          setSelectedOrder(deliveredOrders[0]);
          // Pick the first item to review
          setSelectedProduct(deliveredOrders[0].items[0]);
          setShowPopup(true);
        }, 5000); // Show after 5 seconds of browsing
        return () => clearTimeout(timer);
      }
    }
  }, [orders]);

  const handleRemindLater = () => {
    localStorage.setItem('review-reminder-ts', Date.now().toString());
    setShowPopup(false);
  };

  const handleCancel = () => {
    // Set a very far future date to effectively "never remind again" for this session/user
    localStorage.setItem('review-reminder-ts', (Date.now() + 31536000000).toString());
    setShowPopup(false);
  };

  if (!showPopup) return null;

  return (
    <>
      <div className="review-reminder-popup">
        <div className="popup-icon"><Icon name="star" /></div>
        <div className="popup-content">
          <h4>Share your thoughts!</h4>
          <p>Your order <b>{selectedOrder.order_number}</b> was delivered. How do you like your items?</p>
          <div className="popup-actions">
            <button className="btn btn-primary btn-sm" onClick={() => setShowPopup(false)}>Rate Now</button>
            <button className="btn btn-ghost btn-sm" onClick={handleRemindLater}>Remind Later</button>
            <button className="btn btn-ghost btn-sm" onClick={handleCancel}>Not Now</button>
          </div>
        </div>
      </div>

      {/* If "Rate Now" is clicked (technically just closing the popup but we could open modal directly) */}
      {/* In this implementation, the "Rate Now" button just prepares the modal to be opened */}
    </>
  );
}
