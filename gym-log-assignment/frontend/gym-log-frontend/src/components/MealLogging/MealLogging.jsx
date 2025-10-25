// MealLogging Component - handles meal tracking, goals, and daily nutrition
import React, { useState, useEffect, useCallback } from 'react';
import { Utensils, Plus, Edit2, Trash2, Copy, Apple, Coffee, Sunset, Moon, ArrowLeft } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSwipeable } from 'react-swipeable';
import { format, addDays, subDays } from 'date-fns';
import DateNavigator from './DateNavigator';
import MotivationalQuotes from './MotivationalQuotes';
import WaterTracker from './WaterTracker';
import {
  getMealsByDate,
  createMeal,
  deleteMeal as apiDeleteMeal,
  getMealTargets,
  saveMealTargets
} from '../../services/MealLogging';

const MealLogging = () => {
  // Basic UI states
  const [showMealLog, setShowMealLog] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [goalsSet, setGoalsSet] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState('');
  
  // Date picker
  const [currentDate, setCurrentDate] = useState(new Date());
  
  // All the meals data
  const [meals, setMeals] = useState([]);
  
  // Form data for adding new meals
  const [newMeal, setNewMeal] = useState({
    type: 'breakfast',
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    notes: ''
  });

  // User's daily nutrition goals
  const [dailyGoals, setDailyGoals] = useState({ 
    calories: 2200, 
    protein: 165, 
    carbs: 220, 
    fat: 73 
  });

  // Temp storage for goal inputs
  const [goalInput, setGoalInput] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  // Load goals when component first renders
  useEffect(() => {
    loadMealTargets();
  }, []);

  // Fetch meal targets from database
  const loadMealTargets = async () => {
    try {
      const targets = await getMealTargets();
      if (targets) {
        setDailyGoals({
          calories: targets.daily_calories,
          protein: targets.daily_protein,
          carbs: targets.daily_carbs,
          fat: targets.daily_fat
        });
        setGoalsSet(true);
      }
    } catch (error) {
      console.error('Failed to load meal targets:', error);
    }
  };

  // Load meals for a specific date from database
  const loadMealsForDate = useCallback(async (date) => {
    try {
      setLoading(true);
      const dateStr = format(date, 'yyyy-MM-dd');
      const mealsData = await getMealsByDate(dateStr);
      
      // Convert API format to what we use in the component
      const transformedMeals = mealsData.map(meal => ({
        id: meal.id,
        type: meal.meal_type,
        name: meal.name,
        calories: meal.calories,
        protein: meal.protein,
        carbs: meal.carbs,
        fat: meal.fat,
        time: meal.time,
        date: date.toDateString(),
        notes: meal.notes || ''
      }));
      
      setMeals(transformedMeals);
    } catch (error) {
      console.error('Failed to load meals:', error);
      showToast('Failed to load meals');
    } finally {
      setLoading(false);
    }
  }, []);

  // Reload meals whenever the date changes or goals are set
  useEffect(() => {
    if (goalsSet) {
      loadMealsForDate(currentDate);
    }
  }, [currentDate, goalsSet, loadMealsForDate]);

  // Get only today's meals
  const currentDateMeals = meals.filter(meal => 
    meal.date === currentDate.toDateString()
  );

  // Add up all the nutrition for today
  const totals = currentDateMeals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  // How many calories are left for today
  const remaining = dailyGoals.calories - totals.calories;

  // Build data for the weekly chart
  const generateWeekData = () => {
    const data = [];
    for (let i = -6; i <= 0; i++) {
      const date = addDays(currentDate, i);
      const dayMeals = meals.filter(meal => meal.date === date.toDateString());
      const dayCalories = dayMeals.reduce((sum, meal) => sum + meal.calories, 0);
      
      data.push({
        day: format(date, 'EEE'),
        calories: dayCalories,
        date: date
      });
    }
    return data;
  };

  const weekData = generateWeekData();

  // Colors and icons for different meal types
  const mealTypeConfig = {
    breakfast: { 
      icon: Coffee, 
      color: 'from-amber-400 to-orange-400',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200'
    },
    lunch: { 
      icon: Apple, 
      color: 'from-green-400 to-emerald-400',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200'
    },
    dinner: { 
      icon: Sunset, 
      color: 'from-blue-400 to-indigo-400',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200'
    },
    snacks: { 
      icon: Moon, 
      color: 'from-purple-400 to-pink-400',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200'
    }
  };

  // Swipe left/right to change dates on mobile
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      setCurrentDate(addDays(currentDate, 1));
    },
    onSwipedRight: () => {
      setCurrentDate(subDays(currentDate, 1));
    },
    trackMouse: true,
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  // Show a quick notification message
  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  // Open the meal tracker (or show goals modal if first time)
  const handleOpenMealTracker = () => {
    if (!goalsSet) {
      setShowGoalsModal(true);
    } else {
      setShowMealLog(true);
    }
  };

  // When user picks a new date
  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
    showToast(`📅 Switched to ${format(newDate, 'MMM d, yyyy')}`);
  };

  // Save nutrition goals to the database
  const saveGoals = async () => {
    try {
      const newGoals = {
        daily_calories: parseInt(goalInput.calories) || 2200,
        daily_protein: parseInt(goalInput.protein) || 165,
        daily_carbs: parseInt(goalInput.carbs) || 220,
        daily_fat: parseInt(goalInput.fat) || 73
      };
      
      await saveMealTargets(newGoals);
      
      setDailyGoals({
        calories: newGoals.daily_calories,
        protein: newGoals.daily_protein,
        carbs: newGoals.daily_carbs,
        fat: newGoals.daily_fat
      });
      setGoalsSet(true);
      setShowGoalsModal(false);
      setShowMealLog(true);
      showToast('🎯 Goals saved successfully!');
    } catch (error) {
      console.error('Failed to save goals:', error);
      showToast('❌ Failed to save goals');
    }
  };

  // Add a new meal to the database
  const addMeal = async () => {
    try {
      setLoading(true);
      const dateStr = format(currentDate, 'yyyy-MM-dd');
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
      
      const mealData = {
        meal_type: newMeal.type,
        name: newMeal.name,
        calories: parseInt(newMeal.calories) || 0,
        protein: parseInt(newMeal.protein) || 0,
        carbs: parseInt(newMeal.carbs) || 0,
        fat: parseInt(newMeal.fat) || 0,
        date: dateStr,
        time: timeStr,
        notes: newMeal.notes || ''
      };

      const createdMeal = await createMeal(mealData);
      
      // Add it to the list
      const transformedMeal = {
        id: createdMeal.id,
        type: createdMeal.meal_type,
        name: createdMeal.name,
        calories: createdMeal.calories,
        protein: createdMeal.protein,
        carbs: createdMeal.carbs,
        fat: createdMeal.fat,
        time: createdMeal.time,
        date: currentDate.toDateString(),
        notes: createdMeal.notes || ''
      };

      setMeals([...meals, transformedMeal]);
      setShowModal(false);
      setNewMeal({ type: 'breakfast', name: '', calories: '', protein: '', carbs: '', fat: '', notes: '' });
      showToast('✅ Meal added successfully!');
    } catch (error) {
      console.error('Failed to add meal:', error);
      showToast('❌ Failed to add meal');
    } finally {
      setLoading(false);
    }
  };

  // Delete a meal
  const deleteMeal = async (id) => {
    try {
      setLoading(true);
      await apiDeleteMeal(id);
      setMeals(meals.filter(meal => meal.id !== id));
      showToast('🗑️ Meal deleted');
    } catch (error) {
      console.error('Failed to delete meal:', error);
      showToast('❌ Failed to delete meal');
    } finally {
      setLoading(false);
    }
  };

  // Copy all meals from yesterday to today
  const copyYesterday = async () => {
    try {
      setLoading(true);
      const yesterday = subDays(currentDate, 1);
      const yesterdayStr = format(yesterday, 'yyyy-MM-dd');
      const yesterdayMeals = await getMealsByDate(yesterdayStr);

      if (yesterdayMeals.length === 0) {
        showToast('❌ No meals found from yesterday');
        return;
      }

      const todayStr = format(currentDate, 'yyyy-MM-dd');
      const now = new Date();
      const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

      // Create each meal from yesterday
      for (const meal of yesterdayMeals) {
        const mealData = {
          meal_type: meal.meal_type,
          name: meal.name,
          calories: meal.calories,
          protein: meal.protein,
          carbs: meal.carbs,
          fat: meal.fat,
          date: todayStr,
          time: timeStr,
          notes: meal.notes || ''
        };
        await createMeal(mealData);
      }

      await loadMealsForDate(currentDate);
      showToast(`📋 Copied ${yesterdayMeals.length} meals from yesterday!`);
    } catch (error) {
      console.error('Failed to copy meals:', error);
      showToast('❌ Failed to copy meals');
    } finally {
      setLoading(false);
    }
  };

  // Progress bar component for macros
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

  // Single meal card
  const MealCard = ({ meal }) => {
    const config = mealTypeConfig[meal.type];
    const Icon = config.icon;
    
    return (
      <div className={`${config.bgColor} border ${config.borderColor} rounded-xl p-4 hover:shadow-md transition-all duration-300`}>
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${config.color}`}>
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{meal.name}</h4>
              <p className="text-xs text-gray-500">{meal.time}</p>
            </div>
          </div>
          <div className="flex gap-1">
            <button className="p-1.5 hover:bg-white rounded-lg transition-colors">
              <Edit2 size={14} className="text-gray-400 hover:text-gray-600" />
            </button>
            <button 
              onClick={() => deleteMeal(meal.id)}
              className="p-1.5 hover:bg-white rounded-lg transition-colors"
            >
              <Trash2 size={14} className="text-gray-400 hover:text-red-500" />
            </button>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex gap-4 text-sm">
              <span className="font-bold text-gray-700">{meal.calories} cal</span>
              <span className="text-gray-600">P: {meal.protein}g</span>
              <span className="text-gray-600">C: {meal.carbs}g</span>
              <span className="text-gray-600">F: {meal.fat}g</span>
            </div>
          </div>
          
          {meal.notes && (
            <div className="pt-2 border-t border-gray-200">
              <p className="text-sm text-gray-600 italic">💭 {meal.notes}</p>
            </div>
          )}
        </div>
      </div>
    );
  };

  // If tracker is closed, show the dashboard card
  if (!showMealLog) {
    return (
      <>
        <div className="flex flex-col items-center justify-center h-full text-center px-6 py-8">
          <div className="w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 shadow-lg">
            <Utensils size={48} className="text-white" />
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-3">Meal Tracker</h2>

          <p className="text-gray-600 text-lg mb-8 max-w-md">
            Track your daily nutrition and reach your calorie goals with ease
          </p>

          <button
            onClick={handleOpenMealTracker}
            className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:from-purple-700 hover:to-pink-700 transition-all shadow-xl hover:shadow-2xl hover:scale-105 cursor-pointer relative z-10"
            type="button"
          >
            Open Meal Tracker
          </button>
        </div>

        {/* First time setup modal */}
        {showGoalsModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">Set Your Daily Goals</h2>
              <p className="text-gray-500 mb-6">First, let's set your nutrition targets</p>

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

                <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mt-4">
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
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl mt-6 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : 'Set Goals & Start Tracking'}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Full screen tracker view
  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 z-[9999] overflow-auto">
      {/* Loading spinner */}
      {loading && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg z-50">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
            <span className="text-gray-700 font-medium">Loading...</span>
          </div>
        </div>
      )}

      {/* Top bar */}
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setShowMealLog(false)}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              Meal Tracker
            </h1>
            <button
              onClick={() => setShowGoalsModal(true)}
              className="text-sm text-purple-600 hover:text-purple-700 font-medium"
            >
              Edit Goals
            </button>
          </div>
        </div>
      </div>

      {/* Date picker */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <DateNavigator 
          currentDate={currentDate}
          onDateChange={handleDateChange}
        />
      </div>

      {/* Main content */}
      <div {...swipeHandlers} className="max-w-7xl mx-auto px-4 space-y-6 pb-20">
        {/* Motivational quotes */}
        <MotivationalQuotes />

        {/* Progress section */}
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

        {/* Water tracker */}
        <WaterTracker currentDate={currentDate} />

        {/* Weekly chart */}
        <div className="bg-white rounded-2xl shadow-xl p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">7-Day Calorie Trend</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={weekData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="calories" fill="url(#colorGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8b5cf6" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Meals list */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Meals</h2>
            <div className="flex gap-2">
              <button
                onClick={copyYesterday}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all text-sm font-medium disabled:opacity-50"
              >
                <Copy className="w-4 h-4" />
                Copy Yesterday
              </button>
              <button
                onClick={() => setShowModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg font-medium"
              >
                <Plus className="w-4 h-4" />
                Add Meal
              </button>
            </div>
          </div>

          {/* Show empty state or meals */}
          {currentDateMeals.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils size={36} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No meals logged yet</h3>
              <p className="text-gray-500 mb-6">Start tracking your nutrition by adding your first meal!</p>
              <button
                onClick={() => setShowModal(true)}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg"
              >
                Add Your First Meal
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {['breakfast', 'lunch', 'dinner', 'snacks'].map(type => {
                const typeMeals = currentDateMeals.filter(m => m.type === type);
                if (typeMeals.length === 0) return null;
                
                return (
                  <div key={type}>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 capitalize flex items-center gap-2">
                      {React.createElement(mealTypeConfig[type].icon, { size: 20 })}
                      {type}
                    </h3>
                    <div className="space-y-3">
                      {typeMeals.map(meal => (
                        <MealCard key={meal.id} meal={meal} />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add meal modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-gray-900 mb-6">Add New Meal</h2>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Type</label>
                <select
                  value={newMeal.type}
                  onChange={(e) => setNewMeal({...newMeal, type: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                >
                  <option value="breakfast">🌅 Breakfast</option>
                  <option value="lunch">☀️ Lunch</option>
                  <option value="dinner">🌙 Dinner</option>
                  <option value="snacks">🍎 Snacks</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Meal Name</label>
                <input
                  type="text"
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({...newMeal, name: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="e.g. Greek Yogurt Bowl"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">Calories</label>
                <input
                  type="number"
                  value={newMeal.calories}
                  onChange={(e) => setNewMeal({...newMeal, calories: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="0"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Protein (g)</label>
                  <input
                    type="number"
                    value={newMeal.protein}
                    onChange={(e) => setNewMeal({...newMeal, protein: e.target.value})}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Carbs (g)</label>
                  <input
                    type="number"
                    value={newMeal.carbs}
                    onChange={(e) => setNewMeal({...newMeal, carbs: e.target.value})}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-2">Fat (g)</label>
                  <input
                    type="number"
                    value={newMeal.fat}
                    onChange={(e) => setNewMeal({...newMeal, fat: e.target.value})}
                    className="w-full px-3 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  value={newMeal.notes}
                  onChange={(e) => setNewMeal({...newMeal, notes: e.target.value})}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                  placeholder="Add any notes about this meal..."
                  rows="3"
                />
                <p className="text-xs text-gray-500 mt-1">
                  E.g., "Felt energized after", "Too salty", "Post-workout meal"
                </p>
              </div>

              <button
                onClick={addMeal}
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl mt-6 disabled:opacity-50"
              >
                {loading ? 'Adding...' : 'Add Meal'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit goals modal */}
      {showGoalsModal && (
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

              <div className="bg-purple-50 border border-purple-200 rounded-xl p-4 mt-4">
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
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl mt-6 disabled:opacity-50"
              >
                {loading ? 'Saving...' : goalsSet ? 'Update Goals' : 'Set Goals & Start Tracking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl animate-fade-in flex items-center gap-3 z-50">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {toast}
        </div>
      )}

      {/* Fade in animation */}
      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default MealLogging;