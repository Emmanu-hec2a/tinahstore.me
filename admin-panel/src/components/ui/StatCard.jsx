import React from 'react';

const StatCard = ({ value, label, sub, icon: Icon, accentColor = 'cyan' }) => {
  const accentClasses = {
    cyan: 'bg-cyan-50 text-cyan-600',
    teal: 'bg-teal-50 text-teal-600',
    orange: 'bg-orange-50 text-orange-600',
    green: 'bg-green-50 text-green-600',
  };

  return (
    <div className="card flex items-start justify-between">
      <div>
        <p className="text-sm font-medium text-neutral-500 mb-1">{label}</p>
        <h3 className="text-2xl font-bold text-neutral-900">{value}</h3>
        {sub && (
          <p className="text-xs text-neutral-400 mt-1">{sub}</p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${accentClasses[accentColor] || accentClasses.cyan}`}>
        <Icon size={20} />
      </div>
    </div>
  );
};

export default StatCard;
