import React from 'react';
import ProgressBar from './ProgressBar';

const toNumber = (value, fallback = 0) => {
  const num = Number(value);
  return Number.isFinite(num) ? num : fallback;
};

const ProgressSection = ({ totals = {}, dailyGoals = {}, remaining }) => {
  const caloriesRemaining = toNumber(
    typeof remaining === 'number' ? remaining : remaining?.calories,
  );

  const caloriesCurrent = toNumber(totals.calories);
  const proteinCurrent = toNumber(totals.protein);
  const carbsCurrent = toNumber(totals.carbs);
  const fatCurrent = toNumber(totals.fat);

  const caloriesGoal = toNumber(dailyGoals.calories);
  const proteinGoal = toNumber(dailyGoals.protein);
  const carbsGoal = toNumber(dailyGoals.carbs);
  const fatGoal = toNumber(dailyGoals.fat);

  const isWithinGoal = caloriesRemaining >= 0;

  return (
    <div className="bg-white rounded-2xl shadow-xl p-6">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold text-gray-900">Today's Progress</h2>
        <div
          className={`px-4 py-2 rounded-full font-bold ${
            isWithinGoal ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}
        >
          {isWithinGoal ? caloriesRemaining : Math.abs(caloriesRemaining)} cal{' '}
          {isWithinGoal ? 'left' : 'over'}
        </div>
      </div>

      {/* Macro boxes */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Calories</p>
          <p className="text-2xl font-bold text-blue-700">{caloriesCurrent}</p>
          <p className="text-xs text-gray-500">of {caloriesGoal}</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Protein</p>
          <p className="text-2xl font-bold text-green-700">{proteinCurrent}g</p>
          <p className="text-xs text-gray-500">of {proteinGoal}g</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-yellow-50 to-yellow-100 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Carbs</p>
          <p className="text-2xl font-bold text-yellow-700">{carbsCurrent}g</p>
          <p className="text-xs text-gray-500">of {carbsGoal}g</p>
        </div>
        <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl">
          <p className="text-sm text-gray-600 mb-1">Fat</p>
          <p className="text-2xl font-bold text-purple-700">{fatCurrent}g</p>
          <p className="text-xs text-gray-500">of {fatGoal}g</p>
        </div>
      </div>

      {/* Progress bars */}
      <div className="space-y-3">
        <ProgressBar current={proteinCurrent} goal={proteinGoal} label="Protein" color="bg-green-500" />
        <ProgressBar current={carbsCurrent} goal={carbsGoal} label="Carbs" color="bg-yellow-500" />
        <ProgressBar current={fatCurrent} goal={fatGoal} label="Fat" color="bg-purple-500" />
      </div>
    </div>
  );
};

export default ProgressSection;
