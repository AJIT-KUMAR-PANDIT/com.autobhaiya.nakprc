"use client";

import React, { useState } from "react";
import {
  ToggleLeft,
  ToggleRight,
  Copy,
  Banknote,
  CarTaxiFront,
  Clock,
  Phone,
} from "lucide-react";

export default function Payments() {
  const [isOnDuty, setIsOnDuty] = useState(true);

  return (
    <div className="relative flex min-h-screen w-full flex-col pb-24 overflow-x-hidden bg-background-light dark:bg-background-dark font-display text-text-main dark:text-text-light transition-colors duration-200">
      {/* Status Toggle */}
      <div className="px-4 py-4 w-full">
        <div className="flex h-12 w-full items-center justify-center rounded-xl bg-gray-200 dark:bg-gray-800 p-1">
          {/* Active Option */}
          <label className="group relative flex cursor-pointer h-full flex-1 items-center justify-center overflow-hidden rounded-lg transition-all">
            <input
              className="peer invisible absolute w-0"
              name="status-toggle"
              type="radio"
              value="on"
              checked={isOnDuty}
              onChange={() => setIsOnDuty(true)}
            />
            <div className="absolute inset-0 bg-primary opacity-0 peer-checked:opacity-100 transition-opacity shadow-sm"></div>
            <span className="relative z-10 text-sm font-bold text-gray-600 dark:text-gray-400 peer-checked:text-black transition-colors flex items-center gap-2">
              <ToggleLeft className="w-[18px] h-[18px]" />
              On Duty{" "}
              <span className="text-[10px] font-normal opacity-80">
                | ड्यूटी पर
              </span>
            </span>
          </label>
          {/* Inactive Option */}
          <label className="group relative flex cursor-pointer h-full flex-1 items-center justify-center overflow-hidden rounded-lg transition-all">
            <input
              className="peer invisible absolute w-0"
              name="status-toggle"
              type="radio"
              value="off"
              checked={!isOnDuty}
              onChange={() => setIsOnDuty(false)}
            />
            <div className="absolute inset-0 bg-gray-300 dark:bg-gray-700 opacity-0 peer-checked:opacity-100 transition-opacity shadow-sm"></div>
            <span className="relative z-10 text-sm font-bold text-gray-600 dark:text-gray-400 peer-checked:text-black dark:peer-checked:text-white transition-colors flex items-center gap-2">
              <ToggleRight className="w-[18px] h-[18px]" />
              Off Duty{" "}
              <span className="text-[10px] font-normal opacity-80">
                | ड्यूटी बंद
              </span>
            </span>
          </label>
        </div>
      </div>

      {/* QR Code Card Section */}
      <div className="px-4 mb-2">
        {/* Headline */}
        <div className="text-center mb-3">
          <h2 className="text-2xl font-bold text-text-main dark:text-white tracking-tight">
            Scan & Pay{" "}
            <span className="text-lg font-medium text-gray-500 dark:text-gray-400">
              | स्कैन और पे
            </span>
          </h2>
        </div>
        {/* Card */}
        <div className="relative w-full bg-white dark:bg-card-dark rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.4)] border border-gray-100 dark:border-gray-700 overflow-hidden group">
          {/* Decorative top strip (Yellow/Green Auto theme) */}
          <div className="h-2 w-full bg-gradient-to-r from-secondary to-primary"></div>
          <div className="p-6 flex flex-col items-center justify-center gap-4">
            <div className="relative bg-white p-3 rounded-xl border-2 border-dashed border-gray-200">
              {/* QR Image */}
              <img
                alt="UPI QR Code for payment"
                className="w-48 h-48 object-contain mix-blend-multiply dark:mix-blend-normal"
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuDxxOFrp-TIjc41m6m4fJvFEuKrJro_QZMwAJdTWmSYJLDpvoD6aY-UjqWZ3053zAlva1aazBQHtSVmLTHwBDudLDApZ1_k5ZjxyMtjJ49p9czsjxSHddxCsBiZ1agi-5NVIbUTCHUaC_wu7pDWgbNIp_Aym1mOxeqCqY28ICZTbiVozdBoiFrR6ew7s4eS5ZVCUOdwg_o9bY7WAiSePJ4jhvfvB16w-23GkBpJVAqWT84ZKoJkOXlI9AUfRkUdFs1hK4oAxukLHtI"
              />
              <div className="absolute -bottom-3 -right-3 bg-secondary text-black text-[10px] font-bold px-2 py-1 rounded-md shadow-sm rotate-[-5deg]">
                BHIM UPI
              </div>
            </div>
            <div className="text-center w-full">
              <p className="text-gray-500 dark:text-gray-400 text-xs uppercase tracking-wider mb-1">
                Payment ID / यूपीआई आईडी
              </p>
              <div className="flex items-center justify-center gap-2 bg-background-light dark:bg-black/20 py-2 px-4 rounded-lg w-full max-w-[280px] mx-auto">
                <span className="text-lg font-bold text-text-main dark:text-white tracking-wide">
                  rajesh@upi
                </span>
                <button className="text-primary hover:text-primary-dark transition-colors">
                  <Copy className="w-[18px] h-[18px]" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="px-4 py-4 grid grid-cols-2 gap-4">
        {/* Earnings */}
        <div className="bg-white dark:bg-card-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-primary/10 rounded-bl-full -mr-2 -mt-2"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="p-2 bg-primary/20 rounded-lg text-primary-dark dark:text-primary">
              <Banknote className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Today's Earnings
            </p>
            <p className="text-2xl font-bold text-text-main dark:text-white">
              ₹1,200
            </p>
          </div>
        </div>
        {/* Rides */}
        <div className="bg-white dark:bg-card-dark p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col justify-between h-32 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-16 h-16 bg-secondary/10 rounded-bl-full -mr-2 -mt-2"></div>
          <div className="flex items-start justify-between relative z-10">
            <div className="p-2 bg-secondary/20 rounded-lg text-yellow-700 dark:text-yellow-400">
              <CarTaxiFront className="w-6 h-6" />
            </div>
          </div>
          <div>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
              Total Rides
            </p>
            <p className="text-2xl font-bold text-text-main dark:text-white">
              8
            </p>
          </div>
        </div>
      </div>

      {/* Recent Activity Header */}
      <div className="px-4 pt-2 pb-20">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-bold text-text-main dark:text-white">
            Recent Rides
          </h3>
          <a
            className="text-sm font-medium text-primary hover:underline"
            href="#"
          >
            View All
          </a>
        </div>
        <div className="bg-white dark:bg-card-dark rounded-xl p-3 flex items-center justify-between border border-gray-100 dark:border-gray-700 shadow-sm mb-3">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-500">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-text-main dark:text-white">
                Sector 18 to Noida City Center
              </p>
              <p className="text-xs text-gray-500">Today, 10:30 AM</p>
            </div>
          </div>
          <span className="text-sm font-bold text-primary">+ ₹150</span>
        </div>
      </div>

      {/* Floating Action Button (FAB) */}
      <button className="fixed bottom-24 right-4 z-40 group flex items-center justify-center rounded-full bg-secondary hover:bg-yellow-400 text-black shadow-[0_4px_20px_rgba(250,204,21,0.4)] transition-all active:scale-95 p-4 pr-6 pl-4 gap-3">
        <span className="bg-black/10 rounded-full p-2 flex items-center justify-center">
          <Phone className="w-6 h-6" />
        </span>
        <div className="flex flex-col items-start">
          <span className="text-sm font-bold leading-tight">Call Support</span>
          <span className="text-[10px] font-medium opacity-80 leading-tight">
            मदद चाहिए?
          </span>
        </div>
      </button>
    </div>
  );
}
