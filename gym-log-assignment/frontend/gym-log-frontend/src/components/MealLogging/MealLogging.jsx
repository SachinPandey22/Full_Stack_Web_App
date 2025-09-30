import React, { useState } from 'react';
import { X, ChevronLeft, ChevronRight, Plus, Flame, TrendingUp, Calendar } from 'lucide-react';

export default function MealTracker() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 3, 24));
  const [meals, setMeals] = useState([
    { id: 1, name: 'Breakfast', calories: 400, protein: 20, carbs: 45, fats: 15 },
    { id: 2, name: 'Lunch', calories: 400, protein: 25, carbs: 40, fats: 18 }
  ]);
  const [showModal, setShowModal] = useState(false);
  const [editingMeal, setEditingMeal] = useState(null);
  const [mealName, setMealName] = useState('');
  const [mealCalories, setMealCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fats, setFats] = useState('');
  const [error, setError] = useState('');
  const [streak, setStreak] = useState(7);
  const [showWeekView, setShowWeekView] = useState(false);

  const totalCalories = 1400;
  const totalProtein = 100;
  const totalCarbs = 150;
  const totalFats = 50;

  const consumedCalories = meals.reduce((sum, meal) => sum + meal.calories, 0);
  const consumedProtein = meals.reduce((sum, meal) => sum + (meal.protein || 0), 0);
  const consumedCarbs = meals.reduce((sum, meal) => sum + (meal.carbs || 0), 0);
  const consumedFats = meals.reduce((sum, meal) => sum + (meal.fats || 0), 0);

  const remainingCalories = totalCalories - consumedCalories;

  const motivationalQuotes = [
    "Progress, not perfection!",
    "Every meal is a choice to fuel your body.",
    "Small steps lead to big results.",
    "You're building healthy habits!",
    "Consistency is key to success."
  ];
  const [currentQuote] = useState(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);

  const quickAddMeals = [
    { name: 'Protein Shake', calories: 200, protein: 25, carbs: 10, fats: 5 },
    { name: 'Greek Yogurt', calories: 150, protein: 15, carbs: 20, fats: 3 },
    { name: 'Banana', calories: 105, protein: 1, carbs: 27, fats: 0 },
    { name: 'Chicken Breast', calories: 165, protein: 31, carbs: 0, fats: 4 }
  ];

  const weekData = [
    { day: 'Mon', calories: 1350, target: 1400 },
    { day: 'Tue', calories: 1400, target: 1400 },
    { day: 'Wed', calories: 1380, target: 1400 },
    { day: 'Thu', calories: 1420, target: 1400 },
    { day: 'Fri', calories: 1390, target: 1400 },
    { day: 'Sat', calories: 1450, target: 1400 },
    { day: 'Sun', calories: 800, target: 1400 }
  ];

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', { month: 'long', day: 'numeric' });
  };

  const handlePrevDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() - 1);
    setCurrentDate(newDate);
  };

  const handleNextDay = () => {
    const newDate = new Date(currentDate);
    newDate.setDate(newDate.getDate() + 1);
    setCurrentDate(newDate);
  };

  const handleAddMeal = () => {
    setEditingMeal(null);
    setMealName('');
    setMealCalories('');
    setProtein('');
    setCarbs('');
    setFats('');
    setError('');
    setShowModal(true);
  };

  const handleQuickAdd = (meal) => {
    setMeals([...meals, {
      id: Date.now(),
      name: meal.name,
      calories: meal.calories,
      protein: meal.protein,
      carbs: meal.carbs,
      fats: meal.fats
    }]);
  };

  const handleEditMeal = (meal) => {
    setEditingMeal(meal);
    setMealName(meal.name);
    setMealCalories(meal.calories.toString());
    setProtein(meal.protein?.toString() || '');
    setCarbs(meal.carbs?.toString() || '');
    setFats(meal.fats?.toString() || '');
    setError('');
    setShowModal(true);
  };

  const handleSaveMeal = () => {
    if (!mealName.trim()) {
      setError('Please enter a meal name');
      return;
    }
    if (!mealCalories || isNaN(mealCalories) || Number(mealCalories) <= 0) {
      setError('Please enter valid calories');
      return;
    }

    if (editingMeal) {
      setMeals(meals.map(m => 
        m.id === editingMeal.id 
          ? { 
              ...m, 
              name: mealName, 
              calories: Number(mealCalories),
              protein: Number(protein) || 0,
              carbs: Number(carbs) || 0,
              fats: Number(fats) || 0
            }
          : m
      ));
    } else {
      setMeals([...meals, {
        id: Date.now(),
        name: mealName,
        calories: Number(mealCalories),
        protein: Number(protein) || 0,
        carbs: Number(carbs) || 0,
        fats: Number(fats) || 0
      }]);
    }
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
    setError('');
  };

  const handleDeleteMeal = (mealId) => {
    setMeals(meals.filter(m => m.id !== mealId));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Main Content */}
          <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 md:p-8">
            {/* Streak Counter & Quote */}
            <div className="mb-6 flex justify-between items-start">
              <div className="bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl px-4 py-2 flex items-center gap-2">
                <Flame className="w-5 h-5" />
                <div>
                  <p className="text-xs font-medium">Streak</p>
                  <p className="text-xl font-bold">{streak} days</p>
                </div>
              </div>
              <button
                onClick={() => setShowWeekView(!showWeekView)}
                className="flex items-center gap-2 bg-indigo-100 text-indigo-700 px-4 py-2 rounded-lg hover:bg-indigo-200 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                {showWeekView ? 'Day View' : 'Week View'}
              </button>
            </div>

            <div className="mb-6 bg-gradient-to-r from-purple-100 to-pink-100 rounded-xl p-4 border border-purple-200">
              <p className="text-purple-800 font-medium text-center">{currentQuote}</p>
            </div>

            {/* Week View */}
            {showWeekView ? (
              <div className="mb-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Weekly Progress</h3>
                <div className="flex justify-between items-end h-48 gap-2">
                  {weekData.map((day, index) => {
                    const percentage = (day.calories / day.target) * 100;
                    return (
                      <div key={index} className="flex-1 flex flex-col items-center">
                        <div className="w-full bg-gray-200 rounded-t-lg relative" style={{ height: '160px' }}>
                          <div 
                            className={`absolute bottom-0 w-full rounded-t-lg transition-all ${
                              percentage >= 90 && percentage <= 110 ? 'bg-green-500' : 
                              percentage > 110 ? 'bg-red-500' : 'bg-yellow-500'
                            }`}
                            style={{ height: `${Math.min(percentage, 100)}%` }}
                          />
                        </div>
                        <p className="text-xs font-semibold text-gray-600 mt-2">{day.day}</p>
                        <p className="text-xs text-gray-500">{day.calories}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <>
                {/* Date Switcher */}
                <div className="flex items-center justify-between mb-8">
                  <button 
                    onClick={handlePrevDay}
                    className="p-3 hover:bg-purple-100 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <ChevronLeft className="w-6 h-6 text-purple-600" />
                  </button>
                  
                  <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl px-8 py-3 shadow-lg">
                    <span className="text-xl font-bold">{formatDate(currentDate)}</span>
                  </div>
                  
                  <button 
                    onClick={handleNextDay}
                    className="p-3 hover:bg-purple-100 rounded-xl transition-all duration-200 hover:scale-105"
                  >
                    <ChevronRight className="w-6 h-6 text-purple-600" />
                  </button>
                </div>

                {/* Calories */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 shadow-lg">
                    <p className="text-blue-100 text-sm font-medium mb-1">Total Calories</p>
                    <p className="text-white text-3xl font-bold">{totalCalories}</p>
                  </div>
                  <div className={`bg-gradient-to-br ${remainingCalories >= 0 ? 'from-green-500 to-green-600' : 'from-red-500 to-red-600'} rounded-xl p-6 shadow-lg`}>
                    <p className={`${remainingCalories >= 0 ? 'text-green-100' : 'text-red-100'} text-sm font-medium mb-1`}>Remaining</p>
                    <p className="text-white text-3xl font-bold">{remainingCalories}</p>
                  </div>
                </div>

                {/* Macros */}
                <div className="mb-8 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 border border-indigo-200">
                  <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-indigo-600" />
                    Macros Tracking
                  </h3>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Protein</span>
                        <span className="text-gray-600">{consumedProtein}g / {totalProtein}g</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-red-500 h-2 rounded-full transition-all" style={{ width: `${Math.min((consumedProtein / totalProtein) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Carbs</span>
                        <span className="text-gray-600">{consumedCarbs}g / {totalCarbs}g</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-yellow-500 h-2 rounded-full transition-all" style={{ width: `${Math.min((consumedCarbs / totalCarbs) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span className="font-medium text-gray-700">Fats</span>
                        <span className="text-gray-600">{consumedFats}g / {totalFats}g</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full transition-all" style={{ width: `${Math.min((consumedFats / totalFats) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Quick Add Buttons */}
                <div className="mb-6">
                  <h3 className="text-sm font-bold text-gray-700 mb-3">Quick Add</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {quickAddMeals.map((meal, index) => (
                      <button
                        key={index}
                        onClick={() => handleQuickAdd(meal)}
                        className="bg-gradient-to-r from-teal-100 to-cyan-100 hover:from-teal-200 hover:to-cyan-200 text-teal-800 px-3 py-2 rounded-lg text-sm font-medium transition-all border border-teal-200"
                      >
                        + {meal.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Meals Section */}
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Today's Meals</h2>
                    <button
                      onClick={handleAddMeal}
                      className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 shadow-lg"
                    >
                      <Plus className="w-5 h-5" />
                      Add Meal
                    </button>
                  </div>
                  
                  {meals.length > 0 ? (
                    <div className="space-y-3">
                      {meals.map((meal) => (
                        <div 
                          key={meal.id}
                          className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-100"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-semibold text-gray-800 text-lg">{meal.name}</p>
                              <p className="text-purple-600 font-medium">{meal.calories} cal</p>
                              <p className="text-xs text-gray-600 mt-1">
                                P: {meal.protein || 0}g | C: {meal.carbs || 0}g | F: {meal.fats || 0}g
                              </p>
                            </div>
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleEditMeal(meal)}
                                className="px-3 py-1 bg-white text-purple-600 rounded-lg text-sm font-medium hover:bg-purple-100 transition-colors shadow-sm"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDeleteMeal(meal.id)}
                                className="px-3 py-1 bg-white text-red-500 rounded-lg text-sm font-medium hover:bg-red-50 transition-colors shadow-sm"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-12 text-center border-2 border-dashed border-gray-300">
                      <div className="text-gray-300 text-6xl mb-4">🍽️</div>
                      <p className="text-gray-500 text-lg font-medium mb-4">No meals logged yet</p>
                      <button
                        onClick={handleAddMeal}
                        className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-xl font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 shadow-lg"
                      >
                        <Plus className="w-5 h-5" />
                        Add your first meal
                      </button>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          {/* Add/Edit Modal */}
          {showModal && (
            <div className="lg:w-96 bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                  {editingMeal ? 'Edit Meal' : 'Add Meal'}
                </h2>
                <button 
                  onClick={handleCancel} 
                  className="p-2 hover:bg-gray-100 rounded-xl transition-colors"
                >
                  <X className="w-6 h-6 text-gray-600" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Meal Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g., Breakfast, Lunch, Snack"
                    value={mealName}
                    onChange={(e) => setMealName(e.target.value)}
                    className="w-full border-2 border-gray-200 focus:border-purple-500 focus:outline-none rounded-xl px-4 py-3 text-base transition-colors"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Calories
                  </label>
                  <input
                    type="number"
                    placeholder="e.g., 450"
                    value={mealCalories}
                    onChange={(e) => setMealCalories(e.target.value)}
                    className="w-full border-2 border-gray-200 focus:border-purple-500 focus:outline-none rounded-xl px-4 py-3 text-base transition-colors"
                  />
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Protein (g)
                    </label>
                    <input
                      type="number"
                      placeholder="20"
                      value={protein}
                      onChange={(e) => setProtein(e.target.value)}
                      className="w-full border-2 border-gray-200 focus:border-purple-500 focus:outline-none rounded-lg px-3 py-2 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Carbs (g)
                    </label>
                    <input
                      type="number"
                      placeholder="30"
                      value={carbs}
                      onChange={(e) => setCarbs(e.target.value)}
                      className="w-full border-2 border-gray-200 focus:border-purple-500 focus:outline-none rounded-lg px-3 py-2 text-sm transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-2">
                      Fats (g)
                    </label>
                    <input
                      type="number"
                      placeholder="10"
                      value={fats}
                      onChange={(e) => setFats(e.target.value)}
                      className="w-full border-2 border-gray-200 focus:border-purple-500 focus:outline-none rounded-lg px-3 py-2 text-sm transition-colors"
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-6 bg-red-50 border-l-4 border-red-500 text-red-700 p-4 rounded-lg">
                  <p className="font-medium text-sm">{error}</p>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCancel}
                  className="flex-1 border-2 border-gray-300 text-gray-700 rounded-xl py-3 text-base font-semibold hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveMeal}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl py-3 text-base font-semibold hover:from-purple-600 hover:to-pink-600 transition-all duration-200 hover:scale-105 shadow-lg"
                >
                  Save
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}