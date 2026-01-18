import React, { useState, useEffect } from "react";
import csvUrl from "../../assets/data.autobhaiya.nakprc.csv?url";

export default function Search({
  onSelectRide,
  onSearchStateChange,
  overrideQuery,
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [schoolRides, setSchoolRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);

  useEffect(() => {
    if (overrideQuery !== undefined && overrideQuery !== null) {
      setSearchQuery(overrideQuery);
    }
  }, [overrideQuery]);

  // Notify parent about search state (active or not)
  useEffect(() => {
    if (onSearchStateChange) {
      onSearchStateChange(searchQuery.length > 0);
    }
  }, [searchQuery, onSearchStateChange]);

  // Fetch Drivers Data
  useEffect(() => {
    fetch(csvUrl)
      .then((response) => response.text())
      .then((text) => {
        const rows = text.split("\n").slice(1); // Skip header
        const parseLine = (line) => {
          const result = [];
          let start = 0;
          let inQuotes = false;
          for (let i = 0; i < line.length; i++) {
            if (line[i] === '"') {
              inQuotes = !inQuotes;
            } else if (line[i] === "," && !inQuotes) {
              result.push(line.substring(start, i));
              start = i + 1;
            }
          }
          result.push(line.substring(start));
          return result;
        };

        const parsedData = rows
          .map((row) => {
            if (!row.trim()) return null;
            const cols = parseLine(row);
            if (cols.length < 8) return null;
            return {
              id: cols[0],
              autoNumber: cols[1],
              driverName: cols[2]?.replace(/"/g, "").trim(), // Remove quotes
              vehicleType: cols[3],
              status: cols[4],
              serviceDate: cols[5],
              schoolName: cols[6]?.trim(),
              mapsUrl: cols[7]?.trim(),
            };
          })
          .filter((item) => item !== null);
        setSchoolRides(parsedData);
      })
      .catch((err) => console.error("Error loading CSV:", err));
  }, []);

  // Filter Logic
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredRides([]);
    } else {
      const lowerQuery = searchQuery.toLowerCase();
      const filtered = schoolRides.filter(
        (ride) =>
          ride.schoolName?.toLowerCase().includes(lowerQuery) ||
          ride.autoNumber?.toLowerCase().includes(lowerQuery) ||
          ride.driverName?.toLowerCase().includes(lowerQuery)
      );
      setFilteredRides(filtered);
    }
  }, [searchQuery, schoolRides]);

  return (
    <>
      {/* Search Results Overlay/Section */}
      {searchQuery && (
        <div className="fixed inset-0 top-0 z-40 bg-white/95 backdrop-blur-sm overflow-y-auto pt-4 pb-32 px-6">
          <div className="max-w-md mx-auto mt-12">
            {" "}
            {/* Added top margin to not be hidden by header if z-index issues */}
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-gray-900">
                Search Results
              </h3>
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-gray-500 font-medium"
              >
                Close
              </button>
            </div>
            <div className="space-y-4">
              {filteredRides.length > 0 ? (
                filteredRides.map((ride, idx) => (
                  <div
                    key={idx}
                    className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm relative overflow-hidden group"
                  >
                    <div className="absolute top-0 right-0 p-3">
                      <div className="bg-emerald-50 text-emerald-600 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-emerald-100 flex items-center gap-1">
                        <span className="material-symbols-outlined text-[14px]">
                          shield_person
                        </span>
                        Verified Guardian
                      </div>
                    </div>
                    <div className="flex items-start gap-4">
                      <div className="relative shrink-0">
                        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl border-2 border-white shadow-sm">
                          {/* Use mock avatar or generic for now since CSV has no img */}
                          👨‍✈️
                        </div>
                        <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                          <div className="bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                            4.9{" "}
                            <span className="material-symbols-outlined text-[10px]">
                              star
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="flex-1 pt-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {ride.driverName}
                        </h3>
                        <p className="text-xs text-gray-500 font-medium">
                          {ride.vehicleType || "Auto Bhaiya"} • 5 Years Exp.
                        </p>
                        <div className="flex items-center gap-3 mt-3">
                          <div className="bg-white border-2 border-gray-200 rounded px-2 py-1 shadow-sm flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                            <span className="font-mono text-xs font-bold text-emerald-600 tracking-wider">
                              {ride.autoNumber}
                            </span>
                          </div>
                          <span className="text-xs font-medium text-gray-400">
                            |
                          </span>
                          <span className="text-xs font-semibold text-gray-700">
                            500+ Trips
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="mt-5 flex gap-3">
                      <button
                        onClick={() => {
                          onSelectRide(ride);
                        }}
                        className="flex-1 bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3.5 rounded-full text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                      >
                        Book for School
                      </button>
                      <button className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition-colors">
                        <span className="material-symbols-outlined">chat</span>
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p>No rides found matching "{searchQuery}"</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Fixed Bottom Search Bar */}
      <div className="fixed bottom-14 left-0 w-full p-4 bg-white/80 backdrop-blur-lg border-t border-gray-200 z-50 pb-8">
        <div className="relative max-w-md mx-auto">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search driver, school or auto number..."
            className="w-full bg-gray-100 border-none rounded-full px-5 py-3.5 pr-12 outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-800 shadow-sm font-medium"
          />
          <button className="absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 bg-emerald-500 rounded-full flex items-center justify-center text-white text-sm shadow-md hover:bg-emerald-600 transition-colors">
            🔍
          </button>
        </div>
      </div>
    </>
  );
}
