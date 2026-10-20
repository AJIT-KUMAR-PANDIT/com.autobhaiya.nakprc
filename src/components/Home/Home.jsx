import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
  Search,
  ShieldCheck,
  QrCode,
  MapPin,
  ArrowRight,
  Car,
  Clock,
  Star,
  CheckCircle2,
  Navigation,
  Building2,
  Compass,
  Factory,
  Train,
  Fuel,
  Filter
} from "lucide-react";
import { getAutos, CATEGORIES, FUEL_TYPES } from "../../data/autos.js";
import AutoCard from "../Shared/AutoCard.jsx";

const POPULAR_HUBS = [
  { name: "Sakchi", icon: MapPin },
  { name: "Bistupur", icon: Building2 },
  { name: "Kadma", icon: Car },
  { name: "Sonari", icon: Compass },
  { name: "Telco", icon: Factory },
  { name: "Tatanagar", icon: Train }
];

export default function Home() {
  const navigate = useNavigate();
  const [quickSearch, setQuickSearch] = useState("");
  const [destinationInput, setDestinationInput] = useState("");

  const autos = getAutos();
  const nearbyAutos = autos.slice(0, 4);

  const handleSearchSubmit = (e) => {
    e?.preventDefault();
    if (quickSearch.trim()) {
      navigate(`/search?q=${encodeURIComponent(quickSearch.trim())}`);
    } else {
      navigate("/search");
    }
  };

  const handleDestinationSubmit = (e) => {
    e?.preventDefault();
    if (destinationInput.trim()) {
      navigate(`/search?q=${encodeURIComponent(destinationInput.trim())}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32" data-testid="home-page">
      {/* Hero Mobility Search Header */}
      <section className="bg-gradient-to-b from-amber-400 via-amber-300 to-amber-200/50 pt-5 pb-7 px-4 rounded-b-[32px] shadow-xs">
        <div className="max-w-md mx-auto space-y-4">
          {/* Tagline & Badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-black/10 backdrop-blur-md px-3 py-1 rounded-full text-gray-950 text-xs font-bold">
              <ShieldCheck size={14} className="text-gray-900" />
              <span>Jamshedpur Verified Auto Network</span>
            </div>
            <span className="text-[11px] font-extrabold text-gray-900">
              NAKPRC
            </span>
          </div>

          <div>
            <h1 className="text-2xl font-black text-gray-950 tracking-tight leading-tight">
              Auto Bhaiya <br />
              <span className="text-emerald-950">by NAKPRC</span>
            </h1>
            <p className="text-xs font-semibold text-gray-800/80 mt-1">
              Verified identity numbers, authentic QR codes & fair direct fares.
            </p>
          </div>

          {/* Quick Search Bar */}
          <form
            onSubmit={handleSearchSubmit}
            className="relative bg-white rounded-2xl shadow-md border border-amber-300/60 p-1.5 flex items-center"
          >
            <div className="pl-3 text-gray-400">
              <Search size={18} />
            </div>
            <input
              type="text"
              value={quickSearch}
              onChange={(e) => setQuickSearch(e.target.value)}
              placeholder="Search Auto # (e.g. AB-101), driver, area, fuel..."
              className="w-full bg-transparent pl-2.5 pr-2 py-2 text-xs font-bold text-gray-900 placeholder:text-gray-400 outline-none"
              data-testid="home-search-input"
            />
            <button
              type="submit"
              className="bg-gray-950 hover:bg-black text-white font-bold text-xs px-4 py-2.5 rounded-xl transition-transform active:scale-95 shrink-0"
              data-testid="home-search-btn"
            >
              Search
            </button>
          </form>

          {/* Quick Service Action Grid */}
          <div className="grid grid-cols-4 gap-2 pt-1 text-center">
            <Link
              to="/scan"
              className="bg-white/80 backdrop-blur-sm border border-amber-200/80 p-2.5 rounded-2xl flex flex-col items-center hover:bg-white active:scale-95 transition-all shadow-2xs"
              data-testid="quick-scan-btn"
            >
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center mb-1">
                <QrCode size={18} />
              </div>
              <span className="text-[10px] font-bold text-gray-900 leading-tight">
                Scan QR
              </span>
            </Link>

            <Link
              to="/verify"
              className="bg-white/80 backdrop-blur-sm border border-amber-200/80 p-2.5 rounded-2xl flex flex-col items-center hover:bg-white active:scale-95 transition-all shadow-2xs"
              data-testid="quick-verify-btn"
            >
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center mb-1">
                <ShieldCheck size={18} />
              </div>
              <span className="text-[10px] font-bold text-gray-900 leading-tight">
                Verify
              </span>
            </Link>

            <Link
              to="/search"
              className="bg-white/80 backdrop-blur-sm border border-amber-200/80 p-2.5 rounded-2xl flex flex-col items-center hover:bg-white active:scale-95 transition-all shadow-2xs"
              data-testid="quick-directory-btn"
            >
              <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-900 flex items-center justify-center mb-1">
                <Car size={18} />
              </div>
              <span className="text-[10px] font-bold text-gray-900 leading-tight">
                All Autos
              </span>
            </Link>

            <Link
              to="/bookings"
              className="bg-white/80 backdrop-blur-sm border border-amber-200/80 p-2.5 rounded-2xl flex flex-col items-center hover:bg-white active:scale-95 transition-all shadow-2xs"
              data-testid="quick-rides-btn"
            >
              <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-900 flex items-center justify-center mb-1">
                <Clock size={18} />
              </div>
              <span className="text-[10px] font-bold text-gray-900 leading-tight">
                My Rides
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Main Home Sections */}
      <div className="max-w-md mx-auto px-4 pt-5 space-y-6">
        {/* Where to Go Section */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center text-xs">
              <Navigation size={14} className="text-gray-950" />
            </div>
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-gray-900">
                Where are you heading?
              </h2>
              <p className="text-[11px] text-gray-400">
                Direct pickup and drop in Jamshedpur
              </p>
            </div>
          </div>

          <form onSubmit={handleDestinationSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <MapPin
                size={16}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="text"
                value={destinationInput}
                onChange={(e) => setDestinationInput(e.target.value)}
                placeholder="Enter destination e.g. Bistupur..."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl pl-9 pr-3 py-2.5 text-xs font-semibold text-gray-900 focus:bg-white focus:border-amber-400 outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center gap-1 shadow-2xs shrink-0"
            >
              <span>Find</span>
              <ArrowRight size={14} />
            </button>
          </form>

          {/* Quick Hub Chips - Zero Emojis */}
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none pt-1">
            {POPULAR_HUBS.map((hub) => {
              const HubIcon = hub.icon;
              return (
                <button
                  key={hub.name}
                  type="button"
                  onClick={() => navigate(`/search?q=${encodeURIComponent(hub.name)}`)}
                  className="text-[11px] font-bold bg-gray-50 hover:bg-gray-100 border border-gray-200/80 px-2.5 py-1.5 rounded-lg text-gray-700 whitespace-nowrap flex items-center gap-1.5"
                >
                  <HubIcon size={12} className="text-emerald-700" />
                  <span>{hub.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Category & Fuel Quick Browse */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-900 flex items-center gap-1.5">
              <Filter size={13} className="text-emerald-600" />
              <span>Browse by Auto Type & Fuel</span>
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => navigate(`/search?category=${cat.toLowerCase()}`)}
                className="p-3 bg-gray-50 hover:bg-emerald-50/60 border border-gray-200 rounded-2xl text-left transition-colors"
              >
                <span className="font-extrabold text-gray-900 block">{cat} Autos</span>
                <span className="text-[10px] text-gray-500 block mt-0.5">
                  {cat === "Passenger" ? "Daily passenger transit" : "Commercial luggage & logistics"}
                </span>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-1.5 pt-1">
            {FUEL_TYPES.map((fuel) => (
              <button
                key={fuel}
                onClick={() => navigate(`/search?fuel=${fuel.toLowerCase()}`)}
                className="text-[11px] font-bold px-2.5 py-1 bg-gray-100 hover:bg-amber-100 text-gray-800 rounded-lg border border-gray-200 flex items-center gap-1 transition-colors"
              >
                <Fuel size={10} className="text-amber-600" />
                <span>{fuel}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Nearby Verified Auto Bhaiyas */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-black text-gray-900">
                Verified Bhaiyas Nearby
              </h2>
              <p className="text-[11px] text-gray-500 font-medium">
                Unique Auto Bhaiya numbers with security hashes
              </p>
            </div>
            <Link
              to="/search"
              className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-0.5"
            >
              <span>View All</span>
              <ArrowRight size={13} />
            </Link>
          </div>

          <div className="space-y-3">
            {nearbyAutos.map((auto) => (
              <AutoCard key={auto.id} auto={auto} />
            ))}
          </div>
        </div>

        {/* Safety & Identity Banner */}
        <div className="bg-emerald-900 text-white rounded-3xl p-5 shadow-sm space-y-2 relative overflow-hidden">
          <div className="flex items-center gap-2">
            <ShieldCheck size={18} className="text-emerald-300" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-200">
              Verified Mobility Standard
            </span>
          </div>
          <h3 className="text-base font-extrabold text-white">
            Every Auto Has Its Own Verification QR
          </h3>
          <p className="text-xs text-emerald-100/90 leading-relaxed font-medium">
            Scan any Auto Bhaiya QR before boarding to check driver record, vehicle plate, and operating zone directly on your phone.
          </p>
          <div className="pt-2">
            <Link
              to="/verify"
              className="inline-flex items-center gap-1.5 bg-white text-emerald-950 font-bold text-xs py-2 px-3.5 rounded-xl shadow-xs hover:bg-emerald-50 transition-colors"
            >
              <span>Test Auto Verification</span>
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>

        {/* Admin & Driver Command Portal */}
        <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-xs flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gray-950 text-amber-400 flex items-center justify-center shrink-0 shadow-2xs">
              <ShieldCheck size={20} />
            </div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                Fleet Management
              </span>
              <h4 className="font-extrabold text-xs text-gray-950">
                Admin & Auto Driver Portal
              </h4>
              <p className="text-[11px] text-gray-500 font-medium">
                Super admin controls, booking manager & 2x/week driver quota
              </p>
            </div>
          </div>
          <Link
            to="/admin"
            className="bg-gray-900 hover:bg-black text-white font-extrabold px-3.5 py-2 rounded-xl text-xs flex items-center gap-1 shrink-0 transition-transform active:scale-95"
          >
            <span>Open</span>
            <ArrowRight size={13} />
          </Link>
        </div>
      </div>
    </div>
  );
}
