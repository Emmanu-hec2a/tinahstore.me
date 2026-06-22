import React from 'react';

const DateRangePicker = ({ from, to, onChange }) => {
  return (
    <div className="flex items-center gap-2">
      <input
        type="date"
        value={from}
        onChange={(e) => onChange({ from: e.target.value, to })}
        className="input max-w-[160px]"
      />
      <span className="text-neutral-400 text-sm">to</span>
      <input
        type="date"
        value={to}
        onChange={(e) => onChange({ from, to: e.target.value })}
        className="input max-w-[160px]"
      />
    </div>
  );
};

export default DateRangePicker;
