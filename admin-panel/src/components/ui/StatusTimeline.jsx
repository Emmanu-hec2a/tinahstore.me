import React from 'react';
import { Check } from 'lucide-react';

const StatusTimeline = ({ steps, currentStep }) => {
  const currentIdx = steps.findIndex(s => s.status === currentStep);

  return (
    <div className="flex items-center justify-between w-full pt-4 pb-8 px-4">
      {steps.map((step, i) => {
        const isCompleted = i < currentIdx;
        const isCurrent = i === currentIdx;

        return (
          <React.Fragment key={step.status}>
            <div className="flex flex-col items-center relative group">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all duration-300 z-10 ${
                isCompleted
                  ? 'bg-cyan-500 border-cyan-500 text-white'
                  : isCurrent
                    ? 'bg-white border-cyan-500 text-cyan-500 shadow-lg shadow-cyan-500/20'
                    : 'bg-white border-neutral-200 text-neutral-300'
              }`}>
                {isCompleted ? <Check size={16} /> : <span className="text-xs font-bold">{i + 1}</span>}
              </div>
              <span className={`absolute top-10 whitespace-nowrap text-xs font-semibold tracking-tight transition-colors duration-300 ${
                isCurrent ? 'text-cyan-600' : 'text-neutral-400'
              }`}>
                {step.label}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className={`flex-1 h-0.5 mx-2 transition-all duration-500 ${
                isCompleted ? 'bg-cyan-500' : 'bg-neutral-100'
              }`}></div>
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default StatusTimeline;
