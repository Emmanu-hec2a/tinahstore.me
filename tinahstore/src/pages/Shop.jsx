import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import Icon from '../components/icons/Icon.jsx';
import SEO from '../components/common/SEO.jsx';
import ProductCard from '../components/product/ProductCard.jsx';
import { formatKes } from '../data/products.js';
import { useProducts } from '../hooks/useProducts.js';

const PAGE_SIZE = 8;
const PRICE_MIN = 300;
const PRICE_MAX = 2000;
const colorOptions = [
  { name: 'Midnight Black', hex: '#000000' },
  { name: 'Caramel Tan', hex: '#C68E17' },
  { name: 'Teal Green', hex: '#0D3B36' },
  { name: 'Cognac Tan', hex: '#A9744A' },
  { name: 'Cream', hex: '#E7DCC4' },
];

const initialFilters = {
  categories: [],
  materials: [],
  colors: [],
  maxPrice: 2000,
  query: '',
};

export default function Shop() {
  const { products, isLoading, error } = useProducts();
  const [searchParams] = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('newest');
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({ ...initialFilters, query: initialSearch });

  const facets = useMemo(() => buildFacets(products), [products]);
  const filteredProducts = useMemo(() => {
    const query = filters.query.trim().toLowerCase();

    return products
      .filter((product) => {
        const catName = typeof product.category === 'object' ? product.category?.name : product.category;
        return filters.categories.length === 0 || filters.categories.includes(catName);
      })
      .filter((product) => filters.materials.length === 0 || filters.materials.includes(product.material))
      .filter((product) => filters.colors.length === 0 || filters.colors.includes(product.color))
      .filter((product) => product.price <= filters.maxPrice)
      .filter((product) => {
        if (!query) return true;
        const catName = typeof product.category === 'object' ? product.category?.name : product.category;
        return [product.name, catName, product.material].join(' ').toLowerCase().includes(query);
      })
      .sort(sortProducts(sort));
  }, [filters, products, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * PAGE_SIZE;
  const visibleProducts = filteredProducts.slice(start, start + PAGE_SIZE);
  const activeFilterCount = filters.categories.length + filters.materials.length + filters.colors.length + (filters.maxPrice < PRICE_MAX ? 1 : 0) + (filters.query ? 1 : 0);

  function updateFilters(next) {
    setFilters((current) => ({ ...current, ...next }));
    setPage(1);
  }

  function toggleFilter(key, value) {
    setFilters((current) => {
      const values = current[key];
      const nextValues = values.includes(value) ? values.filter((item) => item !== value) : [...values, value];
      return { ...current, [key]: nextValues };
    });
    setPage(1);
  }

  function clearFilters() {
    setFilters(initialFilters);
    setPage(1);
  }

  return (
    <>
      <SEO
        title="Shop All Bags"
        description="Browse our collection of hand-finished leather and canvas bags. From structured totes to city-ready crossbody bags, find your perfect everyday carry."
        url="/shop"
      />
      <div className="container">
        <nav className="breadcrumb">
          <Link to="/">Home</Link><span className="sep">/</span><span className="current">Shop</span>
        </nav>
        <div className="page-head shop-head">
          <div>
            <p className="eyebrow">Collection</p>
            <h2 className="h2">Shop all bags</h2>
            <span className="muted" style={{ fontSize: 13.5 }}>{products.length} products</span>
          </div>
          <button className="mobile-filter-btn" type="button" onClick={() => setFiltersOpen((open) => !open)} aria-expanded={filtersOpen}>
            <Icon name="sliders" className="icon icon-sm" /> Filters {activeFilterCount > 0 && <span className="filter-count">{activeFilterCount}</span>}
          </button>
        </div>
      </div>

      <div className="container" style={{ paddingBottom: 90 }}>
        <div className="shop-layout">
          <aside className={`filters ${filtersOpen ? 'open' : ''}`} aria-label="Product filters">
            <div className="shop-search">
              <Icon name="search" className="icon icon-sm" />
              <input
                type="search"
                value={filters.query}
                onChange={(event) => updateFilters({ query: event.target.value })}
                placeholder="Search bags"
              />
            </div>

            <FilterGroup
              title="Category"
              options={facets.categories}
              selected={filters.categories}
              onToggle={(value) => toggleFilter('categories', value)}
            />

            <div className="filter-group">
              <h4>Price range <span>{formatKes(filters.maxPrice)}</span></h4>
              <div className="price-range">
                <span className="mono" style={{ fontSize: 12 }}>300</span>
                <input
                  type="range"
                  min={PRICE_MIN}
                  max={PRICE_MAX}
                  step="50"
                  value={filters.maxPrice}
                  onChange={(event) => updateFilters({ maxPrice: Number(event.target.value) })}
                  aria-label="Maximum price"
                />
                <span className="mono" style={{ fontSize: 12 }}>2k</span>
              </div>
            </div>

            <div className="filter-group">
              <h4>Colour</h4>
              <div className="filter-colors">
                {colorOptions.map((color) => (
                  <button
                    className={`swatch ${filters.colors.includes(color.name) ? 'active' : ''}`}
                    style={{ background: color.hex }}
                    key={color.name}
                    type="button"
                    aria-label={color.name}
                    onClick={() => toggleFilter('colors', color.name)}
                  />
                ))}
              </div>
            </div>

            <FilterGroup
              title="Material"
              options={facets.materials}
              selected={filters.materials}
              onToggle={(value) => toggleFilter('materials', value)}
            />

            <div style={{ paddingTop: 18 }}>
              <button className="clear-filters" type="button" onClick={clearFilters} disabled={activeFilterCount === 0}>Clear all filters</button>
            </div>
          </aside>

          <div>
            {activeFilterCount > 0 && (
              <div className="active-filters" aria-label="Active filters">
                {filters.query && <FilterChip label={`Search: ${filters.query}`} onRemove={() => updateFilters({ query: '' })} />}
                {filters.categories.map((value) => <FilterChip label={value} key={value} onRemove={() => toggleFilter('categories', value)} />)}
                {filters.materials.map((value) => <FilterChip label={value} key={value} onRemove={() => toggleFilter('materials', value)} />)}
                {filters.colors.map((value) => <FilterChip label={value} key={value} onRemove={() => toggleFilter('colors', value)} />)}
                {filters.maxPrice < PRICE_MAX && <FilterChip label={`Under ${formatKes(filters.maxPrice)}`} onRemove={() => updateFilters({ maxPrice: PRICE_MAX })} />}
              </div>
            )}

            <div className="toolbar">
              <span className="count">{resultText(filteredProducts.length, start, visibleProducts.length)}</span>
              <div className="toolbar-right">
                <select className="sort-select" value={sort} onChange={(event) => { setSort(event.target.value); setPage(1); }} aria-label="Sort products">
                  <option value="newest">Sort: Newest</option>
                  <option value="low">Price: low to high</option>
                  <option value="high">Price: high to low</option>
                  <option value="popular">Most popular</option>
                  <option value="rating">Highest rated</option>
                </select>
                <div className="view-toggle" aria-label="View mode">
                  <button type="button" className={view === 'grid' ? 'active' : ''} aria-label="Grid view" onClick={() => setView('grid')}><Icon name="grid" className="icon icon-sm" /></button>
                  <button type="button" className={view === 'list' ? 'active' : ''} aria-label="List view" onClick={() => setView('list')}><Icon name="list" className="icon icon-sm" /></button>
                </div>
              </div>
            </div>

            {isLoading && <div className="shop-empty"><h3>Loading bags...</h3></div>}
            {error && <div className="shop-empty"><h3>We could not load the shop.</h3><p className="muted">Please try refreshing the page.</p></div>}
            {!isLoading && !error && visibleProducts.length === 0 && (
              <div className="shop-empty">
                <Icon name="search" className="icon icon-lg" />
                <h3>No bags match those filters</h3>
                <p className="muted">Try widening the price range or clearing one of the selected filters.</p>
                <button className="btn btn-outline btn-sm" type="button" onClick={clearFilters}>Clear filters</button>
              </div>
            )}

            {visibleProducts.length > 0 && (
              <div className={`product-grid ${view === 'list' ? 'shop-list-view' : ''}`}>
                {visibleProducts.map((product) => (
                  <ProductCard
                    product={product}
                    key={product.id}
                    quickAdd
                    className={view === 'list' ? 'list-card' : ''}
                  />
                ))}
              </div>
            )}

            {totalPages > 1 && (
              <div className="pagination" aria-label="Pagination">
                <button type="button" aria-label="Previous" disabled={currentPage === 1} onClick={() => setPage((value) => Math.max(1, value - 1))}><Icon name="chevronLeft" className="icon icon-sm" /></button>
                {Array.from({ length: totalPages }).map((_, index) => (
                  <button type="button" className={currentPage === index + 1 ? 'active' : ''} key={index + 1} onClick={() => setPage(index + 1)}>{index + 1}</button>
                ))}
                <button type="button" aria-label="Next" disabled={currentPage === totalPages} onClick={() => setPage((value) => Math.min(totalPages, value + 1))}><Icon name="chevronRight" className="icon icon-sm" /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

function FilterGroup({ title, options, selected, onToggle }) {
  return (
    <div className="filter-group">
      <h4>{title}</h4>
      {options.map((option) => (
        <label className="filter-row" key={option.value}>
          <input
            type="checkbox"
            checked={selected.includes(option.value)}
            onChange={() => onToggle(option.value)}
          />
          {option.value}
          <span className="count">({option.count})</span>
        </label>
      ))}
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <button className="filter-chip" type="button" onClick={onRemove}>
      {label}<Icon name="x" className="icon icon-sm" />
    </button>
  );
}

function buildFacets(products) {
  return {
    categories: countBy(products, 'category'),
    materials: countBy(products, 'material'),
  };
}

function countBy(products, key) {
  return [...products.reduce((map, product) => {
    const val = typeof product[key] === 'object' ? product[key]?.name : product[key];
    if (!val) return map;
    return map.set(val, (map.get(val) || 0) + 1);
  }, new Map())]
    .map(([value, count]) => ({ value, count }))
    .sort((a, b) => a.value.localeCompare(b.value));
}

function sortProducts(sort) {
  return (a, b) => {
    if (sort === 'low') return a.price - b.price;
    if (sort === 'high') return b.price - a.price;
    return new Date(b.created_at) - new Date(a.created_at);
  };
}

function resultText(total, start, visibleCount) {
  if (total === 0) return 'No results';
  return `Showing ${start + 1}-${start + visibleCount} of ${total} results`;
}
