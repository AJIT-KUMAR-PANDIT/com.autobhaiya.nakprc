import React from "react";
import { Link } from "react-router-dom";
import { ShieldCheck } from "lucide-react";

export default function Header() {
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

        {/* Quick Link to Admin & Auto Driver Portal */}
        <Link
          to="/admin"
          className="p-1.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors flex items-center gap-1 text-[11px] font-bold"
          title="Admin & Driver Portal"
          aria-label="Admin Portal"
        >
          <ShieldCheck size={18} className="text-emerald-700" />
          <span className="hidden sm:inline">Admin</span>
        </Link>
      </div>
    </header>
  );
}
