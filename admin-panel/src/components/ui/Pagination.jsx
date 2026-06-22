import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

/**
 * Builds the array of page items to render, using ellipsis for large ranges.
 * e.g. for 20 pages on page 10 → [1, '...', 8, 9, 10, 11, 12, '...', 20]
 */
function buildPageItems(current, total) {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const items = [];
  const delta = 2; // pages to show on each side of current

  const left  = Math.max(2, current - delta);
  const right = Math.min(total - 1, current + delta);

  items.push(1);

  if (left > 2) items.push('...');

  for (let i = left; i <= right; i++) items.push(i);

  if (right < total - 1) items.push('...');

  items.push(total);

  return items;
}

const Pagination = ({ page, total, perPage = 20, onChange }) => {
  // Guard against NaN / undefined — was the cause of "Invalid array length" crash
  const safePage  = Number.isFinite(page)  && page  > 0 ? page  : 1;
  const safeTotal = Number.isFinite(total) && total > 0 ? total : 0;

  const totalPages = Math.ceil(safeTotal / perPage);

  // Nothing to paginate
  if (totalPages <= 1) return null;

  const pageItems = buildPageItems(safePage, totalPages);

  const from = (safePage - 1) * perPage + 1;
  const to   = Math.min(safePage * perPage, safeTotal);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6">
      {/* Result count */}
      <p className="text-sm text-neutral-500">
        Showing{' '}
        <span className="font-medium">{from}</span>
        {' '}–{' '}
        <span className="font-medium">{to}</span>
        {' '}of{' '}
        <span className="font-medium">{safeTotal}</span>
        {' '}results
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1">
        {/* Previous */}
        <button
          onClick={() => onChange(safePage - 1)}
          disabled={safePage === 1}
          className="btn btn-outline p-2 disabled:opacity-30"
          aria-label="Previous page"
        >
          <ChevronLeft size={16} />
        </button>

        {/* Page number buttons + ellipsis */}
        {pageItems.map((item, i) =>
          item === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="w-8 h-8 flex items-center justify-center text-neutral-400 text-sm select-none"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              onClick={() => onChange(item)}
              className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                safePage === item
                  ? 'bg-cyan-500 text-white shadow-sm'
                  : 'text-neutral-600 hover:bg-neutral-100'
              }`}
              aria-label={`Page ${item}`}
              aria-current={safePage === item ? 'page' : undefined}
            >
              {item}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={() => onChange(safePage + 1)}
          disabled={safePage === totalPages}
          className="btn btn-outline p-2 disabled:opacity-30"
          aria-label="Next page"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
};

export default Pagination;