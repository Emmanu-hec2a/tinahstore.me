import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import Icon from '../components/icons/Icon.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import ToteIllustration from '../assets/illustrations/ToteIllustration.jsx';
import CrossbodyIllustration from '../assets/illustrations/CrossbodyIllustration.jsx';
import BackpackIllustration from '../assets/illustrations/BackpackIllustration.jsx';
import ClutchIllustration from '../assets/illustrations/ClutchIllustration.jsx';
import { useProducts } from '../hooks/useProducts.js';

const categories = [
  ['Totes', 'Structured everyday carry', ToteIllustration],
  ['Crossbody', 'Hands-free, city-ready', CrossbodyIllustration],
  ['Backpacks', 'For longer days, light loads', BackpackIllustration],
  ['Clutches', 'Evenings, weddings, travel', ClutchIllustration],
];

const contactLinks = [
  { label: 'Gmail', value: 'hello@tinahstore.co.ke', href: 'mailto:hello@tinahstore.co.ke', icon: 'mail' },
  { label: 'Phone', value: '+254 715 877 563', href: 'tel:+254715877563', icon: 'phone' },
  { label: 'WhatsApp', value: 'Chat with us', href: 'https://wa.me/254715877563', icon: 'whatsapp' },
  { label: 'TikTok', value: '@tinahstore', href: 'https://www.tiktok.com/@tinahstore', icon: 'tiktok' },
  { label: 'X', value: '@tinahstore', href: 'https://x.com/tinahstore', icon: 'xSocial' },
];

