import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, Search, ShieldCheck, Clock3, QrCode } from "lucide-react";

export default function BottomNav() {
  const { pathname } = useLocation();

  const isHome = pathname === "/" || pathname === "/app";
  const isVerify = pathname.startsWith("/verify");
  const isSearch = pathname.startsWith("/search");
  const isBookings =
    pathname.startsWith("/bookings") ||
    pathname.startsWith("/history") ||
    pathname.startsWith("/tracking");
  const isScan = pathname.startsWith("/scan");

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-t border-gray-200/80 shadow-[0_-4px_24px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
      role="navigation"
      aria-label="Bottom Navigation"
    >
      <div className="max-w-md mx-auto h-[64px] px-2 flex items-center justify-around relative">
        {/* 1. Home */}
        <Link
          to="/"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isHome
              ? "text-emerald-700 font-bold"
              : "text-gray-500 hover:text-gray-900 font-medium"
          }`}
          aria-label="Home"
        >
          <div className="relative">
            <Home size={22} strokeWidth={isHome ? 2.5 : 1.8} />
            {isHome && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600" />
            )}
          </div>
          <span className="text-[11px] mt-1 leading-tight">Home</span>
        </Link>

        {/* 2. Verify */}
        <Link
          to="/verify"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isVerify
              ? "text-emerald-700 font-bold"
              : "text-gray-500 hover:text-gray-900 font-medium"
          }`}
          aria-label="Verify Auto"
        >
          <div className="relative">
            <ShieldCheck size={22} strokeWidth={isVerify ? 2.5 : 1.8} />
            {isVerify && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600" />
            )}
          </div>
          <span className="text-[11px] mt-1 leading-tight">Verify</span>
        </Link>

        {/* 3. CENTER SEARCH ACTION (Visually elevated) */}
        <div className="flex-1 flex justify-center -mt-6">
          <Link
            to="/search"
            className="flex flex-col items-center group active:scale-95 transition-transform"
            aria-label="Search Auto"
          >
            <div
              className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg border-3 border-white transition-all ${
                isSearch
                  ? "bg-emerald-600 text-white shadow-emerald-500/40 ring-4 ring-emerald-400/20"
                  : "bg-gradient-to-tr from-amber-400 to-yellow-300 text-gray-950 shadow-amber-500/30 group-hover:shadow-amber-500/50"
              }`}
            >
              <Search size={24} strokeWidth={2.6} />
            </div>
            <span
              className={`text-[10px] font-extrabold uppercase tracking-wider mt-1 ${
                isSearch ? "text-emerald-700" : "text-gray-800"
              }`}
            >
              Search
            </span>
          </Link>
        </div>

        {/* 4. Bookings / Rides */}
        <Link
          to="/bookings"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isBookings
              ? "text-emerald-700 font-bold"
              : "text-gray-500 hover:text-gray-900 font-medium"
          }`}
          aria-label="Bookings"
        >
          <div className="relative">
            <Clock3 size={22} strokeWidth={isBookings ? 2.5 : 1.8} />
            {isBookings && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600" />
            )}
          </div>
          <span className="text-[11px] mt-1 leading-tight">Bookings</span>
        </Link>

        {/* 5. Scan QR */}
        <Link
          to="/scan"
          className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
            isScan
              ? "text-emerald-700 font-bold"
              : "text-gray-500 hover:text-gray-900 font-medium"
          }`}
          aria-label="Scan QR"
        >
          <div className="relative">
            <QrCode size={22} strokeWidth={isScan ? 2.5 : 1.8} />
            {isScan && (
              <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-emerald-600" />
            )}
          </div>
          <span className="text-[11px] mt-1 leading-tight">Scan QR</span>
        </Link>
      </div>
    </nav>
  );
}
