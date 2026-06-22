import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect, useContext } from 'react';
import Footer from '../components/layout/Footer.jsx';
import Icon from '../components/icons/Icon.jsx';
import ProductArt from '../components/product/ProductArt.jsx';
import { formatKes } from '../data/products.js';
import { useCart } from '../hooks/useCart.js';
import { api } from '../services/api.js';
import { WishlistContext } from '../context/WishlistContext.jsx';

export default function Checkout() {
  const [payment, setPayment] = useState('manual');
  const [isSubmitting, setSubmitting] = useState(false);
  const [canSubmitManual, setCanSubmitManual] = useState(false);
  const [manualTimer, setManualTimer] = useState(30);
  const [error, setError] = useState(null);
  const wishlist = useContext(WishlistContext);
  const cart = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    let interval;
    if (payment === 'manual' && manualTimer > 0) {
      interval = setInterval(() => {
        setManualTimer((prev) => prev - 1);
      }, 1000);
    } else if (payment === 'manual' && manualTimer === 0) {
      setCanSubmitManual(true);
    }
    return () => clearInterval(interval);
  }, [payment, manualTimer]);

  async function placeOrder(event) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const formData = new FormData(event.currentTarget);
    const payload = {
      customer_name: formData.get('fullName'),
      customer_email: formData.get('email'),
      customer_phone: formData.get('phone'),
      delivery_address: formData.get('address'),
      city: formData.get('city'),
      county: formData.get('county'),
      payment_method: payment,
      items: cart.items.map(item => ({
        product_slug: item.product.slug,
        variant_id: item.variantId || null,
        quantity: item.quantity
      }))
    };

    try {
      const response = await api.createOrder(payload);

      // Clear cart after successful order creation
      cart.clear();

      navigate('/confirmation', {
        state: {
          order: response,
          checkoutRequestId: response.checkout_request_id
        },
      });
    } catch (err) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <header className="checkout-header"><div className="container"><Link to="/" className="logo">Tinah<span>Store</span></Link><div className="secure-pill"><Icon name="lock" className="icon icon-sm" /> Secure checkout</div></div></header>
      <div className="container">
        <div className="steps"><div className="step done"><span className="num"><Icon name="check" className="icon icon-sm" /></span> Bag</div><div className="step-line"></div><div className="step active"><span className="num">2</span> Checkout</div><div className="step-line"></div><div className="step"><span className="num">3</span> Confirmation</div></div>

        {error && (
          <div className="alert alert-error" style={{ marginTop: 20, padding: '12px 16px', backgroundColor: '#fee2e2', color: '#b91c1c', borderRadius: 8, fontSize: 14 }}>
            <Icon name="alertCircle" className="icon icon-sm" /> {error}
          </div>
        )}

        <div className="checkout-layout" style={{ marginTop: 20, paddingBottom: 90 }}>
          <form onSubmit={placeOrder}>
            <div className="form-section">
              <h3>Contact & shipping details</h3>
              <div className="form-grid">
                <Field className="full" label="Full name" name="fullName" placeholder="Amani Njoroge" required />
                <Field label="Phone number" name="phone" placeholder="0712345678" type="tel" required />
                <Field label="Email" name="email" placeholder="amani@email.com" type="email" required />
                <Field className="full" label="Delivery address" name="address" placeholder="Street, building, apartment" required />
                <Field label="City / Town" name="city" placeholder="Nairobi" required />
                <div className="form-field">
                  <label>County</label>
                  <select name="county" required>
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Kiambu">Kiambu</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-section">
              <h3>Payment method</h3>
              <div className="pay-options">
                <PayOption active={payment === 'manual'} onChange={() => { setPayment('manual'); setManualTimer(30); setCanSubmitManual(false); }} name="pay" value="manual" icon="phone" label="Mobile Money (M-PESA / Airtel)">
                  <div style={{ background: 'var(--oxblood-pale)', padding: '12px', borderRadius: 8, fontSize: 13, color: 'var(--oxblood)', marginBottom: 16, border: '1px solid var(--oxblood)' }}>
                    <p><b>Note:</b> Automated STK Push is currently undergoing maintenance. Please use the manual <b>Send Money</b> option below to secure your order.</p>
                  </div>
                  <p className="muted" style={{ fontSize: 13, marginBottom: 12 }}>
                    Send the 60% deposit (<b>{formatKes(cart.total * 0.6)}</b>) to:
                  </p>
                  <div style={{ background: 'var(--surface-raised)', padding: '10px', borderRadius: 8, fontSize: 13, border: '1px solid var(--hairline)' }}>
                    <p><b>M-PESA:</b> 0715877563 (Tinah)</p>
                    <p><b>Airtel Money:</b> 0750243752 (Tinah)</p>
                  </div>
                  <p className="muted" style={{ fontSize: 12, marginTop: 12 }}>Your order will be processed once we verify the transaction. Remaining 40% paid in cash on delivery.</p>
                </PayOption>
              </div>
            </div>
            <button
              className="btn btn-primary btn-block"
              disabled={isSubmitting || cart.items.length === 0 || (payment === 'manual' && !canSubmitManual)}
            >
              {isSubmitting ? 'Placing order...' : (payment === 'manual' && !canSubmitManual) ? `I have sent the deposit (${manualTimer}s)` : 'Place order'}
            </button>
            {payment === 'manual' && !canSubmitManual && (
              <p className="muted text-center" style={{ fontSize: 12, marginTop: 10 }}>Proceed to pay, will be enabled once payment is sent</p>
            )}
          </form>
          <aside><OrderSummary cart={cart} /></aside>
        </div>
      </div>
      <Footer compact />
    </>
  );
}

function Field({ label, name, className = '', type = 'text', placeholder, required = false, disabled = false }) {
  return (
    <div className={`form-field ${className}`}>
      <label>{label}</label>
      <input name={name} type={type} placeholder={placeholder} required={required} disabled={disabled} />
    </div>
  );
}

function PayOption({ active, onChange, name, value, icon, label, children }) {
  return <div className={`pay-option ${active ? 'active' : ''}`}><label className="head"><input type="radio" name={name} value={value} checked={active} onChange={onChange} /><Icon name={icon} /> {label}</label><div className="pay-fields">{children}</div></div>;
}

function OrderSummary({ cart }) {
  return (
    <div className="summary-card" style={{ position: 'static' }}>
      <h3>Order summary</h3>
      <div className="mini-cart">
        {cart.items.map((item) => (
          <div className="mini-row" key={`${item.productId}-${item.color}-${item.size}`}>
            <div className="thumb-box">
              {item.product.primary_image ? (
                <img src={item.product.primary_image} alt={item.product.name} className="product-image" />
              ) : (
                <ProductArt product={item.product} color="#0D3B36" />
              )}
            </div>
            <div><div className="name">{item.product.name}</div><div className="qty-tag">{[item.color, item.size, `x${item.quantity}`].filter(Boolean).join(' - ')}</div></div><div className="price">{(item.product.price * item.quantity).toLocaleString('en-KE')}</div>
          </div>
        ))}
      </div>
      <div className="summary-row"><span>Subtotal</span><span>{formatKes(cart.subtotal)}</span></div>
      <div className="summary-row"><span>Delivery (Nairobi)</span><span>{formatKes(cart.deliveryFee)}</span></div>
      <div className="summary-row total"><span>Total</span><span>{formatKes(cart.total)}</span></div>
      <div className="secure-note"><Icon name="lock" className="icon icon-sm" /> Secure SSL encrypted payment</div>
    </div>
  );
}