export default function Home() {
  const { products, isLoading } = useProducts({ ordering: '-created_at' });
  const { hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const element = document.getElementById(hash.replace('#', ''));
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [hash]);

  return (
    <>
      <section className="hero">
        <div className="container">
          <div className="hero-copy">
            <p className="eyebrow">New arrivals - AW26</p>
            <h1 className="h1">Bags that carry more than your things.</h1>
            <p className="lede">Hand-finished leather and canvas pieces, designed in Nairobi for everyday movement - from the office to the airport to everywhere between.</p>
            <div className="hero-actions">
              <Link to="/shop" className="btn btn-primary">Shop the collection</Link>
              <a href="#about" className="btn btn-outline">Our craft</a>
            </div>
          </div>
          <div className="hero-art">
            <div className="ring"></div>
            <ToteIllustration color="#0D3B36" detailed />
            <div className="hero-tag">
              <div className="tline">Hangtag</div>
              <div>Tinah's Store - Teal</div>
            </div>
          </div>
        </div>
      </section>

      <div className="trust-strip">
        <div className="container trust-grid">
          {[
            ['truck', 'Nairobi delivery', '8AM - 6PM'],
            ['shield', 'Pay safely', 'M-PESA'],
            ['leaf', 'Full-grain leather', 'Ethically sourced'],
            ['refresh', 'Easy exchanges', '0-day window'],
          ].map(([icon, title, copy]) => (
            <div className="trust-item" key={title}><Icon name={icon} className="icon icon-lg" /><div><strong>{title}</strong><span>{copy}</span></div></div>
          ))}
        </div>
      </div>

      <section>
        <div className="container">
          <div className="section-head"><div><p className="eyebrow">Browse</p><h2 className="h2">Shop by category</h2></div></div>
          <div className="cat-grid">
            {categories.map(([name, copy, Art]) => (
              <Link to={`/shop?category=${name.toLowerCase()}`} className="cat-card" key={name}>
                <div className="art"><Art color="#0D3B36" /></div>
                <h3>{name}</h3>
                <span className="muted" style={{ fontSize: 13 }}>{copy}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)' }}>
        <div className="container">
          <div className="section-head">
            <div><p className="eyebrow">Most carried</p><h2 className="h2">Best sellers</h2></div>
            <Link to="/shop" className="view-all">View all <Icon name="arrowRight" className="icon icon-sm" /></Link>
          </div>
          <div className="product-grid">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => <div key={i} className="skeleton-card" style={{ height: 400, background: '#eee', borderRadius: 8 }}></div>)
            ) : (
              products.slice(0, 4).map((product) => <ProductCard product={product} quickAdd key={product.id} />)
            )}
          </div>
        </div>
      </section>

      <section id="about">
        <div className="container">
          <div className="story about-story">
            <div>
              <p className="eyebrow">About TinahStore</p>
              <h2 className="h2" style={{ marginBottom: 20 }}>Made in small batches, not a factory line.</h2>
              <p className="lede" style={{ marginBottom: 20 }}>Every TinahStore piece starts at a workbench in Nairobi. We work with a small team of leather artisans to cut, stitch, and finish each bag by hand - so the things you carry every day are built to actually last.</p>
              <div className="about-points">
                <div><strong>Designed in Nairobi</strong><span>Clean silhouettes for office days, travel days, and everything between.</span></div>
                <div><strong>Built to be repaired</strong><span>Hardware, straps, and seams are chosen so your bag can stay in rotation.</span></div>
                <div><strong>Checkout made local</strong><span>M-PESA first, card friendly, with delivery support across Kenya.</span></div>
              </div>
              <div className="hero-actions">
                <Link to="/shop" className="btn btn-primary">Shop bags</Link>
                <a href="#contact" className="btn btn-outline">Contact us</a>
              </div>
            </div>
            <div className="art about-panel">
              <ToteIllustration color="#0D3B36" detailed />
              <div className="about-stats">
                <div><strong>8AM - 6PM</strong><span>Nairobi delivery</span></div>
                <div><strong>0 days</strong><span>Exchange window</span></div>
                <div><strong>Small batch</strong><span>Limited drops</span></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section style={{ background: 'var(--surface)', borderTop: '1px solid var(--hairline)', borderBottom: '1px solid var(--hairline)' }}>
        <div className="container">
          <div className="section-head"><div><p className="eyebrow">From the community</p><h2 className="h2">What customers say</h2></div></div>
          <div className="testi-grid">
            {['Three years in and the strap has not budged. This tote has been to more meetings than I have.', 'Paid with M-PESA, had it in two days. The leather smell alone is worth it.', 'My go-to gift for every friend starting a new job.'].map((quote, index) => (
              <div className="testi-card" key={quote}>
                <div className="rating">
                  <div className="stars">
                    {Array.from({ length: 5 }).map((_, i) => <Icon name="star" key={i} className="star-active" />)}
                  </div>
                </div>
                <p>"{quote}"</p>
                <footer>{['Wanjiru K. - Nairobi', 'Brian O. - Mombasa', 'Achieng M. - Kisumu'][index]}</footer>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <div className="container">
          <div className="contact-layout">
            <div>
              <p className="eyebrow">Contact</p>
              <h2 className="h2">Need help choosing, gifting, or ordering?</h2>
              <p className="lede">Message TinahStore for product questions, delivery updates, custom requests, or help completing checkout.</p>
            </div>
            <div className="contact-grid">
              {contactLinks.map((item) => (
                <a className="contact-card" href={item.href} key={item.label} target={item.href.startsWith('http') ? '_blank' : undefined} rel={item.href.startsWith('http') ? 'noreferrer' : undefined}>
                  <span className="contact-icon"><Icon name={item.icon} /></span>
                  <span>
                    <strong>{item.label}</strong>
                    <span>{item.value}</span>
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <Newsletter />
    </>
  );
}

function Newsletter() {
  const [submitted, setSubmitted] = useState(false);
  return (
    <section className="newsletter">
      <div className="container">
        <p className="eyebrow">Stay close</p>
        <h2 className="h2">Get first access to new drops</h2>
        <form className="newsletter-form" onSubmit={(event) => { event.preventDefault(); setSubmitted(true); }}>
          {!submitted && <div className="newsletter-row"><input type="email" placeholder="you@email.com" required /><button className="btn btn-primary" type="submit">Subscribe</button></div>}
        </form>
        <div className={`newsletter-success ${submitted ? 'show' : ''}`}><Icon name="checkCircle" /> You're on the list - welcome.</div>
        <p className="newsletter-fine">No spam, just new bags and the occasional discount code.</p>
      </div>
    </section>
  );
}
