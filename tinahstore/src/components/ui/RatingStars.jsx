import Icon from '../icons/Icon.jsx';

export default function RatingStars({ rating, reviews, compact = false }) {
  const roundedRating = Math.round(rating);

  return (
    <div className="rating">
      <div className="stars">
        {Array.from({ length: 5 }).map((_, index) => (
          <Icon
            name="star"
            key={index}
            className={`icon icon-sm ${index < roundedRating ? 'star-active' : 'star-muted'}`}
          />
        ))}
      </div>
      <span className="muted" style={{ marginLeft: 6 }}>
        {compact ? rating : `${rating} (${reviews})`}
      </span>
    </div>
  );
}
