import React, { useRef } from 'react';
import { Upload, X, Image as ImageIcon, Star } from 'lucide-react';

const ImageUploadZone = ({ onUpload, previews = [], onRemove, onSetPrimary }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 0) {
      onUpload(files);
    }
  };

  return (
    <div className="space-y-4">
      <div
        onClick={() => fileInputRef.current.click()}
        className="border-2 border-dashed border-neutral-200 rounded-card p-8 flex flex-col items-center justify-center cursor-pointer hover:border-cyan-400 hover:bg-cyan-50/30 transition-all group"
      >
        <div className="w-12 h-12 bg-neutral-50 rounded-full flex items-center justify-center text-neutral-400 group-hover:text-cyan-500 mb-3 transition-colors">
          <Upload size={24} />
        </div>
        <p className="text-sm font-medium text-neutral-600">Click to upload product images</p>
        <p className="text-xs text-neutral-400 mt-1">PNG, JPG or WebP (max. 5MB)</p>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          className="hidden"
          accept="image/*"
          onChange={handleFileChange}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        {previews.map((img, i) => (
          <div key={i} className="relative group rounded-lg overflow-hidden border border-neutral-100 aspect-square">
            <img
              src={typeof img === 'string' ? img : URL.createObjectURL(img)}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-neutral-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
              <button
                onClick={() => onRemove(i)}
                className="p-1.5 bg-white/20 hover:bg-red-500 text-white rounded-full transition-colors"
                title="Remove"
              >
                <X size={16} />
              </button>
            </div>
            {img.is_primary && (
                <div className="absolute top-2 left-2 px-2 py-0.5 bg-cyan-500 text-white text-[10px] font-bold rounded uppercase">
                    Primary
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ImageUploadZone;
