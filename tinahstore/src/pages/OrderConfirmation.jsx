import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Footer from '../components/layout/Footer.jsx';
import Icon from '../components/icons/Icon.jsx';
import ProductArt from '../components/product/ProductArt.jsx';
import { formatKes } from '../data/products.js';
import { api } from '../services/api.js';

const supportEmail = 'petniqueke@gmail.com';
const supportPhone = '254726911763';

export default function OrderConfirmation() {
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order);
  const [paymentStatus, setPaymentStatus] = useState('pending_verification');

  // Polling removed for manual flow
  useEffect(() => {
    // We only set to 'paid' if the order object already says so (e.g. from backend)
    if (order?.deposit_paid) {
      setPaymentStatus('paid');
    }
  }, [order]);

  async function handleRetryPayment() {
    if (!order) return;
    setRetryStatus('loading');
    try {
      const response = await api.retriggerMpesaStkPush(order.order_number);
      setCheckoutRequestId(response.checkout_request_id);
      setRetryStatus('success');
      setTimeout(() => setRetryStatus(null), 3000);
    } catch (err) {
      setRetryStatus('error');
      alert(err.message || 'Failed to re-trigger payment. Please contact support.');
    }
  }

  if (!order) {
    return (
      <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}>
        <h2>Order not found</h2>
        <Link to="/shop" className="btn btn-primary">Go to shop</Link>
      </div>
    );
  }

  const encodedTrackingMessage = encodeURIComponent(`Hi TinahStore, I would like to track order ${order.order_number}.`);
  const receiptSubject = encodeURIComponent(`TinahStore order ${order.order_number}`);
  const receiptBody = encodeURIComponent(
    `Hello TinahStore,\n\nPlease help me with order ${order.order_number}.\nTotal: ${formatKes(order.total_amount)}\n`
  );

  return (
    <>
      <header className="checkout-header">
        <div className="container">
          <Link to="/" className="logo">Tinah<span>Store</span></Link>
          <div className="secure-pill">
            <Icon name="lock" className="icon icon-sm" />
            {paymentStatus === 'paid' ? 'Order confirmed' : 'Verification in progress'}
          </div>
        </div>
      </header>

      <main className="container">
        <div className="steps">
          <div className="step done"><span className="num"><Icon name="check" className="icon icon-sm" /></span> Bag</div>
          <div className="step-line"></div>
          <div className="step done"><span className="num"><Icon name="check" className="icon icon-sm" /></span> Checkout</div>
          <div className="step-line"></div>
          <div className="step active">
            <span className="num">{paymentStatus === 'paid' ? <Icon name="check" className="icon icon-sm" /> : '3'}</span> Confirmation
          </div>
        </div>

        <div className="confirm-layout">
          <section className="confirm-hero" aria-labelledby="confirmation-title">
            <div className={`confirm-icon ${paymentStatus === 'paid' ? 'success' : 'pending'}`}>
              <Icon name={paymentStatus === 'paid' ? 'checkCircle' : 'clock'} />
            </div>
            <p className="eyebrow" style={{ justifyContent: 'center' }}>Order {order.order_number}</p>
            <h1 className="h2" id="confirmation-title">
              {paymentStatus === 'paid' ? `Thank you, ${order.customer_name}.` : 'Verification in progress'}
            </h1>
            <p className="lede" style={{ margin: '14px auto 0', maxWidth: 600 }}>
              {paymentStatus === 'paid'
                ? "Your order is confirmed and being prepared at our Nairobi workshop. We'll message you once it's out for delivery."
                : `We've received your order and the Transaction Code (${order.transaction_code || location.state?.transactionCode || 'N/A'}). Our team is manually verifying the deposit. You'll receive a confirmation message shortly.`}
            </p>

            {paymentStatus === 'paid' ? (
              <div className="confirm-actions">
                <Link to="/shop" className="btn btn-primary"><Icon name="bag" className="icon icon-sm" /> Continue shopping</Link>
                <button className="btn btn-outline" type="button" onClick={() => window.print()}><Icon name="printer" className="icon icon-sm" /> Print receipt</button>
              </div>
            ) : (
              <div className="confirm-actions">
                <a
                  href={`https://wa.me/${supportPhone}?text=${encodeURIComponent(`Hi TinahStore, I've just placed order ${order.order_number} and paid the deposit. Transaction code: ${order.transaction_code || ''}`)}`}
                  className="btn btn-primary"
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="whatsapp" className="icon icon-sm" /> Confirm on WhatsApp
                </a>
              </div>
            )}
          </section>

          <section className="confirm-card confirm-summary" aria-label="Order details">
            <h3>Order details</h3>
            <div className="confirm-row"><span>Order number</span><span className="mono">{order.order_number}</span></div>
            <div className="confirm-row"><span>Payment method</span><span>M-PESA Deposit + Cash on Delivery</span></div>
            <div className="confirm-row">
              <span>Status</span>
              <span className={`confirm-status ${paymentStatus}`}>
                <Icon name={paymentStatus === 'paid' ? 'checkCircle' : 'clock'} className="icon icon-sm" />
                {paymentStatus === 'paid' ? 'Deposit Verified' : 'Awaiting Verification'}
              </span>
            </div>
            {order.transaction_code && (
               <div className="confirm-row"><span>Transaction Code</span><span className="mono">{order.transaction_code}</span></div>
            )}
            <div className="confirm-row"><span>Delivery address</span><span>{order.delivery_address}, {order.city}</span></div>
          </section>

          <section className="confirm-card confirm-items" aria-label="Ordered items">
            <div className="confirm-card-head">
              <h3>Payment Breakdown</h3>
            </div>
            <div className="summary-row"><span>Total amount</span><span>{formatKes(order.total_amount)}</span></div>
            <div className="summary-row" style={{ color: '#059669', fontWeight: 600 }}>
              <span>60% Deposit (M-PESA)</span>
              <span>{formatKes(order.deposit_amount)}</span>
            </div>
            <div className="summary-row" style={{ color: '#d97706', fontWeight: 600 }}>
              <span>40% Balance (Cash on Delivery)</span>
              <span>{formatKes(order.balance_amount)}</span>
            </div>

            <h3 style={{ marginTop: 24, fontSize: 16 }}>Items</h3>
            {order.items?.map((item, idx) => (
              <div className="mini-row" key={idx}>
                <div className="thumb-box">
                  {item.primary_image ? (
                    <img src={item.primary_image} alt={item.product_slug} className="product-image" />
                  ) : (
                    <div style={{ backgroundColor: '#f3f4f6', width: '100%', height: '100%', borderRadius: 'var(--radius-md)' }}></div>
                  )}
                </div>
                <div>
                  <div className="name">{item.product_slug}</div>
                  <div className="qty-tag">{`Quantity: ${item.quantity}`}</div>
                </div>
                <div className="price">{formatKes(item.unit_price)}</div>
              </div>
            ))}
          </section>

          <section className="confirm-help" aria-label="Order support">
            <a className="contact-card" href={`https://wa.me/${supportPhone}?text=${encodedTrackingMessage}`} target="_blank" rel="noreferrer">
              <span className="contact-icon" style={{ backgroundColor: '#25D366' }}><Icon name="whatsapp" /></span>
              <span><strong>Track on WhatsApp</strong><span>Fastest help for delivery updates</span></span>
            </a>
            <a className="contact-card" href={`mailto:${supportEmail}?subject=${receiptSubject}&body=${receiptBody}`}>
              <span className="contact-icon" style={{ backgroundColor: '#0D3B36' }}><Icon name="mail" /></span>
              <span><strong>Email support</strong><span>{supportEmail}</span></span>
            </a>
          </section>
        </div>
      </main>

      <Footer compact />
    </>
  );
}
