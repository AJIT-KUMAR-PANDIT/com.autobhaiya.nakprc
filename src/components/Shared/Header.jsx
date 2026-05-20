import React from "react";
import { Menu, BadgeCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm px-4 pt-2 pb-0.5 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between">
        {/* Brand */}
        <a href="/">
          <div className="flex items-center gap-2">
            <div className="h-21 w-21">
              <img
                src="/logo.png"
                alt="Auto Bhaiya Logo"
                className="h-full w-full object-cover"
              />
            </div>
            <div className="flex flex-col">
              <h1 className="text-xl font-bold tracking-tight text-text-main dark:text-white">
                Auto Bhaiya
              </h1>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                Partner App
              </span>
            </div>
          </div>
        </a>
        {/* Hamburger Menu */}
        <div className="flex items-center gap-3 bg-white dark:bg-card-dark rounded-full pl-3 pr-1 py-1 shadow-sm border border-gray-100 dark:border-gray-700">
          <div className="flex flex-col items-end mr-1">
            <span className="text-xs font-bold text-text-main dark:text-white leading-none">
              Bablu
            </span>
            <div className="flex items-center gap-1 mt-0.5">
              <BadgeCheck className="text-primary w-[14px] h-[14px]" />
              <span className="text-[10px] font-medium text-primary uppercase tracking-wide">
                Verified
              </span>
            </div>
          </div>
          <button
            className="h-9 w-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Open menu"
          >
            <Menu className="w-[18px] h-[18px] text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>
    </header>
  );
}
