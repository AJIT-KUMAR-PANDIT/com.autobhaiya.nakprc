import React from "react";

export default function Profile() {
  const stats = [
    { value: "5", label: "Years Exp." },
    { value: "1.2k", label: "Total Rides" },
    { value: "98%", label: "Acceptance" },
  ];

  const ratings = [
    { stars: 5, percentage: 80 },
    { stars: 4, percentage: 15 },
    { stars: 3, percentage: 3 },
    { stars: 2, percentage: 1 },
    { stars: 1, percentage: 1 },
  ];

  const safetyFeatures = [
    { icon: "💉", label: "Vaccinated" },
    { icon: "💵", label: "UPI/Cash" },
    { icon: "🗣️", label: "English Speaking" },
    { icon: "😷", label: "Mask On" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 px-4 py-4 flex items-center border-b border-gray-200 dark:border-gray-700">
        <button className="mr-4 text-2xl text-gray-900 dark:text-white">
          ←
        </button>
        <h1 className="text-xl font-bold text-gray-900 dark:text-white">
          Driver Profile
        </h1>
      </div>

      {/* Profile Section */}
      <div className="bg-white dark:bg-gray-800 px-6 py-8 text-center">
        {/* Profile Image with Ring */}
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 rounded-full bg-gradient-to-br from-green-400 via-green-400 to-yellow-400 p-1">
            <div className="w-full h-full bg-white dark:bg-gray-800 rounded-full" />
          </div>
          <div className="relative w-36 h-36 rounded-full bg-gradient-to-br from-green-400 via-green-400 to-yellow-400 p-1">
            <div className="w-full h-full rounded-full bg-amber-50 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
              <span className="text-6xl">🛺</span>
            </div>
          </div>
          {/* Online Indicator */}
          <div className="absolute bottom-2 right-2 w-6 h-6 bg-green-400 rounded-full border-4 border-white dark:border-gray-800" />
        </div>

        {/* Driver Name */}
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
          Bablu Bhaiya
        </h2>

        {/* Verified Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-50 dark:bg-green-900/20 mb-3">
          <span className="text-green-600 dark:text-green-400">✓</span>
          <span className="text-sm font-semibold text-green-600 dark:text-green-400">
            Verified Driver
          </span>
        </div>

        {/* Location */}
        <div className="flex items-center justify-center gap-2 text-gray-600 dark:text-gray-400 mb-4">
          <span>📍</span>
          <span className="text-base">Mumbai, Maharashtra</span>
        </div>

        {/* License Plate */}
        <div className="inline-block">
          <div className="bg-yellow-400 border-4 border-black rounded-lg px-6 py-3">
            <span className="text-xl font-bold text-black tracking-wider">
              MH 02 CR 5544
            </span>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid grid-cols-3 gap-3 px-4 py-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 text-center shadow-sm"
          >
            <div className="text-3xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              {stat.label}
            </div>
          </div>
        ))}
      </div>

      {/* Ratings & Reviews */}
      <div className="bg-white dark:bg-gray-800 mx-4 rounded-3xl p-6 mb-4 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">
            Ratings & Reviews
          </h3>
          <button className="text-green-500 font-semibold text-sm">
            See All
          </button>
        </div>

        <div className="flex gap-8">
          {/* Average Rating */}
          <div className="text-center">
            <div className="text-6xl font-bold text-gray-900 dark:text-white mb-2">
              4.9
            </div>
            <div className="flex gap-1 mb-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span key={star} className="text-green-400 text-xl">
                  {star === 5 ? "☆" : "★"}
                </span>
              ))}
            </div>
            <div className="text-sm text-gray-600 dark:text-gray-400">
              1,243 ratings
            </div>
          </div>

          {/* Rating Distribution */}
          <div className="flex-1 space-y-2">
            {ratings.map((rating) => (
              <div key={rating.stars} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 dark:text-gray-400 w-3">
                  {rating.stars}
                </span>
                <div className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-400 rounded-full transition-all"
                    style={{ width: `${rating.percentage}%` }}
                  />
                </div>
                <span className="text-sm text-gray-600 dark:text-gray-400 w-10 text-right">
                  {rating.percentage}%
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Safety & Trust */}
      <div className="bg-white dark:bg-gray-800 mx-4 rounded-3xl p-6 mb-24 shadow-sm">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Safety & Trust
        </h3>
        <div className="grid grid-cols-2 gap-3">
          {safetyFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700"
            >
              <span className="text-2xl">{feature.icon}</span>
              <span className="text-base font-medium text-gray-900 dark:text-white">
                {feature.label}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Action Buttons */}
      <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 px-4 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-3 max-w-2xl mx-auto">
          <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full border-2 border-gray-900 dark:border-white bg-white dark:bg-gray-800 text-gray-900 dark:text-white font-bold text-lg active:scale-95 transition-transform">
            <span className="text-xl">💬</span>
            <span>Message</span>
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-full bg-green-400 hover:bg-green-500 text-black font-bold text-lg active:scale-95 transition-transform shadow-lg">
            <span className="text-xl">📞</span>
            <span>Call Driver</span>
          </button>
        </div>
      </div>
    </div>
  );
}
