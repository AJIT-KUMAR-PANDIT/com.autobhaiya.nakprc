import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { ShieldCheck, Star, MapPin, Clock, ArrowRight, QrCode } from "lucide-react";

/**
 * @param {{
 *  auto: import("../../data/autos.js").Auto;
 *  onBook?: (auto: import("../../data/autos.js").Auto) => void;
 * }} props
 */
export default function AutoCard({ auto, onBook }) {
  const navigate = useNavigate();

  const handleBook = (e) => {
    e.stopPropagation();
    if (onBook) {
      onBook(auto);
    } else {
      navigate(`/booking/${auto.id}`);
    }
  };

  return (
    <div
      onClick={() => navigate(`/auto/${auto.id}`)}
      className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all active:scale-[0.99] cursor-pointer relative overflow-hidden group"
    >
      {/* Top Banner: Auto Number & Verification Badge */}
      <div className="flex items-center justify-between gap-2 pb-3 border-b border-gray-100">
        <div className="flex items-center gap-2">
          {/* License / Auto Bhaiya Plate */}
          <div className="bg-amber-50 border border-amber-300/80 rounded-lg px-2.5 py-0.5 flex items-center gap-1.5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span className="font-mono font-extrabold text-xs text-gray-900 tracking-wider">
              {auto.autoNumber}
            </span>
          </div>

          {/* Vehicle Type */}
          <span className="text-[11px] font-semibold text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
            {auto.vehicleType}
          </span>
        </div>

        {/* Verified Indicator */}
        <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 border border-emerald-200/80 rounded-full px-2 py-0.5 text-[11px] font-bold">
          <ShieldCheck size={14} className="text-emerald-600" />
          <span>Verified</span>
        </div>
      </div>

      {/* Main Info */}
      <div className="pt-3 flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-base text-gray-900 truncate">
              {auto.driverName}
            </h3>
            {auto.available ? (
              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Available
              </span>
            ) : (
              <span className="text-[10px] font-semibold text-gray-400 bg-gray-100 px-1.5 py-0.2 rounded">
                Busy
              </span>
            )}
          </div>

          <p className="text-xs font-mono text-gray-500 mt-0.5">
            {auto.vehicleNumber}
          </p>

          {/* Rating & Trips */}
          <div className="flex items-center gap-2 mt-2 text-xs">
            <div className="flex items-center gap-0.5 bg-amber-400 text-gray-950 font-bold px-1.5 py-0.5 rounded text-[11px]">
              <Star size={11} fill="currentColor" strokeWidth={0} />
              <span>{auto.rating.toFixed(1)}</span>
            </div>
            <span className="text-gray-400">•</span>
            <span className="text-gray-600 font-medium">
              {auto.trips.toLocaleString()} trips
            </span>
          </div>

          {/* Area & ETA */}
          <div className="flex items-center gap-3 mt-2.5 text-xs text-gray-600 font-medium">
            <span className="flex items-center gap-1 truncate">
              <MapPin size={13} className="text-gray-400 shrink-0" />
              {auto.area}
            </span>
            <span className="text-gray-300">•</span>
            <span className="flex items-center gap-1 text-emerald-700 font-semibold shrink-0">
              <Clock size={13} className="shrink-0" />
              {auto.etaMinutes} min away
            </span>
          </div>
        </div>

        {/* Fare & Quick QR View */}
        <div className="flex flex-col items-end justify-between shrink-0">
          <div className="text-right">
            <span className="text-lg font-black text-gray-950">
              ₹{auto.fareEstimate}
            </span>
            <span className="block text-[10px] text-gray-400 font-medium -mt-0.5">
              estimated
            </span>
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/auto/${auto.id}#qr-verify`);
            }}
            title="View QR Identity"
            className="mt-3 p-1.5 rounded-lg border border-gray-200 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50 transition-colors"
          >
            <QrCode size={18} />
          </button>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
        <Link
          to={`/auto/${auto.id}`}
          onClick={(e) => e.stopPropagation()}
          className="flex-1 py-2.5 px-3 rounded-xl border border-gray-200 text-center font-bold text-xs text-gray-700 hover:bg-gray-50 transition-colors"
        >
          View Details
        </Link>
        <button
          onClick={handleBook}
          className="flex-1 py-2.5 px-3 rounded-xl bg-amber-400 hover:bg-amber-500 active:scale-[0.98] text-gray-950 text-center font-extrabold text-xs shadow-xs transition-all flex items-center justify-center gap-1"
        >
          <span>Book Ride</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </div>
  );
}
