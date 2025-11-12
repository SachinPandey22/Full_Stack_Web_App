import React from 'react';

const ProgressBar = ({ current, goal, label, color }) => {
  const percentage = Math.min((current / goal) * 100, 100);
  
  return (
    <div className="mb-3">
      <div className="flex justify-between text-sm mb-2">
        <span className="text-gray-700 font-medium">{label}</span>
        <span className="text-gray-600">{current}/{goal}g</span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
        <div 
          className={`${color} h-full rounded-full transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
