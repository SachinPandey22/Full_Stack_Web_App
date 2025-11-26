import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Edit2,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';

const MealCard = ({ meal, deleteMeal, mealTypeConfig, onEdit }) => {
  const [expanded, setExpanded] = useState(false);
  const config = mealTypeConfig[meal.type];
  const Icon = config.icon;
  const hasImage = Boolean(meal.image);

  const toggleExpanded = () => setExpanded((prev) => !prev);

  return (
    <div
      className={`${config.bgColor} border ${config.borderColor} rounded-xl p-4 hover:shadow-md transition-all duration-300`}
    >
      <button
        type="button"
        onClick={toggleExpanded}
        className="w-full text-left"
      >
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-lg bg-gradient-to-br ${config.color}`}>
              <Icon size={18} className="text-white" />
            </div>
            <div>
              <h4 className="font-semibold text-gray-800">{meal.name}</h4>
              <p className="text-xs text-gray-500">
                {meal.date} • {meal.time}
              </p>
              <p className="text-sm font-semibold text-gray-700 mt-1">{meal.calories} cal</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">
              {expanded ? 'Hide details' : 'View details'}
            </span>
            {expanded ? (
              <ChevronUp className="w-5 h-5 text-gray-500" />
            ) : (
              <ChevronDown className="w-5 h-5 text-gray-500" />
            )}
          </div>
        </div>
      </button>

      <div
        className={`transition-all duration-300 ease-in-out overflow-hidden ${
          expanded ? 'max-h-96 opacity-100 mt-4' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="flex items-start gap-4">
          <div className="w-24 h-24 rounded-lg border border-gray-200 bg-white flex items-center justify-center overflow-hidden shrink-0">
            {hasImage ? (
              <img
                src={meal.image}
                alt={meal.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center text-gray-400">
                <ImageIcon className="w-6 h-6" />
                <span className="text-[11px] mt-1">No photo</span>
              </div>
            )}
          </div>

          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap gap-3 text-sm text-gray-700">
              <span className="font-semibold text-gray-800">Macros</span>
              <span>P: {meal.protein}g</span>
              <span>C: {meal.carbs}g</span>
              <span>F: {meal.fat}g</span>
            </div>

            {meal.notes && (
              <p className="text-sm text-gray-600 bg-white/70 border border-gray-200 rounded-lg p-3">
                {meal.notes}
              </p>
            )}

            <div className="flex gap-2">
              <button
                onClick={() => onEdit && onEdit(meal)}
                className="flex items-center gap-2 px-3 py-2 text-sm bg-white border border-gray-200 rounded-lg hover:border-gray-300 transition-colors"
                type="button"
              >
                <Edit2 size={14} className="text-gray-500" />
                Edit
              </button>
              <button
                onClick={() => deleteMeal(meal.id)}
                className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 bg-white border border-red-200 rounded-lg hover:bg-red-50 transition-colors"
                type="button"
              >
                <Trash2 size={14} />
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MealCard;
