import React from 'react';
import { Utensils } from 'lucide-react';

const DashboardCard = ({ handleOpenMealTracker }) => {
  return (
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
  );
};

export default DashboardCard;
