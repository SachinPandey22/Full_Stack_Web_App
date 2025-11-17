import React, { useEffect, useRef, useState } from 'react';
import { searchFoods } from '../../services/MealLogging';

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

  const [searchTerm, setSearchTerm] = useState(formValues?.name || '');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [searchError, setSearchError] = useState(null);
  const debounceRef = useRef(null);

  const handleChange = (field) => (event) => {
    setFormValues({ ...formValues, [field]: event.target.value });
  };

  useEffect(() => {
    setSearchTerm(formValues?.name || '');
  }, [formValues?.name]);

  useEffect(() => {
    let isCancelled = false;

    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }

    const trimmed = searchTerm.trim();
    const value = trimmed;

    if (!value || value.length < 2) {
      setSearchResults([]);
      setDropdownOpen(false);
      setIsSearching(false);
      setSearchError(null);
      return () => {
        isCancelled = true;
      };
    }

    setIsSearching(true);
    setSearchError(null);
    setDropdownOpen(true);

    debounceRef.current = setTimeout(async () => {
      try {
        const { results } = await searchFoods(trimmed);
        if (isCancelled) {
          return;
        }
        setSearchResults(results);
      } catch (error) {
        if (isCancelled) {
          return;
        }
        console.error('Food search failed', error);
        setSearchResults([]);
        setSearchError('Unable to fetch foods. Please try again.');
      } finally {
        if (!isCancelled) {
          setIsSearching(false);
        }
      }
    }, 400);

    return () => {
      isCancelled = true;
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [searchTerm]);

  const resolveNumber = (value, fallback) => {
    if (value === undefined || value === null) {
      return fallback;
    }
    const numeric = Number(value);
    return Number.isNaN(numeric) ? fallback : numeric;
  };

  const handleFoodSelect = (food) => {
    const updatedValues = {
      ...formValues,
      name: food.description || formValues.name || '',
      calories: resolveNumber(food.calories, formValues.calories),
      protein: resolveNumber(food.protein, formValues.protein),
      carbs: resolveNumber(food.carbs, formValues.carbs),
      fat: resolveNumber(food.fat, formValues.fat),
    };

    setFormValues(updatedValues);
    setSearchTerm(food.description || '');
    setDropdownOpen(false);
    setSearchResults([]);
  };

  const formatNumber = (value) => {
    if (value === undefined || value === null) {
      return '0';
    }
    const numeric = Number(value);
    if (Number.isNaN(numeric)) {
      return '0';
    }
    const fixed = numeric.toFixed(1);
    return fixed.endsWith('.0') ? fixed.slice(0, -2) : fixed;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in max-h-[90vh] overflow-y-auto">
        <button
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
          aria-label="Close"
        >
          X
        </button>

        <h2 className="text-3xl font-bold text-gray-900 mb-6">{title}</h2>

        <div className="space-y-4">
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">Search Food</label>
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              onFocus={() => {
                if (searchResults.length) {
                  setDropdownOpen(true);
                }
              }}
              onBlur={() => {
                setTimeout(() => setDropdownOpen(false), 120);
              }}
              className="w-full px-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Search foods, e.g. apple"
            />
            {dropdownOpen && (
              <div className="absolute left-0 right-0 mt-2 bg-white rounded-2xl border border-gray-200 shadow-xl max-h-64 overflow-y-auto z-10">
                {isSearching ? (
                  <div className="px-4 py-3 text-sm text-gray-500">Searching...</div>
                ) : searchError ? (
                  <div className="px-4 py-3 text-sm text-red-500">{searchError}</div>
                ) : searchResults.length ? (
                  searchResults.map((food) => (
                    <button
                      key={`${food.description}-${food.calories}-${food.protein}-${food.carbs}-${food.fat}`}
                      type="button"
                      onMouseDown={() => handleFoodSelect(food)}
                      className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors"
                    >
                      <p className="font-medium text-gray-900">{food.description}</p>
                      <p className="text-xs text-gray-500 mt-1">
                        {`${formatNumber(food.calories)} kcal | P ${formatNumber(food.protein)}g | C ${formatNumber(food.carbs)}g | F ${formatNumber(food.fat)}g`}
                      </p>
                    </button>
                  ))
                ) : (
                  <div className="px-4 py-3 text-sm text-gray-500">No foods found.</div>
                )}
              </div>
            )}
          </div>

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
              Examples: "Post-workout meal", "Felt energized after".
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
