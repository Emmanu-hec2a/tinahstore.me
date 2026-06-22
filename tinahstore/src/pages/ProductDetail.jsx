import { Link, useParams } from 'react-router-dom';
import { useContext, useState, useEffect } from 'react';
import Icon from '../components/icons/Icon.jsx';
import Accordion from '../components/ui/Accordion.jsx';
import HangTag from '../components/ui/HangTag.jsx';
import Stepper from '../components/ui/Stepper.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import ProductGallery from '../components/product/ProductGallery.jsx';
import RatingStars from '../components/ui/RatingStars.jsx';
import ColorSwatchPicker from '../components/product/ColorSwatchPicker.jsx';
import SizePicker from '../components/product/SizePicker.jsx';
import { WishlistContext } from '../context/WishlistContext.jsx';
import { useCart } from '../hooks/useCart.js';
import { formatKes } from '../data/products.js';
import { api } from '../services/api.js';

export default function ProductDetail() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [isLoading, setLoading] = useState(true);

  const [color, setColor] = useState(null);
  const [size, setSize] = useState('Regular');
  const [quantity, setQuantity] = useState(1);

  const wishlist = useContext(WishlistContext);
  const cart = useCart();

  useEffect(() => {
    async function fetchDetails() {
      setLoading(true);
      try {
        const [data, relatedData] = await Promise.all([
          api.getProduct(slug),
          api.getRelatedProducts(slug)
        ]);

        setProduct(data);
        setRelated(relatedData.results || relatedData);

        // Set default color from first variant if available
        if (data.variants && data.variants.length > 0) {
          setColor({ name: data.variants[0].color_name, hex: data.variants[0].color_hex });
          setSize(data.variants[0].size);
        }
      } catch (err) {
        console.error('Failed to fetch product details', err);
      } finally {
        setLoading(false);
      }
    }
    fetchDetails();
  }, [slug]);

  if (isLoading) {
    return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}><h3>Loading bag details...</h3></div>;
  }

  if (!product) {
    return <div className="container" style={{ padding: '100px 0', textAlign: 'center' }}><h3>Product not found.</h3><Link to="/shop" className="btn btn-outline" style={{ marginTop: 20 }}>Back to Shop</Link></div>;
  }

  // Derive unique colors from variants
  const uniqueColors = product.variants ? [...new Map(product.variants.map(v => [v.color_name, { name: v.color_name, hex: v.color_hex }])).values()] : [];
  const uniqueSizes = product.variants ? [...new Set(product.variants.map(v => v.size))] : ['Regular'];

  return (
    <>
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link>
          <span className="sep">/</span>
          <Link to="/shop">Shop</Link>
          <span className="sep">/</span>
          <span className="current">{product.name}</span>
        </nav>

        <div className="pd-layout">
          <ProductGallery product={product} color={color?.hex} />

          <div className="pd-info">
            <p className="eyebrow">
              {typeof product.category === 'object' ? product.category.name : product.category}
              {product.material && ` - ${product.material}`}
            </p>
            <h1>{product.name}</h1>

            <div className="pd-rating">
              <RatingStars rating={product.rating || 4.8} reviews={product.reviews || 0} />
              <a href="#reviews" style={{ marginLeft: 12 }}>View reviews</a>
            </div>

            <div className="pd-price">
              <HangTag price={product.price} compareAt={product.original_price} />
              <span className="muted" style={{ fontSize: 13 }}>{formatKes(product.price)}, incl. VAT</span>
            </div>

            <p className="pd-desc">{product.description}</p>

            {uniqueColors.length > 0 && (
              <div className="option-group">
                <div className="label-row"><span>Colour</span><span className="selected">{color?.name}</span></div>
                <ColorSwatchPicker colors={uniqueColors} selected={color} onChange={setColor} />
              </div>
            )}

            <div className="option-group">
              <div className="label-row"><span>Size</span><span className="selected">{size}</span></div>
              <SizePicker sizes={uniqueSizes} selected={size} onChange={setSize} />
            </div>

            <div className="qty-row">
              <Stepper value={quantity} onChange={setQuantity} />
              <span className="muted" style={{ fontSize: 13 }}>Max 10 per order</span>
            </div>

            <div className="pd-actions">
              <button
                className="btn btn-primary"
                onClick={() => cart.addItem(product, { color: color?.name, size, quantity })}
              >
                <Icon name="bag" className="icon icon-sm" /> Add to cart
              </button>
              <button
                className={`icon-btn ${wishlist.ids.includes(product.id) ? 'active' : ''}`}
                aria-label="Add to wishlist"
                onClick={() => wishlist.toggle(product.id)}
              >
                <Icon name="heart" />
              </button>
              <button className="icon-btn" aria-label="Share"><Icon name="share" /></button>
            </div>

            <div className="stock-note">
              <Icon name="checkCircle" className="icon icon-sm" />
              {product.stock > 0 ? `In stock (${product.stock} available)` : 'Out of stock'}
            </div>

            <div className="pd-trust">
              <div className="trust-item"><Icon name="shield" /><span style={{ fontSize: 12.5 }}>M-PESA Secure</span></div>
              <div className="trust-item"><Icon name="refresh" /><span style={{ fontSize: 12.5 }}>7-day exchange</span></div>
              <div className="trust-item"><Icon name="leaf" /><span style={{ fontSize: 12.5 }}>Nairobi Crafted</span></div>
            </div>

            <Accordion items={[
              { title: 'Material & care', content: product.material_care || 'Full-grain leather, cotton canvas lining. Wipe clean with a dry or slightly damp cloth. Avoid prolonged direct sun. Store with the dust bag provided when not in use.' },
              { title: 'Shipping & returns', content: 'Nairobi: 24-48 hrs by rider. Upcountry: 3-5 working days. 7-day exchange window; items must be unused with tags attached.' },
            ]} />
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <section>
          <div className="container">
            <div className="section-head">
              <div><p className="eyebrow">Pairs well</p><h2 className="h2">You may also like</h2></div>
            </div>
            <div className="product-grid">
              {related.map((item) => <ProductCard product={item} key={item.id} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
