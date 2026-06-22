import React from 'react';
import { PackageSearch } from 'lucide-react';

const DataTable = ({ columns, data, isLoading, emptyMessage = 'No records found' }) => {
  // Guard — ensure data is always an array before any .map() call
  const rows = Array.isArray(data) ? data : [];

  if (isLoading) {
    return (
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i}>{col.header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                {columns.map((_, j) => (
                  <td key={j}>
                    <div className="skeleton h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (rows.length === 0) {
    return (
      <div className="table-container py-16 flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-300 mb-4">
          <PackageSearch size={32} />
        </div>
        <h4 className="text-lg font-semibold text-neutral-700">{emptyMessage}</h4>
        <p className="text-sm text-neutral-400 mt-1">
          There are no records to display at the moment.
        </p>
      </div>
    );
  }

  return (
    <div className="table-container">
      {/* Desktop */}
      <div className="hidden md:block">
        <table className="table">
          <thead>
            <tr>
              {columns.map((col, i) => (
                <th key={i} className={col.className}>
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr key={row.id ?? row.slug ?? row.order_number ?? i} className="hover:bg-neutral-50 transition-colors">
                {columns.map((col, j) => (
                  <td key={j} className={col.className}>
                    {col.render ? col.render(row) : row[col.accessor]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile — card stack */}
      <div className="md:hidden divide-y divide-neutral-100">
        {rows.map((row, i) => (
          <div key={row.id ?? row.slug ?? row.order_number ?? i} className="p-4 space-y-3">
            {columns.map((col, j) => (
              <div key={j} className="flex justify-between items-start gap-4">
                <span className="text-xs font-bold text-neutral-400 uppercase tracking-wide">
                  {col.header}
                </span>
                <span className="text-sm text-neutral-700 text-right">
                  {col.render ? col.render(row) : row[col.accessor]}
                </span>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default DataTable;