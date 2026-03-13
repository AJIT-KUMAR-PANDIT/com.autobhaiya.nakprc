import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import csvUrl from "../../assets/data.autobhaiya.nakprc.csv?url";
import Search from "../Shared/Search";
import {
  ShieldCheck,
  Star,
  Car,
  Clock,
  MessageCircle,
  Check,
  ArrowLeft,
  ArrowRight,
  Scan,
} from "lucide-react";

export default function PersonalBhaiya() {
  const { vNumber } = useParams();
  const navigate = useNavigate();

  const [plateNumber, setPlateNumber] = useState(vNumber || "DL 1C 5678");
  const [isValid, setIsValid] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [searchQuery, setSearchQuery] = useState(undefined); // Used for override
  const [schoolRides, setSchoolRides] = useState([]);
  const [schoolList, setSchoolList] = useState([]);

  useEffect(() => {
    if (vNumber) {
      setPlateNumber(vNumber);
      localStorage.setItem("currentVNumber", vNumber);
    }
  }, [vNumber]);

  // Fetch Drivers and Extract Schools
  useEffect(() => {
    fetch(csvUrl)
      .then((response) => response.text())
      .then((text) => {
        const rows = text.split("\n").slice(1);
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
              driverName: cols[2]?.replace(/"/g, "").trim(),
              vehicleType: cols[3],
              status: cols[4],
              serviceDate: cols[5],
              schoolName: cols[6]?.trim(),
              mapsUrl: cols[7]?.trim(),
              whatsappNumber: cols[8]?.replace(/"/g, "").trim(),
            };
          })
          .filter((item) => item !== null);

        setSchoolRides(parsedData);

        // Extract Schools Logic (Consistent with Landing.jsx)
        const uniqueSchoolNames = [
          ...new Set(parsedData.map((d) => d.schoolName).filter(Boolean)),
        ];
        const colors = [
          "bg-red-50 text-red-600 border-red-200",
          "bg-blue-50 text-blue-600 border-blue-200",
          "bg-green-50 text-green-600 border-green-200",
          "bg-orange-50 text-orange-600 border-orange-200",
          "bg-purple-50 text-purple-600 border-purple-200",
        ];

        const formattedSchools = uniqueSchoolNames.map((name, index) => ({
          name: name,
          avatar: name.charAt(0).toUpperCase(),
          style: colors[index % colors.length],
        }));

        setSchoolList(formattedSchools);
      })
      .catch((err) => console.error("Error loading CSV:", err));
  }, []);

  const defaultDriver = {
    name: "Rajesh Kumar",
    rating: 4.9,
    rides: "1,240+",
    vehicle: "Bajaj RE (CNG)",
    arrivalTime: "3 mins",
    languages: "Hindi, English",
    avatar: "👨‍🦱",
    mapsUrl:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3502.9360824907153!2d77.218408074747!3d28.601693075681647!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390ce2db961be393%3A0xf6c24c15321cf584!2sIndia%20Gate!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin",
    whatsappNumber: "+919999999999",
  };

  const selectedDriver = schoolRides.find((r) => r.autoNumber === plateNumber);

  const driver = selectedDriver
    ? {
        name: selectedDriver.driverName,
        rating: 4.8, // Mock data as CSV lacks rating
        rides: "500+", // Mock data
        vehicle: selectedDriver.vehicleType,
        arrivalTime: "5 mins",
        languages: "Hindi",
        avatar: "👮", // Different avatar for found driver
        mapsUrl: selectedDriver.mapsUrl,
        whatsappNumber: selectedDriver.whatsappNumber || "+919999999999",
      }
    : defaultDriver;

  const handlePlateChange = (e) => {
    const value = e.target.value.toUpperCase();
    setPlateNumber(value);
  };

  const handleVerify = () => {
    setIsValid(plateNumber.length > 0);
  };

  const handleSelectRide = (ride) => {
    setPlateNumber(ride.autoNumber);
    navigate(`/auto-bhaiya/${ride.autoNumber}`);
  };

  // Save to history when a driver is found
  useEffect(() => {
    if (selectedDriver) {
      try {
        const historyJson = localStorage.getItem("searchHistory");
        let history = historyJson ? JSON.parse(historyJson) : [];
        
        // Remove if exists to push to top
        history = history.filter(d => d.autoNumber !== selectedDriver.autoNumber);
        
        // Add to top of history
        history.unshift({
          name: selectedDriver.driverName,
          autoNumber: selectedDriver.autoNumber,
          vehicleType: selectedDriver.vehicleType,
          rating: 4.8, // Mock as it's static for now
          timestamp: new Date().toISOString()
        });
        
        // Keep only last 20
        history = history.slice(0, 20);
        
        localStorage.setItem("searchHistory", JSON.stringify(history));
      } catch (e) {
        console.error("Could not save history", e);
      }
    }
  }, [selectedDriver]);

  const handleSchoolClick = (schoolName) => {
    setSearchQuery(schoolName);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* ... (Header, Hero, Input, Search Results, Driver Card Sections remain same) */}
      <div className="max-w-md mx-auto min-h-screen bg-white shadow-2xl relative flex flex-col">
        {/* Header */}
        <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100">
          <div className="flex items-center justify-between p-4">
            <button
              onClick={() => navigate("/")}
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
            <h2 className="text-lg font-bold">Book My Bhaiya</h2>
            <div className="w-10" />
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto pb-32">
          {/* Hero Section */}
          <div className="px-6 pt-8 pb-6">
            <h1 className="text-3xl font-extrabold tracking-tight mb-2">
              Know your <span className="text-emerald-600">driver?</span>
            </h1>
            <p className="text-gray-500 text-base font-medium">
              Enter the auto number below to book directly.
            </p>
          </div>

          {/* License Plate Input */}
          <div className="px-6 py-2">
            <div className="relative group">
              {/* Glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-200" />

              <div className="relative flex items-center bg-white border-2 border-gray-200 rounded-xl overflow-hidden shadow-sm focus-within:border-yellow-400 focus-within:ring-2 focus-within:ring-yellow-400/20 transition-all h-20">
                {/* IND Badge */}
                <div className="h-full w-12 bg-blue-600 flex flex-col items-center justify-center gap-1 border-r border-gray-200">
                  <div className="w-6 h-6 rounded-full border border-white/50 flex items-center justify-center">
                    <span className="text-[8px] font-bold text-white">IND</span>
                  </div>
                  <div className="w-1 h-1 bg-white/50 rounded-full" />
                </div>

                {/* Input */}
                <input
                  type="text"
                  value={plateNumber}
                  onChange={handlePlateChange}
                  placeholder="DL 1R 1234"
                  className="w-full bg-transparent border-none focus:ring-0 text-center text-2xl font-bold uppercase placeholder:text-gray-300 text-gray-900 tracking-widest h-full outline-none"
                />

                {/* Verify Button */}
                <div className="pr-4">
                  <button
                    onClick={handleVerify}
                    className="bg-gray-900 text-white rounded-full p-2 hover:bg-gray-800 transition-colors flex items-center justify-center"
                  >
                    <Check size={20} />
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-between items-center mt-3 px-1">
              {isValid && (
                <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-600" /> Valid
                  Registration
                </span>
              )}
              <button className="text-sm font-bold text-gray-500 hover:text-emerald-600 transition-colors ml-auto flex items-center gap-1">
                <Scan size={14} /> Scan Plate
              </button>
            </div>
          </div>

          {/* Driver Card & Map (Hidden if searching) */}
          {!isSearching && (
            <div className="px-6 mt-8">
              <div className="rounded-2xl bg-white border border-gray-200 shadow-lg overflow-hidden">
                {/* Yellow accent bar */}
                <div className="h-2 bg-yellow-400" />

                <div className="p-5">
                  <div className="flex items-start gap-4">
                    {/* Avatar */}
                    <div className="relative shrink-0">
                      <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-gray-100 shadow-md bg-gray-100 flex items-center justify-center text-4xl">
                        {driver.avatar}
                      </div>
                      <div className="absolute -bottom-1 -right-1 bg-emerald-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border-2 border-white shadow-sm flex items-center gap-1">
                        {driver.rating}{" "}
                        <Star size={10} fill="currentColor" strokeWidth={0} />
                      </div>
                    </div>

                    {/* Details */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">
                            {driver.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {driver.rides} Rides
                          </p>
                        </div>
                        <ShieldCheck size={24} className="text-emerald-500" />
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <div className="bg-gray-50 px-3 py-1.5 rounded-lg flex items-center gap-2 border border-gray-200">
                          <Car size={16} className="text-yellow-500" />
                          <span className="text-xs font-semibold uppercase tracking-wide text-gray-700">
                            {driver.vehicle}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Map Display */}
                {driver.mapsUrl && (
                  <div className="w-full h-40 bg-gray-100 border-t border-gray-100">
                    <iframe
                      src={driver.mapsUrl}
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Driver Location"
                    ></iframe>
                  </div>
                )}

                {/* Footer */}
                <div className="bg-gray-50 px-5 py-3 border-t border-gray-100 flex justify-between items-center text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={14} /> Arrives in {driver.arrivalTime}
                  </span>
                  <span className="flex items-center gap-1">
                    <MessageCircle size={14} /> Speaks {driver.languages}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Popular Schools Section (Replaces Favorites) */}
          {!isSearching && (
            <div className="px-6 mt-8">
              <div className="flex justify-between items-end mb-4">
                <h3 className="text-lg font-bold text-gray-900">
                  Popular Schools
                </h3>
              </div>

              <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 no-scrollbar">
                {schoolList.map((school, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleSchoolClick(school.name)}
                    className="flex flex-col items-center gap-2 group min-w-[72px]"
                  >
                    <div
                      className={`w-16 h-16 rounded-full p-0.5 border-2 transition-all ${
                        school.style.split(" ")[2]
                      }`}
                    >
                      <div
                        className={`w-full h-full rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold ${school.style}`}
                      >
                        {school.avatar}
                      </div>
                    </div>
                    <span className="text-xs font-medium text-center truncate w-full text-gray-700">
                      {school.name.split(" ")[0]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Bottom CTA & Search Bar logic remains same */}
        </main>

        {/* Bottom CTA - Hidden when searching */}
        {!isSearching && (
          <div className="absolute bottom-0 left-0 w-full p-6 bg-linear-to-t from-white via-white to-transparent pt-12">
            <button 
              onClick={() => {
                const message = encodeURIComponent(`Hi ${driver.name}, I would like to request your auto (Number: ${plateNumber})!`);
                window.open(`https://wa.me/${driver.whatsappNumber}?text=${message}`, "_blank");
              }}
              className="w-full bg-emerald-500 hover:bg-emerald-600 active:scale-[0.98] transition-all h-14 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/30">
              <span className="text-white font-bold text-lg tracking-wide">
                Request This Bhaiya
              </span>
              <ArrowRight size={24} className="text-white" />
            </button>
          </div>
        )}

        {/* Bottom Search Bar (Fixed) */}
        <Search
          overrideQuery={searchQuery}
          onSearchStateChange={setIsSearching}
          onSelectRide={handleSelectRide}
        />
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
