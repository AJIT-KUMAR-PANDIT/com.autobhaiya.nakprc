import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, Star, MessageCircle, ArrowLeft } from "lucide-react";

export default function HistoryPage() {
  const navigate = useNavigate();
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    try {
      const historyJson = localStorage.getItem("searchHistory");
      if (historyJson) {
        setHistoryItems(JSON.parse(historyJson));
      }
    } catch (e) {
      console.error("Could not load history", e);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-white shadow-sm px-6 py-4">
        <div className="flex items-center gap-3">
          <button onClick={() => navigate(-1)} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Recent Bhaiyas</h1>
        </div>
      </div>

      {/* Results List */}
      <div className="px-6 py-6 space-y-4">
        {historyItems.length > 0 ? (
          historyItems.map((ride, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm relative overflow-hidden group cursor-pointer transition-transform hover:scale-[1.01]"
              onClick={() => navigate(`/auto-bhaiya/${ride.autoNumber}`)}
            >
              <div className="absolute top-0 right-0 p-3">
                <div className="bg-emerald-50 text-emerald-600 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-emerald-100 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Verified
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl border-2 border-white shadow-sm">
                    👨‍✈️
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                    <div className="bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      {ride.rating} <Star size={10} fill="currentColor" strokeWidth={0} />
                    </div>
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-gray-900 pr-16 truncate">
                    {ride.name}
                  </h3>
                  <p className="text-xs text-gray-500 font-medium">
                    {ride.vehicleType || "Auto Bhaiya"}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="bg-white border-2 border-gray-200 rounded px-2 py-1 shadow-sm flex items-center gap-1.5">
                      <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                      <span className="font-mono text-xs font-bold text-emerald-600 tracking-wider">
                        {ride.autoNumber}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-3">
            <span className="text-4xl text-gray-300">⏳</span>
            <p>No recent history found.</p>
            <p className="text-xs text-gray-400">Search for a Bhaiya and they will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}
