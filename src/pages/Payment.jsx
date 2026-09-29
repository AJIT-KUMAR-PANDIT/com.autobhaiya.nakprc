import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  ArrowLeft,
  Copy,
  Check,
  Clock,
  CheckCircle2,
  AlertCircle,
  Smartphone
} from "lucide-react";
import { getBookingById, updatePaymentStatus } from "../data/bookings.js";

const DEFAULT_PAYMENT_CONFIG = {
  upiId: "autobhaiya@upi",
  merchantName: "Auto Bhaiya by NAKPRC",
  currency: "INR",
  note: "Auto Bhaiya ride payment"
};

export default function PaymentPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const booking = getBookingById(id);
  const [paymentConfig, setPaymentConfig] = useState(DEFAULT_PAYMENT_CONFIG);
  const [copied, setCopied] = useState(false);
  const [isPaidConfirmed, setIsPaidConfirmed] = useState(
    booking?.paymentStatus === "completed"
  );

  // Fetch JSON-based payment configuration (Section 19)
  useEffect(() => {
    fetch("/data/payment.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load payment.json");
        return res.json();
      })
      .then((data) => {
        if (data && data.upiId) {
          setPaymentConfig(data);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch /data/payment.json, using fallback configuration:", err);
      });
  }, []);

  const amount = booking?.fareEstimate || 120;
  const note = `Auto Bhaiya ride ${booking ? "#" + booking.bookingNumber : ""}`;

  // Standard UPI URI generation (Section 20)
  const upiUrl = `upi://pay?pa=${encodeURIComponent(paymentConfig.upiId)}&pn=${encodeURIComponent(
    paymentConfig.merchantName
  )}&am=${amount}&cu=${paymentConfig.currency || "INR"}&tn=${encodeURIComponent(note)}`;

  const handleCopyUpi = () => {
    navigator.clipboard?.writeText(paymentConfig.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleUserConfirmPayment = () => {
    setIsPaidConfirmed(true);
    if (booking) {
      updatePaymentStatus(booking.id, "completed");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 py-3 shadow-2xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-extrabold text-base text-gray-900">
            UPI Fare Payment
          </h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Ride Context Header */}
        {booking && (
          <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-gray-400 font-bold uppercase block">
                Booking Reference
              </span>
              <span className="font-mono font-bold text-gray-900 text-sm">
                #{booking.bookingNumber}
              </span>
              <p className="text-gray-500 mt-0.5">
                Bhaiya: <strong className="text-gray-800">{booking.driverName}</strong> ({booking.autoNumber})
              </p>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-bold uppercase block">
                Trip
              </span>
              <span className="font-semibold text-gray-700 block truncate max-w-[120px]">
                {booking.pickup} → {booking.destination}
              </span>
            </div>
          </div>
        )}

        {/* Payment Amount Card */}
        <div className="bg-gradient-to-tr from-emerald-700 to-emerald-600 text-white rounded-3xl p-6 shadow-lg shadow-emerald-700/20 text-center relative overflow-hidden">
          <span className="text-xs font-bold uppercase tracking-widest text-emerald-100">
            Amount Due
          </span>
          <div className="text-4xl font-black tracking-tight mt-1 mb-1">
            ₹{amount}
          </div>
          <p className="text-xs text-emerald-100/90 font-medium">
            Pay directly to Auto Bhaiya via any UPI application
          </p>

          {/* Payment Status State Banner (Section 22) */}
          <div className="mt-4 pt-3 border-t border-emerald-500/60 flex items-center justify-center gap-1.5 text-xs font-bold">
            {isPaidConfirmed ? (
              <span className="flex items-center gap-1.5 bg-white text-emerald-800 px-3 py-1 rounded-full shadow-2xs font-extrabold">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Payment Confirmed by Rider</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-emerald-800/60 text-emerald-100 px-3 py-1 rounded-full border border-emerald-400/40">
                <Clock size={13} className="animate-spin text-amber-300" />
                <span>Awaiting payment confirmation</span>
              </span>
            )}
          </div>
        </div>

        {/* QR Code Section (Section 21) */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs text-center space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
              Scan & Pay via any UPI App
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Google Pay, PhonePe, Paytm, BHIM or Cred
            </p>
          </div>

          {/* UPI QR Display */}
          <div className="flex justify-center my-2">
            <div className="bg-white p-4 rounded-2xl border-4 border-emerald-500/80 shadow-md">
              <QRCodeSVG
                value={upiUrl}
                size={190}
                level="M"
                includeMargin={false}
              />
            </div>
          </div>

          {/* UPI ID Pill & Copy Button (Section 21) */}
          <div className="bg-gray-50 border border-gray-200 rounded-2xl p-3 flex items-center justify-between gap-2 max-w-xs mx-auto">
            <div className="text-left min-w-0 flex-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">
                UPI ID / VPA
              </span>
              <span className="font-mono font-bold text-gray-900 text-xs truncate block">
                {paymentConfig.upiId}
              </span>
            </div>

            <button
              onClick={handleCopyUpi}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                copied
                  ? "bg-emerald-600 text-white shadow-2xs"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-800"
              }`}
            >
              {copied ? (
                <>
                  <Check size={14} />
                  <span>Copied!</span>
                </>
              ) : (
                <>
                  <Copy size={14} />
                  <span>Copy ID</span>
                </>
              )}
            </button>
          </div>

          {copied && (
            <p className="text-[11px] font-bold text-emerald-700 animate-in fade-in">
              UPI ID copied to clipboard! Paste it into your UPI app.
            </p>
          )}

          {/* Direct Pay via UPI App Button (Section 21) */}
          <a
            href={upiUrl}
            className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold py-3.5 px-4 rounded-xl text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all block"
          >
            <Smartphone size={18} />
            <span>Pay via UPI App (₹{amount})</span>
          </a>
        </div>

        {/* User Confirmation / Limitation Notice (Section 22) */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
            <AlertCircle size={16} className="text-amber-500 shrink-0 mt-0.5" />
            <p>
              In this free MVP, payments are processed directly via your UPI app without a central intermediary. Please confirm after completing transfer.
            </p>
          </div>

          {!isPaidConfirmed ? (
            <button
              onClick={handleUserConfirmPayment}
              className="w-full bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
            >
              <CheckCircle2 size={16} />
              <span>I Have Completed Payment</span>
            </button>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-xs font-bold text-emerald-800 block">
                ✓ You marked this ride as paid!
              </span>
              <p className="text-[11px] text-emerald-700/80 mt-0.5">
                Thank you for riding with Auto Bhaiya.
              </p>
            </div>
          )}

          {booking && (
            <Link
              to={`/tracking/${booking.id}`}
              className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-700 hover:bg-gray-50 font-bold text-xs text-center transition-colors block"
            >
              Return to Ride Tracking
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
