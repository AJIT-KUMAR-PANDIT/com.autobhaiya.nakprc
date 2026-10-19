import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, ArrowLeft, X, Filter, Car, Fuel, Info } from "lucide-react";
import AutoCard from "../components/Shared/AutoCard.jsx";
import { searchAutos, getAutos, CATEGORIES, FUEL_TYPES } from "../data/autos.js";

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";
  const initialCategory = searchParams.get("category") || "all";
  const initialFuel = searchParams.get("fuel") || "all";

  const [searchTerm, setSearchTerm] = useState(query);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedFuel, setSelectedFuel] = useState(initialFuel);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  // Synchronize state with URL params
  const updateUrlParams = (newTerm, newCat, newFuel) => {
    const params = {};
    if (newTerm && newTerm.trim()) params.q = newTerm.trim();
    if (newCat && newCat !== "all") params.category = newCat;
    if (newFuel && newFuel !== "all") params.fuel = newFuel;
    setSearchParams(params);
  };

  // Filter autos based on query and filters
  const filteredAutos = useMemo(() => {
    return searchAutos(searchTerm, {
      category: selectedCategory,
      fuelType: selectedFuel
    });
  }, [searchTerm, selectedCategory, selectedFuel]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    updateUrlParams(searchTerm, selectedCategory, selectedFuel);
  };

  const handleCategorySelect = (cat) => {
    const nextCat = selectedCategory === cat ? "all" : cat;
    setSelectedCategory(nextCat);
    updateUrlParams(searchTerm, nextCat, selectedFuel);
  };

  const handleFuelSelect = (fuel) => {
    const nextFuel = selectedFuel === fuel ? "all" : fuel;
    setSelectedFuel(nextFuel);
    updateUrlParams(searchTerm, selectedCategory, nextFuel);
  };

  const clearAllFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setSelectedFuel("all");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32" data-testid="search-results-page">
      {/* Top Search Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 py-3 shadow-2xs">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-700"
              aria-label="Back"
              data-testid="search-back-btn"
            >
              <ArrowLeft size={20} />
            </button>

            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  updateUrlParams(e.target.value, selectedCategory, selectedFuel);
                }}
                placeholder="Search Auto #, driver, plate, area, fuel..."
                className="w-full bg-gray-100/90 border border-gray-200/80 rounded-full pl-10 pr-9 py-2.5 text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                autoFocus
                data-testid="search-input"
              />
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchTerm("");
                    updateUrlParams("", selectedCategory, selectedFuel);
                  }}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5"
                  data-testid="clear-search-btn"
                >
                  <X size={14} />
                </button>
              )}
            </form>
          </div>

          {/* Filter Row 1: Categories (Passenger / Cargo) */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 text-xs">
            <span className="text-[10px] font-black uppercase text-gray-400 shrink-0 mr-1 flex items-center gap-1">
              <Filter size={10} />
              <span>Type:</span>
            </span>
            <button
              onClick={() => handleCategorySelect("all")}
              className={`text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedCategory === "all"
                  ? "bg-gray-900 text-white shadow-xs"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              data-testid="filter-category-all"
            >
              All Types
            </button>
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                  selectedCategory === cat
                    ? "bg-emerald-700 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                data-testid={`filter-category-${cat.toLowerCase()}`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Filter Row 2: Fuel / Energy Types */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 text-xs">
            <span className="text-[10px] font-black uppercase text-gray-400 shrink-0 mr-1 flex items-center gap-1">
              <Fuel size={10} />
              <span>Fuel:</span>
            </span>
            <button
              onClick={() => handleFuelSelect("all")}
              className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors ${
                selectedFuel === "all"
                  ? "bg-gray-900 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
              data-testid="filter-fuel-all"
            >
              All Fuel
            </button>
            {FUEL_TYPES.map((fuel) => (
              <button
                key={fuel}
                onClick={() => handleFuelSelect(fuel)}
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap transition-colors ${
                  selectedFuel === fuel
                    ? "bg-amber-500 text-gray-950 font-extrabold shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
                data-testid={`filter-fuel-${fuel.toLowerCase()}`}
              >
                {fuel}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-md mx-auto px-4 pt-4">
        {/* Results Header */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="text-gray-500 font-medium">
            {searchTerm ? (
              <span>
                Matching <strong className="text-gray-900">"{searchTerm}"</strong>
              </span>
            ) : (
              <span>Verified directory list</span>
            )}
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2.5 py-0.5 rounded-full">
            {filteredAutos.length} Autos
          </span>
        </div>

        {/* Honest Demo notice */}
        <div className="mb-3.5 p-2.5 bg-gray-100/80 rounded-xl border border-gray-200/60 text-[11px] text-gray-500 flex items-center gap-2">
          <Info size={13} className="shrink-0 text-gray-400" />
          <span>Fares and ETA are pre-calculated route estimates, not live GPS telemetry.</span>
        </div>

        {/* Auto Cards List */}
        {filteredAutos.length > 0 ? (
          <div className="space-y-3">
            {filteredAutos.map((auto) => (
              <AutoCard key={auto.id} auto={auto} />
            ))}
          </div>
        ) : (
          /* Empty State - ZERO EMOJIS */
          <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-xs mt-4">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
              <Car size={30} strokeWidth={2.2} />
            </div>
            <h3 className="text-base font-extrabold text-gray-900 mb-1">
              No Autos Found
            </h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto mb-5 leading-relaxed">
              No registered Auto Bhaiya matched your current search filters.
            </p>

            <button
              onClick={clearAllFilters}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-full text-xs transition-colors shadow-xs"
              data-testid="reset-filters-btn"
            >
              Reset Filters & Show All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
