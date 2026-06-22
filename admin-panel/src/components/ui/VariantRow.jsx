import React from 'react';
import { Trash2 } from 'lucide-react';

const SIZES = ['Regular', 'Large'];

const VariantRow = ({ data, onChange, onRemove }) => {
  return (
    <div className="flex items-end gap-3 p-4 bg-neutral-50 rounded-lg border border-neutral-100">
      <div className="flex-1 space-y-1.5">
        <label className="text-[11px] font-bold text-neutral-400 uppercase">Color Name</label>
        <input
          type="text"
          value={data.color_name}
          onChange={(e) => onChange({ ...data, color_name: e.target.value })}
          className="input h-9 py-1 px-3 text-sm"
          placeholder="e.g. Teal"
        />
      </div>

      <div className="w-20 space-y-1.5">
        <label className="text-[11px] font-bold text-neutral-400 uppercase">Hex</label>
        <div className="flex gap-2 items-center">
          <input
            type="color"
            value={data.color_hex}
            onChange={(e) => onChange({ ...data, color_hex: e.target.value })}
            className="w-9 h-9 p-0 border-none rounded cursor-pointer overflow-hidden"
          />
        </div>
      </div>

      <div className="w-28 space-y-1.5">
        <label className="text-[11px] font-bold text-neutral-400 uppercase">Size</label>
        <select
          value={data.size}
          onChange={(e) => onChange({ ...data, size: e.target.value })}
          className="input h-9 py-1 px-3 text-sm bg-white"
        >
          {SIZES.map(size => (
            <option key={size} value={size}>{size}</option>
          ))}
        </select>
      </div>

      <div className="w-20 space-y-1.5">
        <label className="text-[11px] font-bold text-neutral-400 uppercase">Stock</label>
        <input
          type="number"
          min="0"
          value={data.stock}
          onChange={(e) => onChange({ ...data, stock: parseInt(e.target.value, 10) || 0 })}
          className="input h-9 py-1 px-3 text-sm"
        />
      </div>

      <button
        type="button"
        onClick={onRemove}
        className="p-2.5 text-neutral-400 hover:text-red-500 transition-colors"
        title="Remove variant"
      >
        <Trash2 size={18} />
      </button>
    </div>
  );
};

export default VariantRow;