import React from "react";
import { BadgeCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-20 bg-background-light/95 dark:bg-background-dark/95 backdrop-blur-sm px-4 pt-2 pb-0.5 border-b border-gray-100 dark:border-gray-800">
      <div className="flex items-center justify-between">
        {/* Brand */}
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
        {/* Driver Profile & Badge */}
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
          <div
            className="h-9 w-9 rounded-full bg-gray-200 bg-cover bg-center border-2 border-primary"
            style={{
              backgroundImage:
                "url('https://lh3.googleusercontent.com/aida-public/AB6AXuCzalvMLs15yELe2VKcy0IIBLIQ01G2BssTuWl8bbpad-hc1xZ4ft_ORVdRV772nEd6PQzGYc3shwYLJPnlEEkEmpZXP2sEYBYnnm3GpHquAsztaHLERZgvVA8_9tBlnI4FfLkol4adZnUHiNmV88gx7EPkn4NQ9f8aZL4tnnNilmxbTpvSEEFz5l_3_xMp8KeX6IzWa2p-oTWYw5LQV91ga8H6-O7w2F0HkmeZb696g6NDUNRCWjhTC7Nk7bdE_WXqH77ahusaSvE')",
            }}
            aria-label="Portrait of an Indian auto driver smiling"
          ></div>
        </div>
      </div>
    </header>
  );
}
