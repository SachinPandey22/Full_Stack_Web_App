import React from 'react';
import { Droplets, Plus, Minus, Loader2 } from 'lucide-react';

const MAX_GLASSES = 8;

const WaterTracker = ({
  glasses = 0,
  glassSize = 500,
  totalMl,
  onAdd,
  onRemove,
  onSelect,
  isLoading = false,
  isSaving = false,
}) => {
  const resolvedTotal = typeof totalMl === 'number' ? totalMl : glasses * glassSize;
  const disabled = isLoading || isSaving;

  const handleGlassClick = (index) => {
    if (disabled || !onSelect) return;
    if (index < glasses) {
      onSelect(index);
    } else if (index === glasses) {
      onSelect(index + 1);
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg p-5 border border-gray-200 relative">
      {(isLoading || isSaving) && (
        <div className="absolute inset-0 bg-white/70 flex items-center justify-center rounded-2xl z-10">
          <div className="flex items-center gap-2 text-gray-600">
            <Loader2 className="w-5 h-5 animate-spin" />
            <span className="font-medium">{isLoading ? 'Loading water data…' : 'Saving…'}</span>
          </div>
        </div>
      )}

      <div className="mb-4">
        <div className="flex items-center gap-2 mb-3">
          <Droplets size={20} className="text-blue-600" />
          <h3 className="text-lg font-bold text-gray-800">Water</h3>
        </div>
        <div className="text-2xl font-bold text-blue-600 mb-1">{resolvedTotal} ml</div>
        <p className="text-xs text-gray-500">
          {glassSize} ml per glass - {glasses} of {MAX_GLASSES} glasses
        </p>
      </div>

      <div className="mb-4">
        <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-400 to-blue-600 transition-all duration-500"
            style={{ width: `${Math.min((glasses / MAX_GLASSES) * 100, 100)}%` }}
          />
        </div>
      </div>

      <div className="mb-5">
        <div className="flex items-center justify-center gap-1.5">
          {Array.from({ length: MAX_GLASSES }).map((_, index) => (
            <button
              key={index}
              onClick={() => handleGlassClick(index)}
              disabled={disabled}
              className={`relative transition-transform w-8 ${
                disabled ? 'cursor-not-allowed' : 'hover:scale-110 active:scale-95'
              }`}
              title={`Glass ${index + 1}`}
              type="button"
            >
              <svg viewBox="0 0 32 42" className="w-full h-auto drop-shadow-sm">
                <path
                  d="M8 4 L6 36 Q6 38 9 38 L23 38 Q26 38 26 36 L24 4 Q24 2 20 2 L12 2 Q8 2 8 4 Z"
                  fill={index < glasses ? '#3B82F6' : 'white'}
                  stroke={index < glasses ? '#2563EB' : '#D1D5DB'}
                  strokeWidth="1.5"
                  className="transition-all duration-300"
                />
                {index < glasses && (
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
                    <ellipse cx="14" cy="12" rx="2.5" ry="5" fill="white" opacity="0.35" />
                  </>
                )}
              </svg>
            </button>
          ))}
        </div>
        <p className="text-xs text-gray-400 text-center mt-2">Tap a glass to fill or empty it</p>
      </div>

      <div className="space-y-2">
        <button
          onClick={onAdd}
          disabled={disabled}
          className="w-full py-2.5 px-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700 transition-all flex items-center justify-center gap-2 text-sm shadow-sm hover:shadow-md disabled:opacity-60"
          type="button"
        >
          <Plus size={16} />
          Add Glass
        </button>

        <button
          onClick={onRemove}
          disabled={disabled || glasses === 0}
          className={`w-full py-2.5 px-3 rounded-lg font-medium transition-all flex items-center justify-center gap-2 text-sm ${
            glasses === 0
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          } disabled:opacity-60`}
          type="button"
        >
          <Minus size={16} />
          Remove
        </button>
      </div>
    </div>
  );
};

export default WaterTracker;
