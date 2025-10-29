import React, { useState, useEffect } from 'react';
import { Droplets, Plus, Minus } from 'lucide-react';
import { format } from 'date-fns';

const WaterTracker = ({ currentDate, onToast }) => {
  const GLASS_SIZE = 500; // ml per glass
  const [filledGlasses, setFilledGlasses] = useState(0);

  // Load from localStorage
  useEffect(() => {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    const saved = localStorage.getItem(`water-${dateStr}`);
    if (saved) {
      setFilledGlasses(parseInt(saved));
    } else {
      setFilledGlasses(0);
    }
  }, [currentDate]);

  // Save to localStorage
  useEffect(() => {
    const dateStr = format(currentDate, 'yyyy-MM-dd');
    localStorage.setItem(`water-${dateStr}`, filledGlasses.toString());
  }, [filledGlasses, currentDate]);

  const addGlass = () => {
    setFilledGlasses(filledGlasses + 1);
    onToast && onToast('💧 Glass added!');
  };

  const removeGlass = () => {
    if (filledGlasses > 0) {
      setFilledGlasses(filledGlasses - 1);
      onToast && onToast('🗑️ Glass removed');
    }
  };

  const handleGlassClick = (index) => {
    if (index < filledGlasses) {
      // Empty from this glass
      setFilledGlasses(index);
    } else if (index === filledGlasses) {
      // Fill this glass
      setFilledGlasses(index + 1);
    }
  };

  const currentMl = filledGlasses * GLASS_SIZE;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200">
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Droplets size={20} className="text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">Water</h3>
        </div>
        
        <div className="text-2xl font-bold text-blue-600 mb-1">
          {currentMl} ml
        </div>
      </div>

      {/* Progress Bar - just visual */}
      <div className="mb-4">
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
            style={{ width: `${Math.min((filledGlasses / 8) * 100, 100)}%` }}
          />
        </div>
      </div>

      {/* Glasses in single row */}
      <div className="mb-5">
        <div className="flex items-center justify-center gap-1.5">
          {[...Array(8)].map((_, index) => (
            <button
              key={index}
              onClick={() => handleGlassClick(index)}
              className="relative group transition-transform hover:scale-110 active:scale-95 w-8"
              title={`Glass ${index + 1}`}
            >
              <svg 
                viewBox="0 0 32 42" 
                className="w-full h-auto drop-shadow-sm"
              >
                <path
                  d="M8 4 L6 36 Q6 38 9 38 L23 38 Q26 38 26 36 L24 4 Q24 2 20 2 L12 2 Q8 2 8 4 Z"
                  fill={index < filledGlasses ? '#3B82F6' : 'white'}
                  stroke={index < filledGlasses ? '#2563EB' : '#D1D5DB'}
                  strokeWidth="1.5"
                  className="transition-all duration-300"
                />
                
                {index < filledGlasses && (
                  <>
                    <defs>
                      <linearGradient id={`water-${index}`} x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#60A5FA" />
                        <stop offset="100%" stopColor="#3B82F6" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M8 4 L6 36 Q6 38 9 38 L23 38 Q26 38 26 36 L24 4"
                      fill={`url(#water-${index})`}
                      opacity="0.9"
                    />
                    <ellipse
                      cx="14"
                      cy="12"
                      rx="2.5"
                      ry="5"
                      fill="white"
                      opacity="0.35"
                    />
                  </>
                )}
              </svg>
            </button>
          ))}
        </div>
        
        <p className="text-xs text-gray-400 text-center mt-2">
          Click to fill/empty
        </p>
      </div>

      {/* Action Buttons */}
      <div className="space-y-2">
        <button
          onClick={addGlass}
          className="w-full py-2.5 px-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md"
        >
          <Plus size={16} />
          Add Glass
        </button>
        
        <button
          onClick={removeGlass}
          disabled={filledGlasses === 0}
          className={`w-full py-2.5 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm ${
            filledGlasses === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          <Minus size={16} />
          Remove
        </button>
      </div>

      {/* Simple Stats - just numbers */}
      <div className="mt-5 pt-5 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-3 text-center">
          <div>
            <div className="text-2xl font-bold text-blue-600">{filledGlasses}</div>
            <div className="text-xs text-gray-500">Glasses</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-cyan-600">{currentMl}</div>
            <div className="text-xs text-gray-500">ML</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaterTracker;