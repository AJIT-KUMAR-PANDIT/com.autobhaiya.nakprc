"use client";
import React, { useState } from "react";
import {
  ArrowLeft,
  CarFront,
  Bike,
  Gem,
  CreditCard,
  Tag,
  ArrowRight,
} from "lucide-react";

export default function Home() {
  const [selectedRide, setSelectedRide] = useState("auto");

  const rides = [
    {
      id: "auto",
      name: "Auto Bhaiya",
      icon: <CarFront size={28} />,
      time: "4 min",
      passengers: "3 passengers",
      price: "₹145",
      originalPrice: "₹160",
      iconBg: "bg-white dark:bg-gray-800",
      iconColor: "text-green-700 dark:text-green-400",
    },
    {
      id: "bike",
      name: "Bike Bhaiya",
      icon: <Bike size={28} />,
      time: "2 min",
      passengers: "1 passenger",
      price: "₹85",
      iconBg: "bg-white dark:bg-gray-800",
      iconColor: "text-gray-900 dark:text-white",
    },
    {
      id: "premium",
      name: "Premium Auto",
      icon: <Gem size={28} />,
      time: "6 min",
      passengers: "WiFi + Music",
      price: "₹190",
      iconBg: "bg-black dark:bg-white",
      iconColor: "text-white dark:text-black",
    },
  ];

  return (
    <div className="relative flex h-screen w-full flex-col bg-white dark:bg-gray-900 mb-24">
      {/* Map Section */}
      <div className="relative w-full h-[45vh] shrink-0 bg-gray-200 overflow-hidden">
        {/* Map Background */}
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d117711.91484915413!2d86.1757708!3d22.784028399999997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39f5e31989f0e2b5%3A0xeeec8e81ce9b344!2sJamshedpur%2C%20Jharkhand!5e0!3m2!1sen!2sin!4v1768632480188!5m2!1sen!2sin"
          className="absolute inset-0 w-full h-full border-0 opacity-90 dark:opacity-70"
          allowFullScreen=""
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        ></iframe>

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/10 pointer-events-none" />

        {/* Back Button */}
        <button className="absolute top-12 left-5 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-white dark:bg-gray-800 shadow-md active:scale-95 transition-transform">
          <ArrowLeft size={20} className="text-black dark:text-white" />
        </button>

        {/* Map Pin */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
          <div className="bg-black/80 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-medium mb-1 shadow-lg">
            4 mins
          </div>
          <div className="h-4 w-4 bg-green-400 rounded-full border-2 border-white shadow-md ring-4 ring-green-400/30" />
        </div>
      </div>

      {/* Bottom Sheet */}
      <div className="flex-1 -mt-6 z-10 flex flex-col bg-white dark:bg-gray-900 rounded-t-3xl shadow-[0_-8px_30px_rgba(0,0,0,0.12)] border-t border-gray-200 dark:border-gray-800">
        {/* Handle */}
        <div className="w-full flex justify-center pt-3 pb-1">
          <div className="h-1.5 w-12 rounded-full bg-gray-300 dark:bg-gray-700" />
        </div>

        {/* Header */}
        <div className="px-6 pt-2 pb-4">
          <h3 className="text-xl font-bold tracking-tight text-gray-900 dark:text-white">
            Choose a ride
          </h3>
        </div>

        {/* Vehicle Options List */}
        <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-3">
          {rides.map((ride) => (
            <div
              key={ride.id}
              onClick={() => setSelectedRide(ride.id)}
              className="relative group cursor-pointer transition-all"
            >
              {/* Background */}
              <div
                className={`absolute inset-0 rounded-3xl border-2 transition-all ${
                  selectedRide === ride.id
                    ? "bg-yellow-50 dark:bg-yellow-900/10 border-green-400"
                    : "bg-gray-50 dark:bg-gray-800/50 border-transparent hover:border-gray-200 dark:hover:border-gray-700"
                }`}
              />

              <div className="relative flex items-center justify-between p-4 z-10">
                <div className="flex items-center gap-4">
                  {/* Icon */}
                  <div
                    className={`flex h-14 w-14 shrink-0 items-center justify-center rounded-full ${ride.iconBg} shadow-sm border border-gray-100 dark:border-gray-700`}
                  >
                    <span className={`${ride.iconColor}`}>{ride.icon}</span>
                  </div>

                  {/* Info */}
                  <div className="flex flex-col">
                    <h4
                      className={`text-base leading-tight ${
                        selectedRide === ride.id ? "font-bold" : "font-semibold"
                      } text-gray-900 dark:text-white`}
                    >
                      {ride.name}
                    </h4>
                    <div className="flex items-center gap-1.5 mt-0.5">
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {ride.time}
                      </span>
                      <span className="h-1 w-1 rounded-full bg-gray-300" />
                      <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                        {ride.passengers}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="text-right">
                  <p className="text-lg font-extrabold text-gray-900 dark:text-white">
                    {ride.price}
                  </p>
                  {ride.originalPrice && (
                    <p className="text-xs text-gray-500 dark:text-gray-400 line-through">
                      {ride.originalPrice}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <div className="px-6 pb-8 pt-2 bg-white dark:bg-gray-900">
          {/* Payment & Promo Row */}
          <div className="flex items-center justify-between mb-4">
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
              <CreditCard size={18} />
              <span className="text-sm font-semibold text-gray-700 dark:text-gray-200">
                Cash
              </span>
            </button>

            <button className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
              <Tag size={18} className="text-green-700 dark:text-green-400" />
              <span className="text-sm font-semibold text-green-700 dark:text-green-400">
                Apply Coupon
              </span>
            </button>
          </div>

          {/* Main Action Button */}
          <button className="w-full bg-green-400 hover:bg-green-500 text-black font-bold text-lg py-4 rounded-full shadow-lg shadow-green-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2">
            <span>
              Confirm {rides.find((r) => r.id === selectedRide)?.name}
            </span>
            <ArrowRight size={20} className="font-bold" />
          </button>
        </div>
      </div>
      <div>
        {/* \ wether start */}

        <div
          id="ww_59cb013a4ffea"
          v="1.3"
          loc="auto"
          a='{"t":"ticker","lang":"en","sl_lpl":1,"ids":["wl2188"],"font":"Arial","sl_ics":"one_a","sl_sot":"celsius","cl_bkg":"#FDD835","cl_font":"#000000","cl_cloud":"#000000","cl_persp":"#000000","cl_sun":"#000000","cl_moon":"#000000","cl_thund":"#000000"}'
        >
          More forecasts:{" "}
          <a
            href="https://oneweather.org/orlando/30_days/"
            id="ww_59cb013a4ffea_u"
            target="_blank"
          >
            30 day forecast Orlando FL
          </a>
        </div>
        <script
          async
          src="https://app3.weatherwidget.org/js/?id=ww_59cb013a4ffea"
        ></script>
      </div>

      {/* ?wether end */}
    </div>
  );
}
