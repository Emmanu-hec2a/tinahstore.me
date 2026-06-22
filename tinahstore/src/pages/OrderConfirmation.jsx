import { Link, useLocation } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Footer from '../components/layout/Footer.jsx';
import Icon from '../components/icons/Icon.jsx';
import ProductArt from '../components/product/ProductArt.jsx';
import { formatKes } from '../data/products.js';
import { api } from '../services/api.js';

const supportEmail = 'hello@tinahstore.co.ke';
const supportPhone = '254700000000';

export default function OrderConfirmation() {
  const location = useLocation();
  const [order, setOrder] = useState(location.state?.order);
  const [checkoutRequestId, setCheckoutRequestId] = useState(location.state?.checkoutRequestId);
  const [paymentStatus, setPaymentStatus] = useState(order?.deposit_paid ? 'paid' : 'pending');
  const [retryStatus, setRetryStatus] = useState(null);

  // Poll for payment status
  useEffect(() => {
    if (paymentStatus === 'paid' || !checkoutRequestId) return;

    const interval = setInterval(async () => {
      try {
        const status = await api.getMpesaStatus(checkoutRequestId);
        if (status.deposit_paid) {
          setPaymentStatus('paid');
          // Update order locally to reflect payment
          setOrder(prev => ({ ...prev, deposit_paid: true, status: status.order_status }));
          clearInterval(interval);
        }
      } catch (err) {
        console.error('Polling error:', err);
      }
    }, 3000);

    // Stop polling after 2 minutes to save resources
    const timeout = setTimeout(() => clearInterval(interval), 120000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [checkoutRequestId, paymentStatus]);

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
            {paymentStatus === 'paid' ? 'Order confirmed' : 'Awaiting deposit'}
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
              {paymentStatus === 'paid' ? `Thank you, ${order.customer_name}.` : 'Complete your deposit'}
            </h1>
            <p className="lede" style={{ margin: '14px auto 0', maxWidth: 600 }}>
              {paymentStatus === 'paid'
                ? "Your order is confirmed and being prepared at our Nairobi workshop. We'll message you once it's out for delivery."
                : "We've sent an M-PESA payment prompt to your phone. Please enter your PIN to confirm the 60% deposit. This page will update automatically."}
            </p>

            {paymentStatus !== 'paid' && (
              <div className="confirm-actions" style={{ marginTop: 24 }}>
                <button
                  className="btn btn-primary"
                  onClick={handleRetryPayment}
                  disabled={retryStatus === 'loading'}
                >
                  <Icon name="refresh" className={`icon icon-sm ${retryStatus === 'loading' ? 'spin' : ''}`} />
                  {retryStatus === 'loading' ? 'Sending prompt...' : 'Resend M-PESA prompt'}
                </button>
                {retryStatus === 'success' && <p className="muted" style={{ fontSize: 13, color: '#059669', marginTop: 8 }}>Prompt sent! Check your phone.</p>}
              </div>
            )}

            {paymentStatus === 'paid' && (
              <div className="confirm-actions">
                <Link to="/shop" className="btn btn-primary"><Icon name="bag" className="icon icon-sm" /> Continue shopping</Link>
                <button className="btn btn-outline" type="button" onClick={() => window.print()}><Icon name="printer" className="icon icon-sm" /> Print receipt</button>
              </div>
            )}
          </section>

          <section className="confirm-card confirm-summary" aria-label="Order details">
            <h3>Order details</h3>
            <div className="confirm-row"><span>Order number</span><span className="mono">{order.order_number}</span></div>
            <div className="confirm-row"><span>Payment method</span><span>{order.payment_method === 'mpesa' ? 'M-PESA + Cash' : 'Card'}</span></div>
            <div className="confirm-row">
              <span>Status</span>
              <span className={`confirm-status ${paymentStatus}`}>
                <Icon name={paymentStatus === 'paid' ? 'checkCircle' : 'clock'} className="icon icon-sm" />
                {paymentStatus === 'paid' ? 'Deposit Paid' : 'Pending Deposit'}
              </span>
            </div>
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
