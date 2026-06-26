import { Link } from 'react-router-dom';
import { useContext } from 'react';
import Icon from '../icons/Icon.jsx';
import HangTag from '../ui/HangTag.jsx';
import RatingStars from '../ui/RatingStars.jsx';
import Badge from '../ui/Badge.jsx';
import ProductArt from './ProductArt.jsx';
import { WishlistContext } from '../../context/WishlistContext.jsx';
import { useCart } from '../../hooks/useCart.js';
import { useToast } from '../../context/ToastContext.jsx';

export default function ProductCard({ product, quickAdd = false, className = '' }) {
  const wishlist = useContext(WishlistContext);
  const cart = useCart();
  const { showToast } = useToast();
  const wished = wishlist.ids.includes(product.id);

  return (
    <Link to={`/product/${product.slug}`} className={`product-card ${className}`}>
      <div className="media">
        {product.badge && <Badge tone={product.badge === 'New' ? 'new' : 'sale'} className="sale-pill">{product.badge}</Badge>}
        <button
          className={`icon-btn wish ${wished ? 'active' : ''}`}
          aria-label="Wishlist"
          onClick={(event) => {
            event.preventDefault();
            wishlist.toggle(product.id);
          }}
        >
          <Icon name="heart" />
        </button>
        {product.primary_image ? (
          <img src={product.primary_image} alt={product.name} className="product-image" />
        ) : (
          <div className="art-fallback">
            <ProductArt product={product} />
          </div>
        )}
        {quickAdd && (
          <div className="quick">
            <button
              type="button"
              onClick={(event) => {
                event.preventDefault();
                cart.addItem(product);
                showToast(`${product.name} added to cart!`);
              }}
            >
              Quick add <Icon name="bag" className="icon icon-sm" />
            </button>
          </div>
        )}
      </div>
      <div className="body">
        <div className="cat">{product.category}</div>
        <h3>{product.name}</h3>
        <RatingStars rating={product.rating} reviews={product.reviews} compact={!quickAdd} />
        <HangTag price={product.price} compareAt={product.compareAt} />
      </div>
    </Link>
  );
}
