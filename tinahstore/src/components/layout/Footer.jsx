import { Link } from 'react-router-dom';
import Icon from '../icons/Icon.jsx';

export default function Footer({ compact = false }) {
  if (compact) {
    return (
      <footer className="site-footer">
        <div className="container footer-bottom" style={{ borderTop: 'none', paddingTop: 0 }}>
          <span>© 2026 TinahStore. All rights reserved.</span>
          <div className="contact-line" style={{ margin: 0 }}><Icon name="mail" className="icon icon-sm" /> Need help? hello@tinahstore.co.ke</div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="site-footer" id="footer-contact">
      <div className="container footer-grid">
        <div className="footer-brand">
          <Link to="/" className="logo">Tinah<span>Store</span></Link>
          <p>Hand-finished bags designed in Nairobi, built for the everyday. Full-grain leather, honest pricing, easy M-PESA checkout.</p>
          <div className="footer-social">
            <a href="#" aria-label="Instagram"><Icon name="instagram" /></a>
            <a href="#" aria-label="Facebook"><Icon name="facebook" /></a>
            <a href="#" aria-label="WhatsApp"><Icon name="whatsapp" /></a>
          </div>
        </div>
        <div className="footer-col">
          <h4>Shop</h4>
          {['Totes', 'Crossbody', 'Backpacks', 'Clutches', 'Sale'].map((item) => <Link to="/shop" key={item}>{item}</Link>)}
        </div>
        <div className="footer-col">
          <h4>Help</h4>
          {['Track an order', 'Shipping & returns', 'Size & care guide', 'FAQs'].map((item) => <a href="#" key={item}>{item}</a>)}
        </div>
        <div className="footer-col">
          <h4>Connect</h4>
          <div className="contact-line"><Icon name="mapPin" className="icon icon-sm" /> Nairobi, Kenya</div>
          <div className="contact-line"><Icon name="phone" className="icon icon-sm" /> +254 715 877 563</div>
          <div className="contact-line"><Icon name="mail" className="icon icon-sm" /> support@tinahstore.store</div>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 TinahStore. All rights reserved.</span>
        <div className="pay-icons">
          <span className="pay-chip">M-PESA</span>
          <span className="pay-chip">VISA</span>
          <span className="pay-chip">MASTERCARD</span>
        </div>
      </div>
    </footer>
  );
}
