// MealLogging Component - handles meal tracking, goals, and daily nutrition
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Utensils, Plus, Copy, Apple, Coffee, Sunset, Moon, ArrowLeft } from 'lucide-react';
import { useSwipeable } from 'react-swipeable';
import { addDays, subDays, format } from 'date-fns';

import DateNavigator from './DateNavigator';
import MotivationalQuotes from './MotivationalQuotes';
import WaterTracker from './WaterTracker';

import ProgressSection from './ProgressSection';
import WeeklyChart from './WeeklyChart';
import MealCard from './MealCard';
import GoalsModal from './GoalsModal';
import AddMealModal from './AddMealModal';
import ToastNotification from './ToastNotification';
import ChatPopup from '../ChatSupport/ChatPopup';
import AppNavBar from '../layout/AppNavBar';

import { useMealLogging } from './hooks/useMealLogging';

const MealLogging = () => {
  const navigate = useNavigate();
  const {
    newMeal,
    setNewMeal,
    editingMeal,
    goalInput,
    setGoalInput,
    dailyGoals,
    currentDate,
    setCurrentDate,
    totals,
    remaining,
    weekData,
    currentDateMeals,
    water,
    waterLoading,
    waterSaving,
    loading,
    toast,
    showModal,
    setShowModal,
    goalsSet,
    showGoalsModal,
    setShowGoalsModal,
    handlers,
  } = useMealLogging();

  const {
    saveGoals,
    useRecommendations,
    addMeal,
    deleteMeal,
    copyYesterday,
    showToast,
    startAddMeal,
    startEditMeal,
    resetMealForm,
    incrementWater,
    decrementWater,
    updateWater,
  } = handlers;

  const handleManualGoals = () => {
    setShowGoalsModal(false);
    navigate('/nutrition');
  };

  // meal type config (icons/colors)
  const mealTypeConfig = {
    breakfast: {
      icon: Coffee,
      color: 'from-amber-400 to-orange-400',
      bgColor: 'bg-amber-50',
      borderColor: 'border-amber-200',
    },
    lunch: {
      icon: Apple,
      color: 'from-green-400 to-emerald-400',
      bgColor: 'bg-green-50',
      borderColor: 'border-green-200',
    },
    dinner: {
      icon: Sunset,
      color: 'from-blue-400 to-indigo-400',
      bgColor: 'bg-blue-50',
      borderColor: 'border-blue-200',
    },
    snacks: {
      icon: Moon,
      color: 'from-purple-400 to-pink-400',
      bgColor: 'bg-purple-50',
      borderColor: 'border-purple-200',
    },
  };

  // swipe gestures
  const swipeHandlers = useSwipeable({
    onSwipedLeft: () => setCurrentDate(addDays(currentDate, 1)),
    onSwipedRight: () => setCurrentDate(subDays(currentDate, 1)),
    trackMouse: true,
    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  // handle date change
  const handleDateChange = (newDate) => {
    setCurrentDate(newDate);
    showToast(`Switched to ${format(newDate, 'MMM d, yyyy')}`);
  };

  // handle opening meal tracker
  // FULL TRACKER VIEW
  return (
    <>
    <div className="fixed inset-0 bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50 z-[9999] overflow-auto">
      {/* Loading Spinner */}
      {loading && (
        <div className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white px-6 py-3 rounded-full shadow-lg z-50">
          <div className="flex items-center gap-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-purple-600"></div>
            <span className="text-gray-700 font-medium">Loading...</span>
          </div>
        </div>
      )}

      {/* Top Navigation Bar */}
      <AppNavBar/>
      <div className="bg-white shadow-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <button
            onClick={() => navigate('/dashboard')}
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

      {/* Date Navigator */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <DateNavigator currentDate={currentDate} onDateChange={handleDateChange} />
      </div>

      {/* Main Content */}
      <div {...swipeHandlers} className="max-w-7xl mx-auto px-4 space-y-6 pb-20">
        {/* Motivational Quotes */}
        <MotivationalQuotes />

        {/* Progress Section */}
        <ProgressSection totals={totals} dailyGoals={dailyGoals} remaining={remaining} />

        {/* Water Tracker */}
        <WaterTracker
          glasses={water.glasses}
          glassSize={water.glass_size}
          totalMl={water.total_ml}
          isLoading={waterLoading}
          isSaving={waterSaving}
          onAdd={incrementWater}
          onRemove={decrementWater}
          onSelect={updateWater}
        />

        {/* Weekly Chart */}
        <WeeklyChart weekData={weekData} />

        {/* Meals Section */}
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
                onClick={startAddMeal}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg font-medium disabled:opacity-60"
              >
                <Plus className="w-4 h-4" />
                Add Meal
              </button>
            </div>
          </div>

          {/* Empty State or Meals */}
          {currentDateMeals.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-xl p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Utensils size={36} className="text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No meals logged yet</h3>
              <p className="text-gray-500 mb-6">
                Start tracking your nutrition by adding your first meal!
              </p>
              <button
                onClick={startAddMeal}
                disabled={loading}
                className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg disabled:opacity-60"
              >
                Add Your First Meal
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {['breakfast', 'lunch', 'dinner', 'snacks'].map((type) => {
                const typeMeals = currentDateMeals.filter((m) => m.type === type);
                if (typeMeals.length === 0) return null;
                const Icon = mealTypeConfig[type].icon;
                return (
                  <div key={type}>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 capitalize flex items-center gap-2">
                      <Icon size={20} />
                      {type}
                    </h3>
                    <div className="space-y-3">
                      {typeMeals.map((meal) => (
                        <MealCard
                          key={meal.id}
                          meal={meal}
                          deleteMeal={deleteMeal}
                          mealTypeConfig={mealTypeConfig}
                          onEdit={() => {
                            startEditMeal(meal);
                          }}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Add Meal Modal */}
      {showModal && (
        <AddMealModal
          isEditing={!!editingMeal}
          formValues={newMeal}
          setFormValues={setNewMeal}
          loading={loading}
          onSubmit={addMeal}
          onClose={() => {
            setShowModal(false);
            resetMealForm();
          }}
        />
      )}

      {/* Edit Goals Modal */}
      {showGoalsModal && (
        <GoalsModal
          goalsSet={goalsSet}
          goalInput={goalInput}
          setGoalInput={setGoalInput}
          loading={loading}
          onSave={saveGoals}
          onUseRecommendations={useRecommendations}
          onManual={handleManualGoals}
          onClose={() => setShowGoalsModal(false)}
          allowDismiss={goalsSet}
        />
      )}

      {/* Toast Notification */}
      {toast && <ToastNotification toast={toast} />}
      <ChatPopup />

      {/* Fade animation */}
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
    </>
  );
};

export default MealLogging;


