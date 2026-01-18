import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Search({
  onSearchStateChange,
  overrideQuery, // Still useful if we want to auto-trigger search from popular schools
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (overrideQuery) {
      // If parent wants to trigger search (e.g. Popular Schools click)
      navigate(`/search?q=${overrideQuery}`);
    }
  }, [overrideQuery, navigate]);

  const handleSearch = (e) => {
    // If key is Enter, or if this is called on button click
    if (e.key === "Enter" || e.type === "click") {
      navigate(`/search?q=${searchQuery}`);
      if (onSearchStateChange) onSearchStateChange(true); // Maybe not needed anymore if we navigate away
    }
  };

  return (
    <div className="fixed bottom-14 left-0 w-full p-4 bg-white/80 backdrop-blur-lg border-t border-gray-200 z-50 pb-8">
      <div className="relative max-w-md mx-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={handleSearch}
          placeholder="Search driver, school or auto number..."
          className="w-full bg-gray-100 border-none rounded-full px-5 py-3.5 pr-12 outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-800 shadow-sm font-medium"
        />
        <button
          onClick={handleSearch}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm shadow-md hover:bg-emerald-600 transition-colors"
        >
          🔍
        </button>
      </div>
    </div>
  );
}
