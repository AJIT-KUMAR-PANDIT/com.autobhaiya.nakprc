import React from "react";
import { Link } from "react-router-dom";

export default function Header() {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-all">
      <div className="max-w-md mx-auto px-4 h-14 flex items-center justify-between">
        {/* Logo-only top navigation */}
        <Link
          to="/"
          className="flex items-center gap-2 group transition-transform active:scale-95"
          aria-label="Auto Bhaiya Home"
        >
          <img
            src="/logo.png"
            alt="Auto Bhaiya Logo"
            className="h-10 w-10 object-contain drop-shadow-sm"
          />
          <div className="flex flex-col">
            <span className="font-extrabold text-base tracking-tight text-gray-900 leading-none">
              Auto Bhaiya
            </span>
            <span className="text-[10px] font-semibold text-emerald-700 tracking-wider uppercase mt-0.5">
              Verified Mobility
            </span>
          </div>
        </Link>

        {/* Subtle city indicator */}
        <div className="flex items-center gap-1.5 bg-gray-50 border border-gray-200/70 rounded-full px-2.5 py-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[11px] font-bold text-gray-600">Jamshedpur</span>
        </div>
      </div>
    </header>
  );
}
