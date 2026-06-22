import { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icon from '../components/icons/Icon.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { api } from '../services/api.js';

export default function Wishlist() {
  const wishlist = useContext(WishlistContext);
  const [wishedProducts, setWishedProducts] = useState([]);
  const [isLoading, setLoading] = useState(wishlist.ids.length > 0);

  useEffect(() => {
    async function fetchWishedProducts() {
      if (wishlist.ids.length === 0) {
        setWishedProducts([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      try {
        // Fetch products that match the IDs in the wishlist
        // We fetch all products and filter locally for simplicity,
        // or add a specialized 'listByIds' endpoint if needed.
        const data = await api.listProducts();
        const allProducts = data.results || data;
        const filtered = allProducts.filter((p) => wishlist.ids.includes(p.id));
        setWishedProducts(filtered);
      } catch (err) {
        console.error('Failed to load wishlist items', err);
      } finally {
        setLoading(false);
      }
    }

    fetchWishedProducts();
  }, [wishlist.ids]);

  return (
    <>
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link><span className="sep">/</span><span className="current">Wishlist</span>
        </nav>
        <div className="page-head">
          <div>
            <p className="eyebrow">Saved bags</p>
            <h2 className="h2">Your wishlist</h2>
            <span className="muted" style={{ fontSize: 13.5 }}>
              {wishlist.count} saved item{wishlist.count === 1 ? '' : 's'}
            </span>
          </div>
          <Link to="/shop" className="btn btn-outline btn-sm">Browse more</Link>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 90 }}>
        {isLoading ? (
          <div className="shop-empty"><h3>Loading your favourites...</h3></div>
        ) : wishedProducts.length > 0 ? (
          <div className="product-grid">
            {wishedProducts.map((product) => (
              <ProductCard product={product} quickAdd key={product.id} />
            ))}
          </div>
        ) : (
          <div className="shop-empty">
            <Icon name="heart" className="icon icon-lg" />
            <h3>No saved bags yet</h3>
            <p className="muted">Tap the heart on a product to keep it here while you decide.</p>
            <Link to="/shop" className="btn btn-primary btn-sm">Shop bags</Link>
          </div>
        )}
      </div>
    </>
  );
}
