import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import csvUrl from "../assets/data.autobhaiya.nakprc.csv?url";
import { ShieldCheck, Star, MapPin, MessageCircle } from "lucide-react";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("q") || "";
  const goAnywhere = searchParams.get("go-anywhere") || "";
  const isGoAnywhere = !!goAnywhere;
  const navigate = useNavigate();

  const [schoolRides, setSchoolRides] = useState([]);
  const [filteredRides, setFilteredRides] = useState([]);
  const [searchTerm, setSearchTerm] = useState(query);

  useEffect(() => {
    setSearchTerm(query);
  }, [query]);

  // Fetch Drivers Data
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
      })
      .catch((err) => console.error("Error loading CSV:", err));
  }, []);

  // Filter Logic
  useEffect(() => {
    if (isGoAnywhere) {
      setFilteredRides(schoolRides);
    } else if (searchTerm.trim() === "") {
      setFilteredRides([]);
    } else {
      const lowerQuery = searchTerm.toLowerCase();
      const filtered = schoolRides.filter(
        (ride) =>
          ride.schoolName?.toLowerCase().includes(lowerQuery) ||
          ride.autoNumber?.toLowerCase().includes(lowerQuery) ||
          ride.driverName?.toLowerCase().includes(lowerQuery)
      );
      setFilteredRides(filtered);
    }
  }, [searchTerm, schoolRides, isGoAnywhere]);

  const handleSearch = (e) => {
    e.preventDefault();
    navigate(`/search?q=${searchTerm}`);
  };

  const openChat = () => {
    navigate("/chat?message=Hi, I found you on search. I need a trip from my location.");
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header with Search Bar */}
      <div className="sticky top-0 z-50 bg-white shadow-sm px-6 py-4">
        <div className="flex items-center gap-3 mb-2">
          <button onClick={() => navigate(-1)} className="text-2xl">
            ←
          </button>
          <h1 className="text-lg font-bold">
            {isGoAnywhere ? "Nearby Bhaiyas for Your Trip" : "Search Results"}
          </h1>
        </div>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search driver, school or auto number..."
            className="w-full bg-gray-100 border-none rounded-full px-5 py-3 pr-12 outline-none focus:ring-2 focus:ring-emerald-500/50 text-gray-800 shadow-inner font-medium"
            autoFocus
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs shadow-md"
          >
            🔍
          </button>
        </form>
      </div>

      {/* Results List */}
      <div className="px-6 py-4 space-y-4">
        {isGoAnywhere && (
          <div className="flex items-center gap-2 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-700/30 rounded-full px-4 py-2.5">
            <MapPin size={16} className="text-yellow-600 dark:text-yellow-400" />
            <span className="text-sm font-semibold text-yellow-700 dark:text-yellow-300 truncate">
              Going to: {goAnywhere}
            </span>
            <button
              onClick={() => navigate("/")}
              className="ml-auto text-xs font-bold text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 shrink-0"
            >
              Clear
            </button>
          </div>
        )}
        {searchTerm && !isGoAnywhere && (
          <p className="text-sm text-gray-500 font-medium">
            Showing results for "{searchTerm}"
          </p>
        )}

        {filteredRides.length > 0 ? (
          filteredRides.map((ride, idx) => (
            <div
              key={idx}
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-3">
                <div className="bg-emerald-50 text-emerald-600 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-emerald-100 flex items-center gap-1">
                  <ShieldCheck size={14} className="text-emerald-600" />
                  Verified Guardian
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center text-3xl border-2 border-white shadow-sm">
                    👨‍✈️
                  </div>
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-0.5 shadow-sm">
                    <div className="bg-yellow-400 text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      4.9 <Star size={10} fill="currentColor" strokeWidth={0} />
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
                    <span className="text-xs font-medium text-gray-400">|</span>
                    <span className="text-xs font-semibold text-gray-700">
                      500+ Trips
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => navigate(`/auto-bhaiya/${ride.autoNumber}`)}
                  className={`flex-1 ${isGoAnywhere ? "bg-yellow-400 hover:bg-yellow-500 text-gray-900" : "bg-yellow-400 hover:bg-yellow-500 text-gray-900"} font-bold py-3.5 rounded-full text-sm transition-colors shadow-sm flex items-center justify-center gap-2`}
                >
                  {isGoAnywhere ? "Book Trip" : "Book for School"}
                </button>
                <button
                  onClick={openChat}
                  className="w-12 h-12 rounded-full border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 hover:text-emerald-600 transition-colors"
                >
                  <MessageCircle size={20} />
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 text-gray-500 flex flex-col items-center gap-3">
            <span className="text-4xl">{isGoAnywhere ? "📍" : "🤔"}</span>
            <p className="font-medium">
              {isGoAnywhere
                ? "We found verified drivers nearby. Try selecting one below!"
                : `No rides found matching "${searchTerm}"`}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
