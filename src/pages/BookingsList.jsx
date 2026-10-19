import React, { useState, useEffect } from "react";
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
import { getBookings, subscribeToBookingUpdates } from "../data/bookings.js";

export default function BookingsListPage() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(() => getBookings());

  const refresh = () => {
    setBookings(getBookings());
  };

  useEffect(() => {
    // Listen to real-time updates (Appwrite Realtime + local updates)
    const unsub = subscribeToBookingUpdates(null, () => {
      refresh();
    });
    return unsub;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-32" data-testid="bookings-list-page">
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
            data-testid="new-ride-btn"
          >
            New Ride
          </Link>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4">
        {bookings && bookings.length > 0 ? (
          <div className="space-y-3">
            {bookings.map((booking) => {
              const isPaid = booking.paymentStatus === "completed";

              return (
                <div
                  key={booking.id}
                  onClick={() => navigate(`/tracking/${booking.id}`)}
                  className="bg-white border border-gray-200/80 rounded-2xl p-4 shadow-xs hover:shadow-md transition-all cursor-pointer active:scale-[0.99] group"
                  data-testid="booking-list-card"
                >
                  {/* Card Header */}
                  <div className="flex items-center justify-between pb-2.5 border-b border-gray-100 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-gray-900 text-xs">
                        #{booking.bookingNumber}
                      </span>
                      <span className="font-mono text-gray-400 text-[10px]">
                        • {booking.autoNumber}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                          booking.status === "completed"
                            ? "bg-gray-100 text-gray-700"
                            : booking.status === "started"
                            ? "bg-blue-50 text-blue-700"
                            : "bg-emerald-50 text-emerald-700"
                        }`}
                      >
                        {booking.status}
                      </span>
                    </div>
                  </div>

                  {/* Trip details */}
                  <div className="pt-3 flex items-start justify-between gap-3 text-xs">
                    <div className="space-y-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-emerald-500 shrink-0" />
                        <span className="font-semibold text-gray-800 truncate">
                          {booking.pickup}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={13} className="text-amber-500 shrink-0" />
                        <span className="font-semibold text-gray-800 truncate">
                          {booking.destination}
                        </span>
                      </div>
                      <p className="text-[11px] text-gray-500 pt-1">
                        Driver: <strong className="text-gray-800">{booking.driverName}</strong>
                      </p>
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
                        {isPaid ? "Paid" : "Pay Pending"}
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
                      <span className="flex items-center gap-0.5 font-bold text-xs text-gray-600">
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
          /* Empty State - NO EMOJIS */
          <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center shadow-xs mt-6">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-emerald-200">
              <CarTaxiFront size={30} strokeWidth={2.2} />
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
