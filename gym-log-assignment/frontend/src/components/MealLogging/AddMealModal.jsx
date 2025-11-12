import React from 'react';

const AddMealModal = ({
  isEditing,
  formValues,
  setFormValues,
  onSubmit,
  onClose,
  loading,
}) => {
  const title = isEditing ? 'Edit Meal' : 'Add New Meal';
  const actionLabel = isEditing ? 'Save Changes' : 'Add Meal';
  const loadingLabel = isEditing ? 'Saving...' : 'Adding...';

  const handleChange = (field) => (event) => {
    setFormValues({ ...formValues, [field]: event.target.value });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          aria-label="Close"
        >
          ×
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">{title}</h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Type</label>
            <select
              value={formValues.type}
              onChange={handleChange('type')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            >
              <option value="breakfast">Breakfast</option>
              <option value="lunch">Lunch</option>
              <option value="dinner">Dinner</option>
              <option value="snacks">Snacks</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Name</label>
            <input
              type="text"
              value={formValues.name}
              onChange={handleChange('name')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g. Greek Yogurt Bowl"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Calories</label>
            <input
              type="number"
              value={formValues.calories}
              onChange={handleChange('calories')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="0"
              min="0"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Protein (g)</label>
              <input
                type="number"
                value={formValues.protein}
                onChange={handleChange('protein')}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Carbs (g)</label>
              <input
                type="number"
                value={formValues.carbs}
                onChange={handleChange('carbs')}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0"
                min="0"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-2">Fat (g)</label>
              <input
                type="number"
                value={formValues.fat}
                onChange={handleChange('fat')}
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                placeholder="0"
                min="0"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Notes (Optional)
            </label>
            <textarea
              value={formValues.notes}
              onChange={handleChange('notes')}
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
              placeholder="Add any notes about this meal..."
              rows="3"
            />
            <p className="text-xs text-gray-500 mt-1">
              Examples: “Post-workout meal”, “Felt energized after”.
            </p>
          </div>

          <button
            onClick={onSubmit}
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl mt-6 disabled:opacity-50"
          >
            {loading ? loadingLabel : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddMealModal;
