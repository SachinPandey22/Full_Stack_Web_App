import React from 'react';
import { Utensils } from 'lucide-react';

const DashboardCard = ({ handleOpenMealTracker }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center px-4 py-6">
      <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 shadow-md">
        <Utensils size={36} className="text-white" />
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-2">Meal Tracker</h2>

      <p className="text-gray-600 text-base mb-6 max-w-sm">
        Track your daily nutrition and reach your calorie goals with ease
      </p>

      <button
        onClick={handleOpenMealTracker}
        className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-semibold text-base hover:from-purple-700 hover:to-pink-700 transition-all shadow-lg hover:shadow-xl cursor-pointer relative z-10"
        type="button"
      >
        Open Meal Tracker
      </button>
    </div>
  );
};

export default DashboardCard;
