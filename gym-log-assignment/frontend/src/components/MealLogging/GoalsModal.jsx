import React from 'react';

const GoalsModal = ({
  goalsSet,
  goalInput = {},
  setGoalInput = () => {},
  loading = false,
  onSave,
  onUseRecommendations,
  onManual,
  onClose,
  allowDismiss = false,
  usePurpleBranding = false,
}) => {
  const handleClose = () => {
    if (allowDismiss && onClose) {
      onClose();
    }
  };

  if (!goalsSet) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-8 relative animate-fade-in space-y-6">
          <button
            onClick={handleClose}
            disabled={!allowDismiss}
            className={`absolute top-6 right-6 text-xl ${
              allowDismiss ? 'text-gray-400 hover:text-gray-600' : 'text-gray-300 cursor-not-allowed'
            }`}
            aria-label="Close"
          >
            X
          </button>

          <header>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Set Your Daily Goals</h2>
            <p className="text-gray-500">
              Choose how you would like to configure calorie and macro targets before using the meal tracker.
            </p>
          </header>

          <div className="space-y-4">
            <section
              className={`rounded-2xl border ${usePurpleBranding ? 'border-purple-200 bg-purple-50' : 'border-blue-200 bg-blue-50'} p-5`}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Option A - Smart Recommendation</h3>
              <p className="text-sm text-gray-600 mb-4">
                Fetch recommended goals based on your profile (age, weight, activity level). We will save them instantly.
              </p>
              <button
                onClick={onUseRecommendations}
                disabled={loading}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-60"
              >
                {loading ? 'Applying...' : 'Auto-set Recommended Goals'}
              </button>
            </section>

            <section className="rounded-2xl border border-gray-200 p-5">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Option B - Enter Manually</h3>
              <p className="text-sm text-gray-600 mb-4">
                Go to the nutrition targets page to type in calorie and macro goals yourself.
              </p>
              <button
                onClick={onManual}
                disabled={loading}
                className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-60"
              >
                Set Goals Manually
              </button>
            </section>
          </div>
        </div>
      </div>
    );
  }

  const handleChange = (field) => (event) => {
    setGoalInput({ ...goalInput, [field]: event.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-8 relative animate-fade-in space-y-6">
        <button
          onClick={handleClose}
          disabled={!allowDismiss}
          className={`absolute top-6 right-6 text-xl ${
            allowDismiss ? 'text-gray-400 hover:text-gray-600' : 'text-gray-300 cursor-not-allowed'
          }`}
          aria-label="Close"
        >
          X
        </button>

        <header>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Edit Daily Goals</h2>
          <p className="text-gray-500">Update your calorie and macro targets or reapply the smart recommendation.</p>
        </header>

        <div className="space-y-5">
          {onUseRecommendations && (
            <button
              onClick={onUseRecommendations}
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-xl font-semibold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-60"
            >
              {loading ? 'Applying...' : 'Apply Recommended Goals'}
            </button>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Daily Calorie Goal</label>
            <input
              type="number"
              value={goalInput.calories || ''}
              onChange={handleChange('calories')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
              placeholder="e.g. 2200"
              min="0"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Protein (g)</label>
              <input
                type="number"
                value={goalInput.protein || ''}
                onChange={handleChange('protein')}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="165"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Carbs (g)</label>
              <input
                type="number"
                value={goalInput.carbs || ''}
                onChange={handleChange('carbs')}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="220"
                min="0"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Fat (g)</label>
              <input
                type="number"
                value={goalInput.fat || ''}
                onChange={handleChange('fat')}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                placeholder="73"
                min="0"
              />
            </div>
          </div>

          <div className="rounded-xl bg-gray-50 border border-gray-200 p-4 text-sm text-gray-600">
            <p className="font-semibold mb-2">Macro presets:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Balanced: 40% carbs - 30% protein - 30% fat</li>
              <li>High Protein: 30% carbs - 40% protein - 30% fat</li>
              <li>Low Carb: 20% carbs - 40% protein - 40% fat</li>
            </ul>
          </div>

          <button
            onClick={onSave}
            disabled={loading}
            className="w-full bg-gray-900 text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-all shadow-lg disabled:opacity-60"
          >
            {loading ? 'Saving...' : 'Save Goals'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default GoalsModal;
