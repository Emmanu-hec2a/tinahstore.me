import React from 'react';
import { AlertCircle, X } from 'lucide-react';

const ConfirmDialog = ({ open, title, message, onConfirm, onCancel }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-neutral-900/60 backdrop-blur-sm" onClick={onCancel}></div>
      <div className="card w-full max-w-md relative z-10 animate-in fade-in zoom-in duration-200">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-600 transition-colors"
        >
          <X size={20} />
        </button>

        <div className="flex items-center gap-3 text-orange-500 mb-4">
          <AlertCircle size={24} />
          <h3 className="text-lg font-bold text-neutral-900">{title}</h3>
        </div>

        <p className="text-neutral-600 mb-8 leading-relaxed">
          {message}
        </p>

        <div className="flex justify-end gap-3">
          <button onClick={onCancel} className="btn btn-outline">
            Cancel
          </button>
          <button onClick={onConfirm} className="btn bg-orange-500 text-white hover:bg-orange-600 active:bg-orange-700">
            Confirm Action
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
