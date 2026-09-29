import React, { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Search, ArrowLeft, X, Filter, Sparkles, MapPin } from "lucide-react";
import AutoCard from "../components/Shared/AutoCard.jsx";
import { searchAutos, getAutos } from "../data/autos.js";

const FILTER_TAGS = [
  "All",
  "Available Now",
  "Sakchi",
  "Bistupur",
  "Kadma",
  "Sonari",
  "Telco",
  "CNG Auto",
  "Electric Auto"
];

export default function SearchResultsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const query = searchParams.get("q") || "";
  const goAnywhere = searchParams.get("go-anywhere") || "";
  const initialSearch = query || goAnywhere;

  const [searchTerm, setSearchTerm] = useState(initialSearch);
  const [selectedTag, setSelectedTag] = useState("All");

  useEffect(() => {
    setSearchTerm(initialSearch);
  }, [initialSearch]);

  const allAutos = useMemo(() => getAutos(), []);

  // Filter autos based on searchTerm and selectedTag
  const filteredAutos = useMemo(() => {
    let list = searchTerm ? searchAutos(searchTerm) : allAutos;

    if (selectedTag === "Available Now") {
      list = list.filter((a) => a.available);
    } else if (selectedTag === "CNG Auto") {
      list = list.filter((a) => a.vehicleType.toLowerCase().includes("cng"));
    } else if (selectedTag === "Electric Auto") {
      list = list.filter((a) => a.vehicleType.toLowerCase().includes("electric"));
    } else if (selectedTag !== "All") {
      list = list.filter(
        (a) =>
          a.area.toLowerCase() === selectedTag.toLowerCase() ||
          a.destinationHints.some((d) => d.toLowerCase() === selectedTag.toLowerCase())
      );
    }

    return list;
  }, [searchTerm, selectedTag, allAutos]);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (searchTerm.trim()) {
      setSearchParams({ q: searchTerm.trim() });
    } else {
      setSearchParams({});
    }
  };

  const clearSearch = () => {
    setSearchTerm("");
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Top Search Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 py-3 shadow-2xs">
        <div className="max-w-md mx-auto space-y-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate(-1)}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-700"
              aria-label="Back"
            >
              <ArrowLeft size={20} />
            </button>

            <form onSubmit={handleSearchSubmit} className="flex-1 relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search Auto number, driver, area..."
                className="w-full bg-gray-100/90 border border-gray-200/80 rounded-full pl-10 pr-9 py-2.5 text-xs font-semibold text-gray-900 placeholder:text-gray-400 focus:bg-white focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
                autoFocus
              />
              <Search
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={clearSearch}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 p-0.5"
                >
                  <X size={14} />
                </button>
              )}
            </form>
          </div>

          {/* Quick Filter Tags */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4">
            {FILTER_TAGS.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                className={`text-[11px] font-bold px-3 py-1 rounded-full whitespace-nowrap transition-colors ${
                  selectedTag === tag
                    ? "bg-gray-900 text-white shadow-xs"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tag}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="max-w-md mx-auto px-4 pt-4">
        {/* Search Query Pill / Results Count */}
        <div className="flex items-center justify-between mb-3 text-xs">
          <div className="text-gray-500 font-medium">
            {searchTerm ? (
              <span>
                Results for <strong className="text-gray-900">"{searchTerm}"</strong>
              </span>
            ) : (
              <span>
                Showing <strong className="text-gray-900">{filteredAutos.length}</strong> available autos
              </span>
            )}
          </div>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
            {filteredAutos.length} Found
          </span>
        </div>

        {/* Auto Cards List */}
        {filteredAutos.length > 0 ? (
          <div className="space-y-3">
            {filteredAutos.map((auto) => (
              <AutoCard key={auto.id} auto={auto} />
            ))}
          </div>
        ) : (
          /* Empty State (Section 39) */
          <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-xs mt-4">
            <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🛺
            </div>
            <h3 className="text-base font-extrabold text-gray-900 mb-1">
              No Auto Bhaiya found
            </h3>
            <p className="text-xs text-gray-500 max-w-xs mx-auto mb-5 leading-relaxed">
              We couldn't find any registered auto matching "{searchTerm}".
            </p>

            <div className="bg-gray-50 rounded-2xl p-4 text-left border border-gray-100 max-w-xs mx-auto mb-5 text-xs text-gray-600 space-y-1.5">
              <span className="font-bold text-gray-900 block mb-1">Try searching by:</span>
              <p className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Auto number: <code className="bg-white px-1.5 py-0.5 rounded border border-gray-200 text-gray-800 font-mono text-[11px]">AB-101</code></span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Driver name: <span className="font-semibold text-gray-800">Ashok, Rajesh</span></span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Vehicle plate: <span className="font-semibold text-gray-800">JH05</span></span>
              </p>
              <p className="flex items-center gap-1.5">
                <span className="text-emerald-600 font-bold">•</span>
                <span>Area or Hub: <span className="font-semibold text-gray-800">Sakchi, Bistupur, Kadma</span></span>
              </p>
            </div>

            <button
              onClick={clearSearch}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-6 rounded-full text-xs transition-colors shadow-xs"
            >
              Clear Search & Show All
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
