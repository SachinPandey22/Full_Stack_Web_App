import React, { useState } from 'react';
import { Utensils, Plus, Edit2, Trash2, Copy, Flame, Apple, Coffee, Sunset, Moon, ArrowLeft, Sparkles } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useSwipeable } from 'react-swipeable';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import DateNavigator from './DateNavigator';

const MealLogging = () => {
  const [showMealLog, setShowMealLog] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [goalsSet, setGoalsSet] = useState(false);
  const [showGoalsModal, setShowGoalsModal] = useState(false);
  
  // Add current date state
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [meals, setMeals] = useState([
    { id: 1, type: 'breakfast', name: 'Oatmeal & Berries', calories: 320, protein: 12, carbs: 58, fat: 6, time: '8:30 AM', date: new Date().toDateString() },
    { id: 2, type: 'lunch', name: 'Grilled Chicken Salad', calories: 450, protein: 42, carbs: 28, fat: 18, time: '12:45 PM', date: new Date().toDateString() },
    { id: 3, type: 'dinner', name: 'Salmon & Sweet Potato', calories: 580, protein: 38, carbs: 52, fat: 22, time: '7:00 PM', date: new Date().toDateString() },
    { id: 4, type: 'snacks', name: 'Greek Yogurt & Almonds', calories: 200, protein: 15, carbs: 18, fat: 8, time: '3:30 PM', date: new Date().toDateString() }
  ]);
  
  const [newMeal, setNewMeal] = useState({
    type: 'breakfast',
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  const [toast, setToast] = useState('');
  const [quote] = useState("Progress, not perfection.");
  const [streak] = useState(4);

  const [dailyGoals, setDailyGoals] = useState({ 
    calories: 2200, 
    protein: 165, 
    carbs: 220, 
    fat: 73 
  });

  const [goalInput, setGoalInput] = useState({
    calories: '',
    protein: '',
    carbs: '',
    fat: ''
  });

  // Filter meals for current date
  const currentDateMeals = meals.filter(meal => 
    meal.date === currentDate.toDateString()
  );

  const totals = currentDateMeals.reduce((acc, meal) => ({
    calories: acc.calories + meal.calories,
    protein: acc.protein + meal.protein,
    carbs: acc.carbs + meal.carbs,
    fat: acc.fat + meal.fat
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 });

  const remaining = dailyGoals.calories - totals.calories;

  // Generate week data based on current date
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

  // Swipe gesture handlers
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => {
      // Swipe left = next day
      setCurrentDate(addDays(currentDate, 1));
    },
    onSwipedRight: () => {
      // Swipe right = previous day
      setCurrentDate(subDays(currentDate, 1));
    },
    trackMouse: true,
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3000);
  };

  const handleOpenMealTracker = () => {
    if (!goalsSet) {
      setShowGoalsModal(true);
    } else {
      setShowMealLog(true);
    }
  };

  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
    showToast(`📅 Switched to ${format(newDate, 'MMM d, yyyy')}`);
  };

  const saveGoals = () => {
    const newGoals = {
      calories: parseInt(goalInput.calories) || 2200,
      protein: parseInt(goalInput.protein) || 165,
      carbs: parseInt(goalInput.carbs) || 220,
      fat: parseInt(goalInput.fat) || 73
    };
    setDailyGoals(newGoals);
    setGoalsSet(true);
    setShowGoalsModal(false);
    setShowMealLog(true);
    showToast('🎯 Goals set! Let\'s start tracking!');
  };

  const addMeal = () => {
    if (!newMeal.name || !newMeal.calories) return;
    
    const meal = {
      id: Date.now(),
      type: newMeal.type,
      name: newMeal.name,
      calories: parseInt(newMeal.calories) || 0,
      protein: parseInt(newMeal.protein) || 0,
      carbs: parseInt(newMeal.carbs) || 0,
      fat: parseInt(newMeal.fat) || 0,
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }),
      date: currentDate.toDateString()
    };
    
    setMeals([...meals, meal]);
    setShowModal(false);
    setNewMeal({ type: 'breakfast', name: '', calories: '', protein: '', carbs: '', fat: '' });
    showToast('✅ Meal added successfully!');
  };

  const deleteMeal = (id) => {
    setMeals(meals.filter(m => m.id !== id));
    showToast('🗑️ Meal removed');
  };

  const copyYesterday = () => {
    const yesterday = subDays(currentDate, 1);
    const yesterdayMeals = meals.filter(meal => meal.date === yesterday.toDateString());
    
    if (yesterdayMeals.length === 0) {
      showToast('❌ No meals found for yesterday');
      return;
    }

    const copiedMeals = yesterdayMeals.map(meal => ({
      ...meal,
      id: Date.now() + Math.random(),
      date: currentDate.toDateString(),
      time: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
    }));

    setMeals([...meals, ...copiedMeals]);
    showToast('📋 Yesterday\'s meals copied!');
  };

  const ProgressBar = ({ current, goal, label, color = 'bg-blue-500' }) => {
    const percentage = Math.min((current / goal) * 100, 100);
    return (
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="font-medium text-gray-700">{label}</span>
          <span className="text-gray-600">{current}g / {goal}g</span>
        </div>
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className={`h-full ${color} transition-all duration-500`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>
    );
  };

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
        
        <div className="flex items-center justify-between">
          <div className="flex gap-4 text-sm">
            <span className="font-bold text-gray-700">{meal.calories} cal</span>
            <span className="text-gray-600">P: {meal.protein}g</span>
            <span className="text-gray-600">C: {meal.carbs}g</span>
            <span className="text-gray-600">F: {meal.fat}g</span>
          </div>
        </div>
      </div>
    );
  };

  // Dashboard card view
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

        {/* Goals Modal - Show when opening tracker for first time */}
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
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl mt-6"
                >
                  Set Goals & Start Tracking
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    );
  }

  // Full meal log view with swipe gestures
  return (
    <div 
      {...swipeHandlers}
      className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 overflow-hidden z-50"
    >
      <div className="h-full flex flex-col">
        {/* Header with back button and date navigator */}
        <div className="p-4 md:p-8 bg-white shadow-sm border-b border-gray-100">
          <div className="max-w-7xl mx-auto">
            <button
              onClick={() => setShowMealLog(false)}
              className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold mb-6 transition-colors group"
            >
              <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
              Back to Dashboard
            </button>

            <div className="flex items-start justify-between gap-8">
              <div className="flex-1">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">Meal Log</h1>
                <DateNavigator 
                  currentDate={currentDate}
                  onDateChange={handleDateChange}
                  className="mb-4"
                />
                
                <div className="flex items-center gap-3 text-gray-600 mb-4">
                  <div className="flex items-center gap-2 text-orange-600 font-semibold text-lg">
                    <Flame size={24} />
                    <span>{streak} day streak</span>
                  </div>
                  <button
                    onClick={() => setShowGoalsModal(true)}
                    className="text-sm text-purple-600 hover:text-purple-700 font-medium underline"
                  >
                    Edit Goals
                  </button>
                </div>

                <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-xl p-4 border-l-4 border-purple-500">
                  <div className="flex items-center gap-2">
                    <Sparkles size={18} className="text-purple-600" />
                    <p className="text-gray-700 italic font-medium">"{quote}"</p>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>

        {/* Scrollable content area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            
            {/* Daily Progress */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <h2 className="text-2xl font-bold text-gray-800">Daily Progress</h2>
                  <span className="text-3xl font-bold text-blue-600">{totals.calories} / {dailyGoals.calories}</span>
                </div>
                <div className="h-5 bg-gray-200 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                    style={{ width: `${Math.min((totals.calories / dailyGoals.calories) * 100, 100)}%` }}
                  />
                </div>
                <p className="text-sm text-gray-600 mt-2 font-medium">
                  {remaining > 0 ? `${remaining} kcal remaining` : `Goal reached! 🎉`}
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <ProgressBar current={totals.protein} goal={dailyGoals.protein} label="Protein" color="bg-red-500" />
                <ProgressBar current={totals.carbs} goal={dailyGoals.carbs} label="Carbs" color="bg-yellow-500" />
                <ProgressBar current={totals.fat} goal={dailyGoals.fat} label="Fat" color="bg-green-500" />
              </div>
            </div>

            {/* Today's Meals */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800">
                  {isSameDay(currentDate, new Date()) ? "Today's Meals" : `Meals for ${format(currentDate, 'MMM d, yyyy')}`}
                </h2>
                <button
                  onClick={() => setShowModal(true)}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-5 py-2.5 rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg flex items-center gap-2"
                >
                  <Plus size={18} />
                  Add Meal
                </button>
              </div>

              <div className="space-y-6">
                {['breakfast', 'lunch', 'dinner', 'snacks'].map(type => {
                  const typeMeals = currentDateMeals.filter(m => m.type === type);
                  return (
                    <div key={type}>
                      <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wide mb-3 ml-1">{type}</h3>
                      {typeMeals.length > 0 ? (
                        <div className="space-y-3">
                          {typeMeals.map(meal => <MealCard key={meal.id} meal={meal} />)}
                        </div>
                      ) : (
                        <p className="text-gray-400 text-sm italic ml-2 mb-2">No meals added yet</p>
                      )}
                    </div>
                  );
                })}
              </div>

              <button
                onClick={copyYesterday}
                className="w-full mt-6 border-2 border-dashed border-gray-300 text-gray-600 py-3 rounded-xl font-medium hover:bg-gray-50 hover:border-gray-400 transition-all flex items-center justify-center gap-2"
              >
                <Copy size={18} />
                Copy Yesterday's Meals
              </button>
            </div>

            {/* Weekly Overview */}
            <div className="bg-white rounded-2xl shadow-xl p-6 md:p-8">
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Weekly Overview</h3>
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={weekData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fontSize: 14, fill: '#6b7280' }}
                    stroke="#d1d5db"
                  />
                  <YAxis 
                    tick={{ fontSize: 14, fill: '#6b7280' }}
                    stroke="#d1d5db"
                  />
                  <Tooltip 
                    contentStyle={{ 
                      background: '#fff', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '12px',
                      fontSize: '14px',
                      padding: '12px'
                    }}
                  />
                  <Bar 
                    dataKey="calories" 
                    fill="url(#colorGradient)" 
                    radius={[10, 10, 0, 0]}
                  />
                  <defs>
                    <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#6366f1" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
              <p className="text-sm text-gray-500 mt-4 text-center">Daily calorie intake this week</p>
            </div>

          </div>
        </div>
      </div>

      {/* Add Meal Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-8 relative animate-fade-in">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 transition-colors text-2xl"
            >
              ✕
            </button>

            <h2 className="text-3xl font-bold text-gray-900 mb-2">Add New Meal</h2>
            <p className="text-gray-500 mb-6">Log your meal to track your progress</p>

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

              <button
                onClick={addMeal}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-4 rounded-xl font-bold hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl mt-6"
              >
                Add Meal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Goals Modal */}
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
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl mt-6"
              >
                {goalsSet ? 'Update Goals' : 'Set Goals & Start Tracking'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl animate-fade-in flex items-center gap-3 z-50">
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
          {toast}
        </div>
      )}

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
