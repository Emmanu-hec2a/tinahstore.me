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
  const [error, setError] = useState(null);
  const [deliveryArea, setDeliveryArea] = useState('nairobi');
  const [transactionCode, setTransactionCode] = useState('');

  const wishlist = useContext(WishlistContext);
  const cart = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    if (deliveryArea === 'nairobi') {
      cart.setDeliveryFee(150);
    } else {
      cart.setDeliveryFee(0); // Show as variable/TBD
    }
  }, [deliveryArea]);

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
      payment_method: 'mpesa_manual',
      transaction_code: transactionCode,
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
                <div className="form-field">
                  <label>Delivery Area</label>
                  <select
                    name="deliveryArea"
                    value={deliveryArea}
                    onChange={(e) => setDeliveryArea(e.target.value)}
                    required
                  >
                    <option value="nairobi">Nairobi, Juja, Thika, Thika Rd (KES 150)</option>
                    <option value="other">Outside these areas (Fee varies)</option>
                  </select>
                </div>
                <Field label="City / Town" name="city" placeholder="Nairobi" required />
                <div className="form-field">
                  <label>County</label>
                  <select name="county" required>
                    <option value="Nairobi">Nairobi</option>
                    <option value="Mombasa">Mombasa</option>
                    <option value="Kisumu">Kisumu</option>
                    <option value="Nakuru">Nakuru</option>
                    <option value="Kiambu">Kiambu</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </div>
            <div className="form-section">
              <h3>Payment method</h3>
              <div className="pay-options">
                <PayOption active={payment === 'manual'} onChange={() => setPayment('manual')} name="pay" value="manual" icon="phone" label="M-PESA / Airtel Money (Manual Verification)">
                  <div style={{ background: 'var(--teal-pale)', padding: '14px', borderRadius: 8, fontSize: 13, color: 'var(--teal-ink)', marginBottom: 16, border: '1px solid var(--hairline)' }}>
                    <p><b>Instructions:</b></p>
                    <p style={{ marginTop: 6 }}>1. Send the 60% deposit (<b>{formatKes(cart.total * 0.6)}</b>) to the number below:</p>
                    <div style={{ marginTop: 10, padding: '10px', background: 'var(--surface)', borderRadius: 6, border: '1px solid var(--hairline)' }}>
                      <p><b>M-PESA:</b> 0726911763 (CHRISTINE)</p>
                      <p><b>Airtel Money:</b> 0750243752 (CHRISTINE)</p>
                    </div>
                    <p style={{ marginTop: 12 }}>2. Enter your <b>Transaction Code</b> below (e.g., RJL1234567):</p>
                    <input
                      type="text"
                      placeholder="Transaction Code"
                      value={transactionCode}
                      onChange={(e) => setTransactionCode(e.target.value.toUpperCase())}
                      style={{
                        width: '100%',
                        marginTop: 8,
                        padding: '10px',
                        borderRadius: 6,
                        border: '1px solid var(--hairline)',
                        textTransform: 'uppercase',
                        fontWeight: 'bold'
                      }}
                      required={payment === 'manual'}
                    />
                  </div>
                  <p className="muted" style={{ fontSize: 12 }}>Your order will be verified manually. Remaining 40% balance is paid on delivery.</p>
                </PayOption>
              </div>
            </div>
            <button
              className="btn btn-primary btn-block"
              disabled={isSubmitting || cart.items.length === 0 || (payment === 'manual' && !transactionCode)}
            >
              {isSubmitting ? 'Placing order...' : 'Confirm Order & Pay Deposit'}
            </button>
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
              {(item.product.image || item.product.primary_image || (item.product.images && item.product.images[0]?.image)) ? (
                <img
                  src={item.product.image || item.product.primary_image || item.product.images[0]?.image}
                  alt={item.product.name}
                  className="product-image"
                />
              ) : (
                <ProductArt product={item.product} color="#0D3B36" />
              )}
            </div>
            <div><div className="name">{item.product.name}</div><div className="qty-tag">{[item.color, item.size, `x${item.quantity}`].filter(Boolean).join(' - ')}</div></div><div className="price">{(item.product.price * item.quantity).toLocaleString('en-KE')}</div>
          </div>
        ))}
      </div>
      <div className="summary-row"><span>Subtotal</span><span>{formatKes(cart.subtotal)}</span></div>
      <div className="summary-row">
        <span>Delivery {cart.deliveryFee > 0 ? '' : '(TBD)'}</span>
        <span>{cart.deliveryFee > 0 ? formatKes(cart.deliveryFee) : 'variable'}</span>
      </div>
      <div className="summary-row total"><span>Total</span><span>{formatKes(cart.total)}</span></div>
      <div className="summary-row" style={{ color: 'var(--teal-mid)', fontWeight: 600 }}>
        <span>60% Deposit</span>
        <span>{formatKes(cart.total * 0.6)}</span>
      </div>
      <div className="secure-note"><Icon name="lock" className="icon icon-sm" /> Secure SSL encrypted payment</div>
    </div>
  );
}
