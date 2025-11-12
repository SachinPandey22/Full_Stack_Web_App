import React from 'react';
import { Edit2, Trash2 } from 'lucide-react';

const MealCard = ({ meal, deleteMeal, mealTypeConfig, onEdit }) => {
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
          <button
            onClick={() => onEdit && onEdit(meal)}
            className="p-1.5 hover:bg-white rounded-lg transition-colors"
            type="button"
          >
            <Edit2 size={14} className="text-gray-400 hover:text-gray-600" />
          </button>
          <button
            onClick={() => deleteMeal(meal.id)}
            className="p-1.5 hover:bg-white rounded-lg transition-colors"
            type="button"
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
            <p className="text-sm text-gray-600 italic">“{meal.notes}”</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MealCard;
