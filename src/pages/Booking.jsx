import React, { useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  MapPin,
  Clock,
  ArrowLeft,
  ArrowRight,
  Car,
  Star,
  CheckCircle2,
  Navigation,
  Sparkles
} from "lucide-react";
import { getAutoById } from "../data/autos.js";
import { createBooking } from "../data/bookings.js";

const POPULAR_DESTINATIONS = [
  "Bistupur Market",
  "Sakchi Golchakkar",
  "Tatanagar Station",
  "Kadma Market",
  "Sonari Airport",
  "Telco Plaza"
];

export default function BookingPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const auto = getAutoById(id);

  const [pickup, setPickup] = useState(auto ? auto.area : "Sakchi Market");
  const [destination, setDestination] = useState(
    auto?.destinationHints?.[0] || "Bistupur Market"
  );
  const [fare] = useState(auto ? auto.fareEstimate : 120);
  const [isSubmitting, setIsSubmitting] = useState(false);


  if (!auto) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center pb-24">
        <h2 className="text-xl font-bold text-gray-900 mb-2">Auto Not Selected</h2>
        <p className="text-xs text-gray-500 mb-4">Please select an auto to proceed with booking.</p>
        <Link
          to="/search"
          className="bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-full text-xs"
        >
          Find an Auto
        </Link>
      </div>
    );
  }

  const handleConfirmBooking = () => {
    setIsSubmitting(true);
    setTimeout(() => {
      const newBooking = createBooking({
        auto,
        pickup,
        destination,
        fareEstimate: fare
      });
      navigate(`/tracking/${newBooking.id}`);
    }, 400);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 py-3 shadow-2xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-extrabold text-base text-gray-900">
            Ride Summary & Confirmation
          </h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Selected Auto Card (Section 16) */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
              Your Selected Auto Bhaiya
            </span>
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck size={12} />
              <span>VERIFIED AUTO</span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 flex items-center justify-center text-3xl shrink-0 shadow-xs">
              👨‍✈️
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-mono font-black text-sm text-gray-950 bg-amber-50 border border-amber-300 px-2 py-0.5 rounded-md">
                  {auto.autoNumber}
                </span>
                <span className="font-mono text-xs text-gray-500 font-semibold">
                  {auto.vehicleNumber}
                </span>
              </div>
              <h2 className="font-black text-lg text-gray-900 mt-1 truncate">
                {auto.driverName}
              </h2>
              <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                <span>{auto.vehicleType}</span>
                <span>•</span>
                <span className="flex items-center gap-0.5 font-bold text-gray-800">
                  <Star size={11} className="text-amber-500 fill-amber-400" />
                  {auto.rating.toFixed(1)}
                </span>
              </div>
            </div>
          </div>

          {/* Quick Hub info */}
          <div className="p-3 bg-gray-50 rounded-2xl flex items-center justify-between text-xs">
            <div className="flex items-center gap-1.5 text-gray-600">
              <Clock size={14} className="text-emerald-600" />
              <span>Driver arrives in <strong>~{auto.etaMinutes} mins</strong></span>
            </div>
            <span className="text-emerald-700 font-bold bg-emerald-100/60 px-2 py-0.5 rounded-md text-[11px]">
              Fast Pickup
            </span>
          </div>
        </div>

        {/* Route Inputs */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-4">
          <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">
            Trip Locations
          </h2>

          <div className="space-y-3">
            {/* Pickup */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Pickup Location</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup point"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:bg-white focus:border-emerald-500 outline-none"
                />
              </div>
            </div>

            {/* Destination */}
            <div>
              <label className="block text-[11px] font-bold text-gray-600 mb-1 flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span>Destination Drop</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Where do you want to go?"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:bg-white focus:border-amber-500 outline-none"
                />
              </div>
            </div>
          </div>

          {/* Quick Destination Chips */}
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
              Popular Drop Points:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {POPULAR_DESTINATIONS.map((dest) => (
                <button
                  key={dest}
                  type="button"
                  onClick={() => setDestination(dest)}
                  className={`text-[11px] font-semibold px-2.5 py-1 rounded-full border transition-colors ${
                    destination === dest
                      ? "bg-amber-100 border-amber-300 text-amber-900 font-bold"
                      : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {dest}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Fare Breakdown */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">
              Estimated Fare
            </span>
            <span className="text-2xl font-black text-gray-950">
              ₹{fare}
            </span>
          </div>

          <div className="space-y-1.5 pt-2 border-t border-gray-100 text-xs text-gray-600">
            <div className="flex justify-between">
              <span>Base Meter / Zone Fare</span>
              <span className="font-semibold text-gray-800">₹{fare}</span>
            </div>
            <div className="flex justify-between">
              <span>Booking Fee</span>
              <span className="font-semibold text-emerald-700">₹0 (Free MVP)</span>
            </div>
            <div className="flex justify-between text-gray-400 text-[11px]">
              <span>Payment Mode</span>
              <span>Direct to Bhaiya via UPI / Cash</span>
            </div>
          </div>
        </div>

        {/* Confirm Action Button */}
        <div className="pt-2">
          <button
            onClick={handleConfirmBooking}
            disabled={isSubmitting || !pickup.trim() || !destination.trim()}
            className="w-full bg-amber-400 hover:bg-amber-500 active:scale-[0.98] disabled:opacity-50 text-gray-950 font-black py-4 px-6 rounded-2xl text-base shadow-lg shadow-amber-400/30 flex items-center justify-center gap-2 transition-all"
          >
            {isSubmitting ? (
              <span>Creating Booking...</span>
            ) : (
              <>
                <span>Confirm Booking (₹{fare})</span>
                <ArrowRight size={20} />
              </>
            )}
          </button>
          <p className="text-[11px] text-gray-400 text-center mt-2">
            No cancellation charges. Pay directly to Bhaiya upon arrival or trip start.
          </p>
        </div>
      </div>
    </div>
  );
}
