import { useState } from 'react';
import ProductArt from './ProductArt.jsx';

export default function ProductGallery({ product, color }) {
  const allImages = product.images || [];
  const [activeIndex, setActiveIndex] = useState(0);
  const activeImage = allImages[activeIndex];

  return (
    <div className="pd-gallery">
      <div className="main-shot">
        {product.original_price && <span className="pill pill-sale sale-pill">Sale</span>}
        {activeImage ? (
          <img
            src={activeImage.image}
            alt={activeImage.alt_text || product.name}
            className="product-image"
          />
        ) : (
          <ProductArt product={product} color={color} detailed />
        )}
      </div>

      {allImages.length > 1 && (
        <div className="thumb-row">
          {allImages.map((img, index) => (
            <button
              key={index}
              className={`thumb ${index === activeIndex ? 'active' : ''}`}
              onClick={() => setActiveIndex(index)}
              aria-label={`View image ${index + 1} of ${product.name}`}
            >
              <img src={img.image} alt={`${product.name} thumbnail ${index + 1}`} className="product-image" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
