import React from 'react';
import ProgressBar from './ProgressBar';

const ProgressSection = ({ totals, dailyGoals, remaining }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Today's Progress</h2>
        <div className={`px-4 py-2 rounded-full font-bold ${
          remaining >= 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
        }`}>
          {remaining >= 0 ? remaining : Math.abs(remaining)} cal {remaining >= 0 ? 'left' : 'over'}
        </div>
      </div>

      {/* Macro boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Calories</p>
          <p className="text-2xl font-bold text-blue-700">{totals.calories}</p>
          <p className="text-xs text-gray-500">of {dailyGoals.calories}</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Protein</p>
          <p className="text-2xl font-bold text-green-700">{totals.protein}g</p>
          <p className="text-xs text-gray-500">of {dailyGoals.protein}g</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Carbs</p>
          <p className="text-2xl font-bold text-yellow-700">{totals.carbs}g</p>
          <p className="text-xs text-gray-500">of {dailyGoals.carbs}g</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Fat</p>
          <p className="text-2xl font-bold text-purple-700">{totals.fat}g</p>
          <p className="text-xs text-gray-500">of {dailyGoals.fat}g</p>
        </div>
      </div>

      {/* Progress bars */}
      <div className="space-y-3">
        <ProgressBar 
          current={totals.protein} 
          goal={dailyGoals.protein} 
          label="Protein" 
          color="bg-green-500" 
        />
        <ProgressBar 
          current={totals.carbs} 
          goal={dailyGoals.carbs} 
          label="Carbs" 
          color="bg-yellow-500" 
        />
        <ProgressBar 
          current={totals.fat} 
          goal={dailyGoals.fat} 
          label="Fat" 
          color="bg-purple-500" 
        />
      </div>
    </div>
  );
};

export default ProgressSection;
