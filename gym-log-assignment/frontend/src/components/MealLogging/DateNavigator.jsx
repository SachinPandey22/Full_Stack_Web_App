import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, X } from 'lucide-react';
import Calendar from 'react-calendar';
import { format, addDays, subDays, isSameDay } from 'date-fns';
import 'react-calendar/dist/Calendar.css';

const DateNavigator = ({ 
  currentDate, 
  onDateChange, 
  className = '' 
}) => {
  const [showCalendarPopup, setShowCalendarPopup] = useState(false);

  const goToPreviousDay = () => {
    onDateChange(subDays(currentDate, 1));
  };

  const goToNextDay = () => {
    onDateChange(addDays(currentDate, 1));
  };

  const goToToday = () => {
    onDateChange(new Date());
  };

  const handleCalendarSelect = (date) => {
    onDateChange(date);
    setShowCalendarPopup(false);
  };

  const formatDisplayDate = (date) => {
    const today = new Date();
    const yesterday = subDays(today, 1);
    const tomorrow = addDays(today, 1);

    if (isSameDay(date, today)) {
      return 'Today';
    } else if (isSameDay(date, yesterday)) {
      return 'Yesterday';
    } else if (isSameDay(date, tomorrow)) {
      return 'Tomorrow';
    } else {
      return format(date, 'EEEE, MMMM d, yyyy');
    }
  };

  return (
    <>
      <div className={`flex items-center justify-between ${className}`}>
        {/* Navigation buttons and date */}
        <div className="flex items-center gap-4">
          <div className="flex items-center bg-white rounded-xl shadow-md border border-gray-200">
            <button
              onClick={goToPreviousDay}
              className="p-3 hover:bg-gray-50 rounded-l-xl transition-colors group"
              aria-label="Previous day"
            >
              <ChevronLeft size={20} className="text-gray-600 group-hover:text-gray-800" />
            </button>
            
            <button
              onClick={() => setShowCalendarPopup(true)}
              className="px-4 py-3 hover:bg-gray-50 transition-colors flex items-center gap-2 min-w-0"
            >
              <CalendarIcon size={18} className="text-gray-600 flex-shrink-0" />
              <span className="font-semibold text-gray-800 truncate">
                {formatDisplayDate(currentDate)}
              </span>
            </button>
            
            <button
              onClick={goToNextDay}
              className="p-3 hover:bg-gray-50 rounded-r-xl transition-colors group"
              aria-label="Next day"
            >
              <ChevronRight size={20} className="text-gray-600 group-hover:text-gray-800" />
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Popup Modal */}
      {showCalendarPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fade-in">
            <button
              onClick={() => setShowCalendarPopup(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Select Date</h2>
            
            <div className="calendar-container">
              <Calendar
                onChange={handleCalendarSelect}
                value={currentDate}
                className="mx-auto border-none"
                tileClassName={({ date }) => {
                  const isToday = isSameDay(date, new Date());
                  const isSelected = isSameDay(date, currentDate);
                  
                  let classes = 'hover:bg-blue-50 transition-colors';
                  
                  if (isSelected) {
                    classes += ' bg-blue-600 text-white hover:bg-blue-700';
                  } else if (isToday) {
                    classes += ' bg-blue-100 text-blue-700';
                  }
                  
                  return classes;
                }}
              />
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={goToToday}
                className="flex-1 bg-gray-100 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-200 transition-colors"
              >
                Today
              </button>
              <button
                onClick={() => setShowCalendarPopup(false)}
                className="flex-1 bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Custom Calendar Styles */}
      <style>{`
        .react-calendar {
          background: transparent;
          border: none;
          font-family: inherit;
        }
        
        .react-calendar__navigation {
          margin-bottom: 1rem;
        }
        
        .react-calendar__navigation button {
          background: #f3f4f6;
          border: none;
          color: #374151;
          font-weight: 600;
          padding: 0.75rem;
          border-radius: 0.75rem;
          transition: all 0.2s;
        }
        
        .react-calendar__navigation button:hover {
          background: #e5e7eb;
        }
        
        .react-calendar__month-view__weekdays {
          text-align: center;
          font-weight: 600;
          color: #6b7280;
          font-size: 0.875rem;
        }
        
        .react-calendar__tile {
          background: transparent;
          border: none;
          padding: 0.75rem 0.5rem;
          border-radius: 0.5rem;
          font-weight: 500;
          transition: all 0.2s;
        }
        
        .react-calendar__tile:hover {
          background: #dbeafe !important;
        }
        
        .react-calendar__tile--active {
          background: #2563eb !important;
          color: white !important;
        }
        
        .react-calendar__tile--now {
          background: #dbeafe;
          color: #1d4ed8;
        }
        
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
        
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
      `}</style>
    </>
  );
};

export default DateNavigator;