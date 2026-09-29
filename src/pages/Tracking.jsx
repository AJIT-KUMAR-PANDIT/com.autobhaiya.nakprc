import React, { useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ShieldCheck,
  CheckCircle2,
  Clock,
  Phone,
  MapPin,
  CreditCard,
  ArrowRight,
  RotateCw,
  AlertCircle
} from "lucide-react";
import { getBookingById, updateBookingStatus } from "../data/bookings.js";

const STEPS = [
  { key: "created", label: "Booking created", desc: "Order registered in app" },
  { key: "contacting", label: "Driver contacted", desc: "Connecting with nearest auto" },
  { key: "accepted", label: "Ride accepted", desc: "Driver assigned & confirmed" },
  { key: "arriving", label: "Auto arriving", desc: "Bhaiya en route to pickup" },
  { key: "started", label: "Ride started", desc: "Trip in progress" },
  { key: "completed", label: "Ride completed", desc: "Arrived at destination" }
];

export default function TrackingPage() {
  const { id } = useParams();
  const initialBooking = getBookingById(id);
  const [currentBooking, setCurrentBooking] = useState(initialBooking);

  const booking = currentBooking;

  if (!booking) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center pb-24">
        <AlertCircle size={48} className="text-red-500 mb-3" />
        <h2 className="text-xl font-bold text-gray-900 mb-1">Booking Not Found</h2>
        <p className="text-xs text-gray-500 mb-5">
          No active booking with ID "{id}" was found in local storage.
        </p>
        <Link
          to="/bookings"
          className="bg-emerald-600 text-white font-bold px-6 py-2.5 rounded-full text-xs"
        >
          View All Bookings
        </Link>
      </div>
    );
  }

  const currentStepIndex = STEPS.findIndex((s) => s.key === booking.status);
  const safeIndex = currentStepIndex >= 0 ? currentStepIndex : 2; // fallback to accepted

  const handleAdvanceStatus = () => {
    const nextIndex = Math.min(safeIndex + 1, STEPS.length - 1);
    const nextStatus = STEPS[nextIndex].key;
    const updated = updateBookingStatus(booking.id, nextStatus);
    if (updated) setCurrentBooking({ ...updated });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 py-3 shadow-2xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div>
            <span className="text-[10px] font-mono font-bold text-gray-400 uppercase">
              Booking ID
            </span>
            <h1 className="font-extrabold text-base text-gray-900 leading-none">
              #{booking.bookingNumber}
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <span className="font-mono font-black text-xs text-gray-950 bg-amber-50 border border-amber-300 px-2.5 py-1 rounded-lg">
              {booking.autoNumber}
            </span>
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-1 rounded-full border border-emerald-200">
              <ShieldCheck size={12} />
              <span>VERIFIED</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Status Highlight Banner */}
        <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white rounded-3xl p-5 shadow-md relative overflow-hidden">
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-extrabold tracking-widest text-emerald-400 uppercase">
                CURRENT RIDE STATUS
              </span>
              <span className="text-xs font-mono text-gray-300 font-bold">
                Fare: ₹{booking.fareEstimate}
              </span>
            </div>

            <h2 className="text-2xl font-black tracking-tight text-white capitalize">
              {STEPS[safeIndex]?.label}
            </h2>
            <p className="text-xs text-gray-300 mt-0.5">
              {STEPS[safeIndex]?.desc}
            </p>

            <div className="mt-4 pt-3 border-t border-gray-700 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-gray-300">
                <Clock size={14} className="text-emerald-400" />
                <span>ETA: ~4 mins</span>
              </div>
              <span className="text-[11px] font-bold bg-white/10 px-2.5 py-0.5 rounded-full text-white">
                Payment: {booking.paymentStatus === "completed" ? "Paid ✓" : "Pending (₹" + booking.fareEstimate + ")"}
              </span>
            </div>
          </div>
        </div>

        {/* Stepper Progress Indicator (Section 18) */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <span className="text-xs font-black uppercase tracking-wider text-gray-400">
              Ride Progress Tracker
            </span>
            {safeIndex < STEPS.length - 1 && (
              <button
                onClick={handleAdvanceStatus}
                className="text-[10px] font-bold text-emerald-700 hover:text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md flex items-center gap-1"
                title="Simulate next ride stage"
              >
                <RotateCw size={10} />
                <span>Next Stage</span>
              </button>
            )}
          </div>

          <div className="space-y-4 pl-2">
            {STEPS.map((step, idx) => {
              const isPast = idx < safeIndex;
              const isCurrent = idx === safeIndex;

              return (
                <div key={step.key} className="flex items-start gap-3 relative">
                  {/* Vertical connector line */}
                  {idx < STEPS.length - 1 && (
                    <div
                      className={`absolute left-[11px] top-6 w-0.5 h-7 ${
                        isPast ? "bg-emerald-500" : "bg-gray-200"
                      }`}
                    />
                  )}

                  {/* Bullet */}
                  <div className="relative z-10 shrink-0 mt-0.5">
                    {isPast ? (
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow-xs">
                        <CheckCircle2 size={15} />
                      </div>
                    ) : isCurrent ? (
                      <div className="w-6 h-6 rounded-full bg-amber-400 text-gray-950 flex items-center justify-center font-bold text-xs ring-4 ring-amber-400/20">
                        ●
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full border-2 border-gray-300 bg-white flex items-center justify-center">
                        <span className="w-2 h-2 rounded-full bg-gray-200" />
                      </div>
                    )}
                  </div>

                  {/* Label & Details */}
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-xs font-extrabold ${
                        isCurrent
                          ? "text-gray-900 text-sm"
                          : isPast
                          ? "text-gray-700"
                          : "text-gray-400"
                      }`}
                    >
                      {step.label}
                    </p>
                    <p className="text-[11px] text-gray-400 mt-0.2">
                      {step.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Driver & Trip Info Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-400 flex items-center justify-center text-2xl shrink-0">
                👨‍✈️
              </div>
              <div>
                <h3 className="font-extrabold text-sm text-gray-900">
                  {booking.driverName}
                </h3>
                <p className="font-mono text-xs text-gray-500">
                  {booking.vehicleNumber} • {booking.vehicleType}
                </p>
              </div>
            </div>

            <a
              href={`tel:${booking.driverPhone.replace(/[\s-]/g, "")}`}
              className="w-10 h-10 rounded-full bg-emerald-50 hover:bg-emerald-100 text-emerald-700 flex items-center justify-center transition-colors shadow-2xs"
              title="Call driver"
            >
              <Phone size={18} />
            </a>
          </div>

          {/* Locations */}
          <div className="space-y-2 text-xs">
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-emerald-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Pickup</span>
                <span className="font-bold text-gray-800">{booking.pickup}</span>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <MapPin size={14} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Destination</span>
                <span className="font-bold text-gray-800">{booking.destination}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Payment CTA */}
        <div className="pt-2 flex flex-col gap-2.5">
          <Link
            to={`/payment/${booking.id}`}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-black py-4 px-6 rounded-2xl text-sm shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all"
          >
            <CreditCard size={18} />
            <span>Pay Fare (₹{booking.fareEstimate}) via UPI QR</span>
            <ArrowRight size={18} />
          </Link>

          <Link
            to="/bookings"
            className="w-full py-3 px-4 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-100 font-bold text-xs text-center transition-colors"
          >
            View All My Bookings
          </Link>
        </div>
      </div>
    </div>
  );
}
