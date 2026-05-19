import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../Shared/Search";
import csvUrl from "../../assets/data.autobhaiya.nakprc.csv?url";
import { ShieldCheck, ArrowRight, Star, MessageCircle, MapPin, Navigation } from "lucide-react";

export default function Landing() {
  const navigate = useNavigate();
  const [randomDrivers, setRandomDrivers] = useState([]);
  const [schools, setSchools] = useState([]);

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
              name: cols[2]?.replace(/"/g, "").trim(),
              details: `${cols[3] || "Auto Bhaiya"} • 5 Years Exp.`,
              plate: cols[1],
              trips: "500+ Trips",
              rating: (4.5 + Math.random() * 0.5).toFixed(1),
              img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAlxeGMP9evKuUvjfJ0dIw7m3RudvH0izf-IbfmaI0DZRRrOSF1lmvlPy8o1z6ZE_VYbGZOx64zgflo6WYhNY0M65w0WwuY-XBAYVV4g9d3JPEVBndCY7pQ4oKiWOjcflW912fXlWECpQ8ToH9-yYg4P8S2HEfOETCFgmnKL51gEw-RPBhyxkzZCt9nUuSVa3E2Qo8_6VlfHcmZhPbx7lrbfyPJr0769uBwKsa_0HKB9nfBHdtJAo8x0AxoeYR60Bq0fyCjkKp4enk",
              badge: { icon: "shield_person", text: "Verified Guardian" },
              autoNumber: cols[1],
              schoolName: cols[6]?.trim(), // Extract school name
            };
          })
          .filter((item) => item !== null);

        // Extract unique schools
        const uniqueSchools = [
          ...new Set(parsedData.map((d) => d.schoolName).filter(Boolean)),
        ];

        // Colors palette
        const colors = [
          "text-neutral-400",
          "text-[#15803d]",
          "text-blue-600",
          "text-red-500",
          "text-orange-500",
          "text-purple-600",
          "text-pink-500",
          "text-teal-600",
        ];

        const formattedSchools = uniqueSchools.map((name, index) => ({
          name: name,
          color: colors[index % colors.length],
          char: name.charAt(0).toUpperCase(),
        }));

        setSchools(formattedSchools);

        const shuffled = parsedData.sort(() => 0.5 - Math.random());
        setRandomDrivers(shuffled.slice(0, 3));
      })
      .catch((err) => console.error("Error loading CSV:", err));
  }, []);

  return (
    <div className="bg-[#f8f8f5] dark:bg-[#222110] font-sans text-neutral-900 dark:text-neutral-100 antialiased overflow-x-hidden pb-24 min-h-screen">
      {/* Hero Slider Section */}
      <section className="mt-4 px-5">
        <div className="relative w-full overflow-hidden rounded-2xl shadow-sm group">
          <div
            className="relative h-[220px] bg-cover bg-center flex flex-col justify-end p-6"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.8) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCkUlMScTPzFLG5PpzUTTYpkrsAwS8cZIrVO8DhtaLQveppEBi8jZuoMWKiDec3szlXYKKhE9wvf0FdYYXVXrWwbmEMZSpfUuRguKYlOCRCxk1LWlOSIy7tKO3K1nMyh3vES68HEdBFhSY2S8bkuwOCLbN-orf9FhyrEdkovCCs4LwcUgxCXf4gVMfQzY3rJV-LVfvrNaYoLcws9acDdfbhTxkEMwezinmHu_ZLxRSbIz5N9e6ga3bLs6INFG_6ysofe7gWbStOW38')",
            }}
          >
            <div className="relative z-10 flex flex-col items-start gap-1">
              <span className="inline-flex items-center gap-1 bg-[#15803d]/90 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                <ShieldCheck size={12} className="text-white" />
                SAFETY FIRST
              </span>
              <h1 className="text-white text-3xl font-black leading-tight tracking-tight mt-1">
                Safe School Rides
              </h1>
              <p className="text-neutral-200 text-sm font-medium mb-3">
                #1 Choice for daily school runs
              </p>
              <button className="bg-[#f4e225] text-neutral-900 text-sm font-bold px-5 py-2.5 rounded-full shadow-lg hover:bg-[#dcb808] transition-colors flex items-center gap-2">
                Book a Trial
                <ArrowRight size={18} />
              </button>
            </div>
          </div>
          {/* Pagination Dots Simulation */}
          <div className="absolute bottom-3 right-4 flex gap-1.5 z-20">
            <div className="w-4 h-1.5 bg-white rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
            <div className="w-1.5 h-1.5 bg-white/50 rounded-full"></div>
          </div>
        </div>
      </section>

      {/* School Selection Section */}
      <section className="mt-8">
        <div className="flex items-center justify-between px-5 mb-4">
          <h2 className="text-xl font-bold tracking-tight">
            Select Your School
          </h2>
          <button className="text-[#dcb808] dark:text-[#f4e225] text-sm font-bold">
            See All
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-5 pb-4 no-scrollbar snap-x">
          {schools.length > 0 ? (
            schools.map((school, index) => (
              <div
                key={index}
                onClick={() => navigate(`/search?q=${school.name}`)}
                className="flex flex-col items-center gap-2 snap-center shrink-0 w-[72px] cursor-pointer group"
              >
                <div className="size-[72px] rounded-full bg-white dark:bg-[#2d2c1b] border border-neutral-100 dark:border-neutral-700 shadow-sm flex items-center justify-center p-1 group-hover:border-[#f4e225] transition-colors">
                  <div className="size-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex items-center justify-center">
                    <span className={`text-2xl font-black ${school.color}`}>
                      {school.char}
                    </span>
                  </div>
                </div>
                <span className="text-xs font-semibold text-center leading-tight truncate w-full px-1">
                  {school.name}
                </span>
              </div>
            ))
          ) : (
            <div className="px-5 text-sm text-gray-500">Loading schools...</div>
          )}
        </div>
      </section>

      {/* Go Anywhere Section */}
      <section className="mt-8 px-5">
        <div className="rounded-2xl bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-900/10 dark:to-amber-900/10 border border-yellow-200 dark:border-yellow-700/30 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-yellow-400 dark:bg-yellow-500 flex items-center justify-center shadow-sm">
              <Navigation size={24} className="text-black" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">
                Go Anywhere
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                Book an auto for any destination
              </p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex-1 relative">
              <MapPin
                size={18}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                placeholder="Enter destination..."
                className="w-full bg-white dark:bg-[#2d2c1b] border border-gray-200 dark:border-gray-600 rounded-full pl-10 pr-4 py-3 text-sm font-medium outline-none focus:border-yellow-400 dark:focus:border-yellow-500 focus:ring-2 focus:ring-yellow-400/20 transition-all text-gray-800 dark:text-gray-100 placeholder:text-gray-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const value = e.target.value.trim();
                    if (value) {
                      navigate(`/search?go-anywhere=${encodeURIComponent(value)}`);
                    }
                  }
                }}
                id="go-anywhere-input"
              />
            </div>
            <button
              onClick={() => {
                const input = document.getElementById("go-anywhere-input");
                const value = input?.value?.trim();
                if (value) {
                  navigate(`/search?go-anywhere=${encodeURIComponent(value)}`);
                }
              }}
              className="bg-yellow-400 hover:bg-yellow-500 dark:bg-yellow-500 dark:hover:bg-yellow-400 text-black font-bold px-5 py-3 rounded-full transition-colors flex items-center gap-2 shadow-sm shrink-0"
            >
              <ArrowRight size={18} />
            </button>
          </div>

          <div className="mt-4 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
            <ShieldCheck size={14} className="text-emerald-500" />
            <span>Verified drivers available nearby</span>
          </div>
        </div>
      </section>

      {/* Trusted Bhaiyas Section */}
      <section className="mt-6 px-5">
        <h2 className="text-xl font-bold tracking-tight mb-4">
          Available School Bhaiyas
        </h2>
        <div className="flex flex-col gap-5">
          {/* Driver Cards */}
          {randomDrivers.map((driver, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#2d2c1b] rounded-xl p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-3">
                <div className="bg-[#15803d]/10 text-[#15803d] dark:text-green-400 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-[#15803d]/20 flex items-center gap-1">
                  <ShieldCheck
                    size={14}
                    className="text-[#15803d] dark:text-green-400"
                  />
                  {driver.badge.text}
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  <div
                    className="size-16 rounded-full bg-neutral-200 bg-cover bg-center border-2 border-white dark:border-neutral-600 shadow-sm"
                    style={{ backgroundImage: `url('${driver.img}')` }}
                  ></div>
                  <div className="absolute -bottom-1 -right-1 bg-white dark:bg-[#2d2c1b] rounded-full p-0.5 shadow-sm">
                    <div className="bg-[#f4e225] text-black text-[10px] font-bold px-1.5 py-0.5 rounded-full flex items-center gap-0.5">
                      {driver.rating}{" "}
                      <Star size={10} fill="currentColor" strokeWidth={0} />
                    </div>
                  </div>
                </div>
                <div className="flex-1 pt-1">
                  <h3 className="text-lg font-bold text-neutral-900 dark:text-white">
                    {driver.name}
                  </h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                    {driver.details}
                  </p>
                  <div className="flex items-center gap-3 mt-3">
                    <div className="bg-white border-2 border-neutral-200 dark:border-neutral-600 rounded px-2 py-1 shadow-sm flex items-center gap-1.5">
                      <div className="size-2 rounded-full bg-blue-600"></div>
                      <span className="font-mono text-xs font-bold text-[#15803d] tracking-wider">
                        {driver.plate}
                      </span>
                    </div>
                    <span className="text-xs font-medium text-neutral-400">
                      |
                    </span>
                    <span className="text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                      {driver.trips}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-5 flex gap-3">
                <button
                  onClick={() => navigate(`/auto-bhaiya/${driver.autoNumber}`)}
                  className="flex-1 bg-[#f4e225] hover:bg-[#dcb808] text-neutral-900 font-bold py-3.5 rounded-full text-sm transition-colors shadow-sm flex items-center justify-center gap-2"
                >
                  Book for School
                </button>
                <button className="size-12 rounded-full border border-neutral-200 dark:border-neutral-700 flex items-center justify-center text-neutral-600 dark:text-neutral-400 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">
                  <MessageCircle size={24} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <Search
        onSelectRide={(ride) => navigate(`/auto-bhaiya/${ride.autoNumber}`)}
      />
    </div>
  );
}
