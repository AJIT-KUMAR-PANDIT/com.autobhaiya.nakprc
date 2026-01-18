import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Search from "../Shared/Search";
import csvUrl from "../../assets/data.autobhaiya.nakprc.csv?url";

export default function Landing() {
  const navigate = useNavigate();
  const [randomDrivers, setRandomDrivers] = useState([]);

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
            };
          })
          .filter((item) => item !== null);

        const shuffled = parsedData.sort(() => 0.5 - Math.random());
        setRandomDrivers(shuffled.slice(0, 3));
      })
      .catch((err) => console.error("Error loading CSV:", err));
  }, []);

  return (
    <div className="bg-[#f8f8f5] dark:bg-[#222110] font-sans text-neutral-900 dark:text-neutral-100 antialiased overflow-x-hidden pb-24 min-h-screen">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');
        @import url('https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap');
        
        .no-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .no-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .material-symbols-outlined {
          font-family: 'Material Symbols Outlined';
          font-weight: normal;
          font-style: normal;
          font-size: 24px;
          line-height: 1;
          letter-spacing: normal;
          text-transform: none;
          display: inline-block;
          white-space: nowrap;
          word-wrap: normal;
          direction: ltr;
        }
        body {
            font-family: 'Plus Jakarta Sans', sans-serif;
        }
      `}</style>

      {/* Header Section
      <header className="sticky top-0 z-50 bg-[#f8f8f5]/90 dark:bg-[#222110]/90 backdrop-blur-md px-5 pt-6 pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div
                className="size-10 rounded-full bg-cover bg-center border-2 border-white dark:border-neutral-700 shadow-sm"
                style={{
                  backgroundImage:
                    "url('https://lh3.googleusercontent.com/aida-public/AB6AXuDikm2ox0a38Dd8yKsXe1L6UWIdoSYMpU_lU5AWyRybLZv6RVwcGPsZqQix261EgWy1idjlsFsblzjdfGOE9BbIggGVasGwdtVL0U4kn8urXR3TJWNRr2JldGG2lhFrEUr2JvBqjrAqBxN9fzhGtkOlf17V0iv_2s9B_mxpIRenl9CB-93aqWCYzDgupYR-Q68sDhk2HUYAk4SZCAQmoifAazRelWsgfkiK51hf_I_b2lFSlRThn9nC4Rj3P6UHp_SNI6MFN0E5ti8')",
                }}
              ></div>
              <div className="absolute bottom-0 right-0 size-3 bg-green-500 rounded-full border-2 border-white dark:border-neutral-800"></div>
            </div>
            <div>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium">
                Good Morning,
              </p>
              <h2 className="text-lg font-bold leading-tight">Priya Sharma</h2>
            </div>
          </div>
          <button className="flex items-center gap-2 bg-white dark:bg-[#2d2c1b] pl-2 pr-3 py-1.5 rounded-full border border-neutral-100 dark:border-neutral-800 shadow-sm active:scale-95 transition-transform">
            <span className="material-symbols-outlined text-[#dcb808] text-[20px]">
              location_on
            </span>
            <span className="text-xs font-bold truncate max-w-[100px]">
              Vasant Kunj
            </span>
            <span className="material-symbols-outlined text-neutral-400 text-[16px]">
              expand_more
            </span>
          </button>
        </div>
      </header> */}

      {/* Hero Slider Section */}
      <section className="mt-4 px-5">
        <div className="relative w-full overflow-hidden rounded-2xl shadow-sm group">
          <div
            className="relative h-[220px] bg-cover bg-center flex flex-col justify-end p-6"
            style={{
              backgroundImage:
                "linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.3) 40%, rgba(0,0,0,0.8) 100%), url('https://lh3.googleusercontent.com/aida-public/AB6AXuCkUlMScTPzFLG5PpzUTTYpkrsAwS8cZIrVO8DhtaLQveppEBi8jZuoMWKiDec3szlXYKKhE9wvf0FdYYXVXrWwbmEMZSpfUuRguKYlOCRCxk1LWlOSIy7tKO3K1nMyh3vES68HEdBFkSY2S8bkuwOCLbN-orf9FhyrEdkovCCs4LwcUgxCXf4gVMfQzY3rJV-LVfvrNaYoLcws9acDdfbhTxkEMwezinmHu_ZLxRSbIz5N9e6ga3bLs6INFG_6ysofe7gWbStOW38')",
            }}
          >
            <div className="relative z-10 flex flex-col items-start gap-1">
              <span className="inline-flex items-center gap-1 bg-[#15803d]/90 text-white text-[10px] font-bold px-2 py-1 rounded-md backdrop-blur-sm">
                <span className="material-symbols-outlined text-[12px]">
                  verified_user
                </span>
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
                <span className="material-symbols-outlined text-[18px]">
                  arrow_forward
                </span>
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
          {/* School Items */}
          {[
            { name: "St. Xavier's", color: "text-neutral-400", char: "X" },
            { name: "DPS", color: "text-[#15803d]", char: "D" },
            { name: "KV", color: "text-blue-600", char: "K" },
            { name: "Ryan Intl.", color: "text-red-500", char: "R" },
            { name: "Modern", color: "text-orange-500", char: "M" },
          ].map((school, index) => (
            <div
              key={index}
              className="flex flex-col items-center gap-2 snap-center shrink-0 w-[72px]"
            >
              <div className="size-[72px] rounded-full bg-white dark:bg-[#2d2c1b] border border-neutral-100 dark:border-neutral-700 shadow-sm flex items-center justify-center p-1 cursor-pointer hover:border-[#f4e225] transition-colors">
                <div className="size-full rounded-full bg-neutral-100 dark:bg-neutral-800 overflow-hidden flex items-center justify-center">
                  <span className={`text-2xl font-black ${school.color}`}>
                    {school.char}
                  </span>
                </div>
              </div>
              <span className="text-xs font-semibold text-center leading-tight">
                {school.name}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* Trusted Bhaiyas Section */}
      <section className="mt-6 px-5">
        <h2 className="text-xl font-bold tracking-tight mb-4">
          Available School Bhaiyas
        </h2>
        <div className="flex flex-col gap-5">
          {/* Driver Cards */}
          {/* Driver Cards */}
          {randomDrivers.map((driver, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-[#2d2c1b] rounded-xl p-5 shadow-[0_0_0_1px_rgba(0,0,0,0.03),0_2px_8px_rgba(0,0,0,0.04)] relative overflow-hidden group"
            >
              <div className="absolute top-0 right-0 p-3">
                <div className="bg-[#15803d]/10 text-[#15803d] dark:text-green-400 rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider border border-[#15803d]/20 flex items-center gap-1">
                  <span className="material-symbols-outlined text-[14px]">
                    {driver.badge.icon}
                  </span>
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
                      <span className="material-symbols-outlined text-[10px]">
                        star
                      </span>
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
                  <span className="material-symbols-outlined">chat</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Bottom Navigation
      <nav className="fixed bottom-0 w-full bg-white dark:bg-[#2d2c1b] border-t border-neutral-200 dark:border-neutral-800 pb-4 pt-2 px-6 z-50">
        <div className="flex items-center justify-between pb-4">
          <button className="flex flex-col items-center gap-1 text-[#f4e225]">
            <span className="material-symbols-outlined filled">home</span>
            <span className="text-[10px] font-bold">Home</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-neutral-400 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200">
            <span className="material-symbols-outlined">schedule</span>
            <span className="text-[10px] font-medium">Rides</span>
          </button>
          <div className="relative -top-6">
            <button className="bg-[#15803d] text-white rounded-full size-14 shadow-lg flex items-center justify-center border-4 border-[#f8f8f5] dark:border-[#222110]">
              <span className="material-symbols-outlined text-2xl">add</span>
            </button>
          </div>
          <button className="flex flex-col items-center gap-1 text-neutral-400 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200">
            <span className="material-symbols-outlined">chat_bubble</span>
            <span className="text-[10px] font-medium">Support</span>
          </button>
          <button className="flex flex-col items-center gap-1 text-neutral-400 dark:text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-200">
            <span className="material-symbols-outlined">person</span>
            <span className="text-[10px] font-medium">Profile</span>
          </button>
        </div>
      </nav> */}

      <Search
        onSelectRide={(ride) => navigate(`/auto-bhaiya/${ride.autoNumber}`)}
      />
    </div>
  );
}
