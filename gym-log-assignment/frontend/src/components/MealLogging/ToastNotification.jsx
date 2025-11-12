import React from 'react';

const ToastNotification = ({ toast }) => {
  return (
    <div className="fixed bottom-6 right-6 bg-gray-900 text-white px-6 py-4 rounded-xl shadow-2xl animate-fade-in flex items-center gap-3 z-50">
      <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
      {toast}
    </div>
  );
};

export default ToastNotification;
