import { Link } from 'react-router-dom';
import Icon from '../components/icons/Icon.jsx';
import Stepper from '../components/ui/Stepper.jsx';
import ProductArt from '../components/product/ProductArt.jsx';
import { formatKes } from '../data/products.js';
import { useCart } from '../hooks/useCart.js';

export default function Cart() {
  const cart = useCart();

  return (
    <>
      <div className="container">
        <nav className="breadcrumb"><Link to="/">Home</Link><span className="sep">/</span><span className="current">Your bag</span></nav>
        <div className="page-head"><div><h2 className="h2">Your shopping bag</h2><span className="muted" style={{ fontSize: 13.5 }}>{cart.count} items</span></div></div>
      </div>
      <div className="container" style={{ paddingBottom: 96 }}>
        <div className="cart-layout">
          <div>
            {cart.items.length === 0 && (
              <div className="cart-empty"><Icon name="bag" /><h3>Your bag is empty</h3><Link to="/shop" className="btn btn-primary" style={{ marginTop: 18 }}>Start shopping</Link></div>
            )}
            {cart.items.map((item) => (
              <div className="cart-row" key={`${item.productId}-${item.color}-${item.size}`}>
                <div className="thumb-box">
                  { (item.product.image || item.product.primary_image || (item.product.images && item.product.images[0]?.image)) ? (
                    <img
                      src={item.product.image || item.product.primary_image || item.product.images[0]?.image}
                      alt={item.product.name}
                      className="product-image"
                    />
                  ) : (
                    <ProductArt product={item.product} color="#0D3B36" />
                  )}
                </div>
                <div className="info-col"><h3>{item.product.name}</h3><span className="variant">{[item.color, item.size].filter(Boolean).join(' - ')}</span></div>
                <div className="qty-col"><Stepper value={item.quantity} onChange={(qty) => cart.updateQuantity(item.productId, qty)} /></div>
                <div className="price-col"><span className="line-total">{formatKes(item.product.price * item.quantity)}</span></div>
                <button className="icon-btn remove-btn remove-col" aria-label="Remove item" onClick={() => cart.removeItem(item.productId)}><Icon name="trash" /></button>
              </div>
            ))}
            <div style={{ paddingTop: 24 }}><Link to="/shop" className="btn btn-ghost"><Icon name="arrowLeft" className="icon icon-sm" /> Continue shopping</Link></div>
          </div>

          <aside className="summary-card">
            <h3>Order summary</h3>
            <div className="summary-row"><span>Subtotal</span><span>{formatKes(cart.subtotal)}</span></div>
            <div className="summary-row"><span>Delivery (Nairobi)</span><span>{cart.items.length ? formatKes(cart.deliveryFee) : formatKes(0)}</span></div>
            <div className="promo-row"><input type="text" placeholder="Promo code" /><button className="btn btn-outline btn-sm">Apply</button></div>
            <div className="summary-row total"><span>Total</span><span>{formatKes(cart.total)}</span></div>
            <Link to="/checkout" className={`btn btn-primary btn-block ${cart.items.length ? '' : 'disabled'}`} style={{ marginTop: 18 }}>Proceed to checkout</Link>
            <div className="secure-note"><Icon name="lock" className="icon icon-sm" /> Secure checkout, encrypted end to end</div>
            <div className="summary-pay-icons"><span className="pay-chip">M-PESA</span><span className="pay-chip">VISA</span><span className="pay-chip">MASTERCARD</span></div>
          </aside>
        </div>
      </div>
    </>
  );
}
