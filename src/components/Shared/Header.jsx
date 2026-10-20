import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ShieldCheck,
  User,
  LogIn,
  LogOut,
  Clock,
  ChevronDown,
  Sparkles,
  ShieldAlert,
  CarTaxiFront
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function Header() {
  const navigate = useNavigate();
  const { user, isSignedIn, openAuthModal, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close menu on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const initials = user?.name
    ? user.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : "AB";

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Simple top bar with Auto Bhaiya logo / wordmark */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
          aria-label="Auto Bhaiya by NAKPRC Home"
          data-testid="header-logo"
        >
          <img
            src="/logo.png"
            alt="Auto Bhaiya Logo"
            className="h-9 w-9 object-contain drop-shadow-xs"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-gray-900 leading-none">
              Auto Bhaiya
            </span>
            <span className="text-[10px] font-bold text-emerald-700 tracking-wider uppercase mt-0.5">
              by NAKPRC
            </span>
          </div>
        </Link>

        {/* Right side Auth & Admin actions */}
        <div className="flex items-center gap-2" ref={menuRef}>
          {isSignedIn && user ? (
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="flex items-center gap-2 p-1 pl-2.5 pr-2 rounded-full border border-gray-200 bg-gray-50/80 hover:bg-gray-100 transition-all active:scale-95 text-left"
                data-testid="user-profile-btn"
                aria-label="User Account Menu"
              >
                <div className="flex flex-col text-right">
                  <span className="text-xs font-black text-gray-900 leading-none truncate max-w-[85px]">
                    {user.name.split(" ")[0]}
                  </span>
                  <span className="text-[9px] font-extrabold text-emerald-700 uppercase tracking-wider leading-tight mt-0.5">
                    {user.role === "driver"
                      ? "Driver"
                      : user.role === "super_admin"
                      ? "Admin"
                      : "Rider"}
                  </span>
                </div>
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-400 to-yellow-300 text-gray-950 flex items-center justify-center font-black text-[11px] shadow-2xs shrink-0">
                  {initials}
                </div>
                <ChevronDown size={14} className="text-gray-400" />
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white rounded-2xl shadow-xl border border-gray-100 py-1.5 z-50 animate-in fade-in slide-in-from-top-2 duration-150 divide-y divide-gray-100">
                  <div className="px-3 py-2">
                    <p className="text-xs font-black text-gray-900 truncate">
                      {user.name}
                    </p>
                    <p className="text-[10px] text-gray-500 truncate">
                      {user.phone || user.email || "Verified Auto Rider"}
                    </p>
                  </div>

                  <div className="py-1">
                    <Link
                      to="/profile"
                      onClick={() => setMenuOpen(false)}
                      className="w-full px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center gap-2 transition-colors"
                    >
                      <User size={15} className="text-gray-400" />
                      <span>My Profile & SOS</span>
                    </Link>
                    <Link
                      to="/bookings"
                      onClick={() => setMenuOpen(false)}
                      className="w-full px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center gap-2 transition-colors"
                    >
                      <Clock size={15} className="text-gray-400" />
                      <span>Ride Bookings</span>
                    </Link>
                    <Link
                      to="/rent"
                      onClick={() => setMenuOpen(false)}
                      className="w-full px-3 py-2 text-xs font-bold text-emerald-800 hover:bg-emerald-50 flex items-center gap-2 transition-colors"
                    >
                      <CarTaxiFront size={15} className="text-emerald-700" />
                      <span>Rent Auto & Driver</span>
                    </Link>
                    <Link
                      to="/admin"
                      onClick={() => setMenuOpen(false)}
                      className="w-full px-3 py-2 text-xs font-bold text-gray-700 hover:bg-gray-50 hover:text-gray-900 flex items-center gap-2 transition-colors"
                    >
                      <ShieldCheck size={15} className="text-emerald-700" />
                      <span>Admin & Fleet Portal</span>
                    </Link>
                  </div>

                  <div className="py-1">
                    <button
                      onClick={() => {
                        setMenuOpen(false);
                        logout();
                      }}
                      className="w-full px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 flex items-center gap-2 transition-colors text-left"
                    >
                      <LogOut size={15} />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openAuthModal("phone")}
                className="px-3 py-1.5 rounded-full bg-gray-950 hover:bg-black text-white text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-xs"
                data-testid="header-signin-btn"
                aria-label="Sign In"
              >
                <LogIn size={13} />
                <span>Sign In</span>
              </button>

              <Link
                to="/admin"
                className="p-1.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center text-[11px] font-bold"
                title="Admin & Driver Portal"
                aria-label="Admin Portal"
              >
                <ShieldCheck size={18} className="text-emerald-700" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
