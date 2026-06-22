import { useState } from 'react';
import Icon from '../icons/Icon.jsx';
import { api } from '../../services/api.js';

export default function ReviewModal({ order, product, onClose, onReviewed }) {
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    if (rating === 0) {
      setError('Please select a rating');
      return;
    }

    setSubmitting(true);
    try {
      await api.submitReview({
        product: product.id,
        order: order.id,
        customer_name: order.customer_name,
        rating,
        comment
      });
      onReviewed(product.id);
      onClose();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal-card review-modal">
        <button className="close-btn" onClick={onClose}><Icon name="x" /></button>
        <h3>How was your {product.name}?</h3>
        <p className="muted">Your feedback helps us improve our workbench craft.</p>

        <form onSubmit={handleSubmit}>
          <div className="star-rating">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`star-btn ${(hover || rating) >= star ? 'active' : ''}`}
                onClick={() => setRating(star)}
                onMouseEnter={() => setHover(star)}
                onMouseLeave={() => setHover(0)}
              >
                <Icon name="star" />
              </button>
            ))}
          </div>

          <div className="form-field">
            <label>Add a comment (optional)</label>
            <textarea
              placeholder="What did you like about the leather, finishing, or fit?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows="4"
            />
          </div>

          {error && <p className="error-text">{error}</p>}

          <button className="btn btn-primary btn-block" disabled={isSubmitting}>
            {isSubmitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      </div>
    </div>
  );
}
