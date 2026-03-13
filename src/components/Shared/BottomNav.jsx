import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Home, History, Search, Wallet, User, QrCode, Keyboard } from "lucide-react";

export default function BottomNav() {
  const { pathname } = useLocation();
  const [isSearchMenuOpen, setIsSearchMenuOpen] = useState(false);

  // Extract vNumber from pathname e.g., /auto-bhaiya/DL1C5678
  const match = pathname.match(/\/auto-bhaiya\/([^/]+)/);
  const pathVNumber = match ? match[1] : null;

  // Use pathVNumber, or fallback to localStorage
  const vNumber = pathVNumber || (typeof window !== 'undefined' ? localStorage.getItem("currentVNumber") : null);

  // Build the correct links dynamically depending on context
  const homeLink = vNumber ? `/auto-bhaiya/${vNumber}` : "/";
  const historyLink = "/history"; // Route now exists!
  const searchLink = "/search"; 
  const paymentsLink = vNumber ? `/auto-bhaiya/${vNumber}/payments` : "/"; // Payments require vNumber according to App.jsx
  const profileLink = vNumber ? `/auto-bhaiya/${vNumber}/profile` : "/"; // Profile requires vNumber according to App.jsx

  // Check which link is active
  const isHomeActive = pathname === homeLink || pathname === "/";
  const isHistoryActive = pathname.includes("/history");
  const isSearchActive = pathname.includes("/search");
  const isPaymentsActive = pathname.includes("/payments");
  const isProfileActive = pathname.includes("/profile");

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-card-dark border-t border-gray-100 dark:border-gray-800 pb-[env(safe-area-inset-bottom)] pt-2 px-4 z-50 h-[80px]">
      <div className="flex justify-between items-center h-full pb-4">
        <Link
          className={`flex flex-col items-center gap-1 w-14 transition-colors ${isHomeActive ? "text-primary dark:text-primary" : "text-gray-400 hover:text-text-main dark:hover:text-white"}`}
          to={homeLink}
        >
          <Home className={`w-[24px] h-[24px] ${isHomeActive ? "fill-current" : ""}`} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link
          className={`flex flex-col items-center gap-1 w-14 transition-colors ${isHistoryActive ? "text-primary dark:text-primary" : "text-gray-400 hover:text-text-main dark:hover:text-white"}`}
          to={historyLink}
        >
          <History className={`w-[24px] h-[24px] ${isHistoryActive ? "fill-current" : ""}`} />
          <span className="text-[10px] font-medium">History</span>
        </Link>
        
        {/* Center Search Button */}
        <div className="relative -top-5 flex justify-center w-16">
          <button
            onClick={() => setIsSearchMenuOpen(!isSearchMenuOpen)}
            className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-transform active:scale-95 z-20 relative ${
              isSearchActive || isSearchMenuOpen
                ? "bg-primary text-white shadow-primary/40 ring-4 ring-primary/20" 
                : "bg-gray-900 text-white dark:bg-white dark:text-gray-900 shadow-gray-900/20"
            }`}
          >
            <Search className={`w-[24px] h-[24px] transition-transform duration-300 ${isSearchMenuOpen ? 'rotate-90 scale-110' : ''}`} strokeWidth={2.5} />
          </button>

          {/* Popup Menu Overlay to close on click outside */}
          {isSearchMenuOpen && (
            <div 
              className="fixed inset-0 z-10 bg-black/5 backdrop-blur-[1px]" 
              onClick={() => setIsSearchMenuOpen(false)}
            />
          )}

          {/* Popup Menu Items */}
          <div className={`absolute bottom-16 flex items-center gap-4 transition-all duration-300 z-20 ${
            isSearchMenuOpen ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8 pointer-events-none"
          }`}>
            <Link
              to="/scan"
              onClick={() => setIsSearchMenuOpen(false)}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-12 h-12 rounded-full bg-white dark:bg-card-dark shadow-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200 transition-transform group-hover:scale-110 group-active:scale-95">
                <QrCode size={20} />
              </div>
              <span className="text-[10px] font-bold text-gray-800 dark:text-white bg-white/90 dark:bg-black/70 px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm">Scanner</span>
            </Link>

            <Link
              to={searchLink}
              onClick={() => setIsSearchMenuOpen(false)}
              className="flex flex-col items-center gap-1.5 group"
            >
              <div className="w-12 h-12 rounded-full bg-white dark:bg-card-dark shadow-xl border border-gray-100 dark:border-gray-800 flex items-center justify-center text-gray-700 dark:text-gray-200 transition-transform group-hover:scale-110 group-active:scale-95">
                <Keyboard size={20} />
              </div>
              <span className="text-[10px] font-bold text-gray-800 dark:text-white bg-white/90 dark:bg-black/70 px-2.5 py-1 rounded-full backdrop-blur-md shadow-sm">Type Search</span>
            </Link>
          </div>
        </div>

        <Link
          className={`flex flex-col items-center gap-1 w-14 transition-colors ${isPaymentsActive ? "text-primary dark:text-primary" : "text-gray-400 hover:text-text-main dark:hover:text-white"}`}
          to={paymentsLink}
        >
          <Wallet className={`w-[24px] h-[24px] ${isPaymentsActive ? "fill-current" : ""}`} />
          <span className="text-[10px] font-medium">Payments</span>
        </Link>
        <Link
          className={`flex flex-col items-center gap-1 w-14 transition-colors ${isProfileActive ? "text-primary dark:text-primary" : "text-gray-400 hover:text-text-main dark:hover:text-white"}`}
          to={profileLink}
        >
          <User className={`w-[24px] h-[24px] ${isProfileActive ? "fill-current" : ""}`} />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
