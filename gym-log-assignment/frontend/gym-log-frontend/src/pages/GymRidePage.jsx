import React from "react";

export default function GymRidePage() {
  return (
    <div className="relative min-h-screen">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="/gym-background.jpg" // <- Place your gym image in /public folder
          alt="Gym background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50" /> {/* Dark overlay */}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center py-12">
        {/* Navbar */}
        <nav className="w-full flex justify-between items-center px-8 py-4 bg-black/70 text-white rounded-b-2xl shadow-lg">
          <h1 className="text-xl font-bold">Fitness Tracker</h1>
          <div className="flex space-x-6">
            <button className="hover:underline">Login</button>
            <button className="hover:underline">Library</button>
            <button className="hover:underline">About</button>
          </div>
        </nav>

        {/* Ride Request Card */}
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-lg mt-12">
          <h2 className="text-2xl font-bold mb-6">Request a Session</h2>

          {/* Input Fields */}
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Enter Pickup Location"
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Enter Dropoff Location"
              className="w-full border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex space-x-4">
              <input
                type="date"
                className="flex-1 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <input
                type="time"
                className="flex-1 border rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Button */}
          <button className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white rounded-xl p-3 font-semibold shadow-lg">
            See Prices
          </button>
        </div>
      </div>
    </div>
  );
}
