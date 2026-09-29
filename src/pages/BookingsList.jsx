import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Clock,
  MapPin,
  ShieldCheck,
  ChevronRight,
  ArrowRight,
  CarTaxiFront,
  CreditCard,
  RotateCw
} from "lucide-react";
import { getBookings } from "../data/bookings.js";

export default function BookingsListPage() {
  const navigate = useNavigate();
  const [bookings] = useState(() => getBookings());

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 py-4 shadow-2xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
              Trip History
            </span>
            <h1 className="text-2xl font-black text-gray-900 mt-1">
              Your Bookings
            </h1>
          </div>

          <Link
            to="/search"
            className="bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold text-xs px-3.5 py-2 rounded-xl transition-colors shadow-xs"
          >
            New Ride
          </Link>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4">
        {bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const isCompleted = booking.status === "completed";
              const isPaid = booking.paymentStatus === "completed";

              return (
                <div
                  key={booking.id}
                  onClick={() => navigate(`/tracking/${booking.id}`)}
                  className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all active:scale-[0.99] cursor-pointer"
                >
                  {/* Top Bar: Booking ID & Status */}
                  <div className="flex items-center justify-between pb-3 border-b border-gray-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-extrabold text-gray-900 bg-gray-100 px-2 py-0.5 rounded-md">
                        #{booking.bookingNumber}
                      </span>
                      <span className="font-mono font-black text-amber-900 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md text-[11px]">
                        {booking.autoNumber}
                      </span>
                    </div>

                    <span
                      className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                        isCompleted
                          ? "bg-gray-100 text-gray-600"
                          : "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      }`}
                    >
                      {booking.status}
                    </span>
                  </div>

                  {/* Driver & Fare */}
                  <div className="pt-3 flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-extrabold text-sm text-gray-900">
                        {booking.driverName}
                      </h2>
                      <p className="font-mono text-[11px] text-gray-500">
                        {booking.vehicleNumber} • {booking.vehicleType}
                      </p>

                      {/* Locations */}
                      <div className="mt-2 space-y-1 text-xs text-gray-600">
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span className="truncate">{booking.pickup}</span>
                        </div>
                        <div className="flex items-center gap-1.5 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span className="truncate">{booking.destination}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <span className="text-lg font-black text-gray-950 block">
                        ₹{booking.fareEstimate}
                      </span>
                      <span
                        className={`text-[10px] font-bold block mt-0.5 ${
                          isPaid ? "text-emerald-600" : "text-amber-600"
                        }`}
                      >
                        {isPaid ? "Paid ✓" : "Pay Pending"}
                      </span>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between text-xs">
                    <span className="text-[11px] text-gray-400">
                      {new Date(booking.createdAt).toLocaleDateString("en-IN", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                    </span>

                    <div className="flex items-center gap-2">
                      {!isPaid && (
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/payment/${booking.id}`);
                          }}
                          className="text-[11px] font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <CreditCard size={12} />
                          <span>Pay UPI</span>
                        </button>
                      )}
                      <span className="text-gray-400 flex items-center gap-0.5 font-bold text-xs text-gray-600">
                        <span>Track</span>
                        <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State (Section 39) */
          <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-xs mt-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-4">
              🛺
            </div>
            <h2 className="text-base font-extrabold text-gray-900 mb-1">
              No rides yet
            </h2>
            <p className="text-xs text-gray-500 max-w-xs mx-auto mb-6">
              Find an Auto Bhaiya to get started with your first safe ride.
            </p>
            <Link
              to="/search"
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 px-6 rounded-full text-xs transition-colors shadow-xs inline-flex items-center gap-1.5"
            >
              <span>Search Auto Bhaiya</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
