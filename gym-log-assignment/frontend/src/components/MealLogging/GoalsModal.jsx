import React from 'react';

const GoalsModal = ({
  goalsSet,
  goalInput,
  setGoalInput,
  loading,
  saveGoals,
  setShowGoalsModal,
  usePurpleBranding = false
}) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
        <button
          onClick={() => {
            if (goalsSet) {
              setShowGoalsModal(false);
            }
          }}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
        >
          {goalsSet ? '✕' : ''}
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-2">
          {goalsSet ? 'Edit Daily Goals' : 'Set Your Daily Goals'}
        </h2>
        <p className="text-gray-500 mb-6">
          {goalsSet ? 'Update your nutrition targets' : 'First, let\'s set your nutrition targets'}
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Calorie Goal</label>
            <input
              type="number"
              value={goalInput.calories}
              onChange={(e) => setGoalInput({...goalInput, calories: e.target.value})}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="e.g. 2200"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Protein (g)</label>
              <input
                type="number"
                value={goalInput.protein}
                onChange={(e) => setGoalInput({...goalInput, protein: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="165"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Carbs (g)</label>
              <input
                type="number"
                value={goalInput.carbs}
                onChange={(e) => setGoalInput({...goalInput, carbs: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="220"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fat (g)</label>
              <input
                type="number"
                value={goalInput.fat}
                onChange={(e) => setGoalInput({...goalInput, fat: e.target.value})}
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="73"
              />
            </div>
          </div>

          <div className={`${usePurpleBranding ? 'bg-purple-50 border border-purple-200' : 'bg-purple-50 border border-purple-200'} rounded-xl p-4 mt-4`}>
            <p className="text-sm text-gray-600 mb-2">💡 Common macro splits:</p>
            <ul className="text-xs text-gray-600 space-y-1 ml-4">
              <li>• Balanced: 40% carbs, 30% protein, 30% fat</li>
              <li>• High Protein: 30% carbs, 40% protein, 30% fat</li>
              <li>• Low Carb: 20% carbs, 40% protein, 40% fat</li>
            </ul>
          </div>

          <button
            onClick={saveGoals}
            disabled={loading}
            className={`w-full ${usePurpleBranding ? 'bg-gradient-to-r from-purple-600 to-pink-600' : 'bg-gradient-to-r from-purple-600 to-pink-600'} text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl mt-6 disabled:opacity-50`}
          >
            {loading ? 'Saving...' : goalsSet ? 'Update Goals' : 'Set Goals & Start Tracking'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalsModal;
