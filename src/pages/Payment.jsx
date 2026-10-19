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
  Smartphone,
  PhoneCall,
  MessageCircle,
  User,
  ShieldAlert,
  Info
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
  const [configError, setConfigError] = useState("");

  // Fetch JSON-based payment configuration
  useEffect(() => {
    fetch("/data/payment.json")
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load /data/payment.json");
        return res.json();
      })
      .then((data) => {
        if (data && typeof data.upiId === "string" && data.upiId.includes("@")) {
          setPaymentConfig(data);
          setConfigError("");
        } else {
          setConfigError("The UPI ID in /data/payment.json is missing or not a valid Virtual Payment Address.");
        }
      })
      .catch((err) => {
        console.warn("Could not fetch /data/payment.json, using fallback configuration:", err);
      });
  }, []);

  const isUpiValid = Boolean(paymentConfig.upiId && paymentConfig.upiId.includes("@") && !configError);

  const amount = booking?.fareEstimate || 120;
  const note = `Auto Bhaiya ride ${booking ? "#" + booking.bookingNumber : ""}`;

  // Standard UPI URI generation
  const upiUrl = isUpiValid
    ? `upi://pay?pa=${encodeURIComponent(paymentConfig.upiId)}&pn=${encodeURIComponent(
        paymentConfig.merchantName
      )}&am=${amount}&cu=${paymentConfig.currency || "INR"}&tn=${encodeURIComponent(note)}`
    : "";

  const handleCopyUpi = () => {
    if (!isUpiValid) return;
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
    <div className="min-h-screen bg-gray-50 pb-32" data-testid="payment-page">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 py-3 shadow-2xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Back"
            data-testid="payment-back-btn"
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
                Trip Route
              </span>
              <span className="font-semibold text-gray-700 block truncate max-w-[140px]">
                {booking.pickup} → {booking.destination}
              </span>
            </div>
          </div>
        )}

        {/* Contact Auto Bhaiya Before Paying */}
        {booking && (
          <div className="bg-amber-50/80 border border-amber-200/90 rounded-2xl p-3.5 shadow-2xs space-y-2.5">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5 min-w-0">
                <div className="w-8 h-8 rounded-full bg-amber-400 text-gray-950 flex items-center justify-center font-bold text-xs shrink-0">
                  <User size={16} strokeWidth={2.4} />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-black uppercase text-amber-800 tracking-wide block">
                    Verify Driver First
                  </span>
                  <span className="text-xs font-bold text-gray-900 block truncate">
                    {booking.driverName} ({booking.autoNumber})
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <a
                  href={`tel:${booking.driverPhone ? booking.driverPhone.replace(/[\s-]/g, "") : ""}`}
                  className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold text-xs px-3 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs transition-all"
                  title="Call Auto Bhaiya"
                  data-testid="pay-call-bhaiya-btn"
                >
                  <PhoneCall size={13} />
                  <span>Call</span>
                </a>

                <a
                  href={`https://wa.me/${(booking.driverPhone || "").replace(/[^0-9]/g, "")}?text=${encodeURIComponent(
                    `Namaste ${booking.driverName} Bhaiya, I am about to pay the fare for ride #${booking.bookingNumber}. Please confirm you are available for pickup.`
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs px-2.5 py-1.5 rounded-xl flex items-center gap-1 shadow-2xs transition-all"
                  title="WhatsApp Auto Bhaiya"
                  data-testid="pay-wa-bhaiya-btn"
                >
                  <MessageCircle size={13} />
                  <span>WhatsApp</span>
                </a>
              </div>
            </div>

            <p className="text-[11px] text-amber-900/80 leading-tight">
              Please contact Auto Bhaiya to confirm their availability before completing your fare payment.
            </p>
          </div>
        )}

        {/* UPI Invalid Configuration Warning */}
        {!isUpiValid && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 text-xs text-red-800 space-y-2">
            <div className="flex items-center gap-2 font-black text-red-900">
              <ShieldAlert size={16} />
              <span>UPI Configuration Required</span>
            </div>
            <p className="leading-relaxed">
              The UPI merchant ID is currently missing or invalid. To enable automated payments, please update <code>public/data/payment.json</code> with a valid UPI ID (e.g. <code>yourname@upi</code>).
            </p>
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

          {/* Payment Status State Banner */}
          <div className="mt-4 pt-3 border-t border-emerald-500/60 flex items-center justify-center gap-1.5 text-xs font-bold">
            {isPaidConfirmed ? (
              <span className="flex items-center gap-1.5 bg-white text-emerald-800 px-3 py-1 rounded-full shadow-2xs font-extrabold">
                <CheckCircle2 size={14} className="text-emerald-600" />
                <span>Marked as Paid by Rider</span>
              </span>
            ) : (
              <span className="flex items-center gap-1.5 bg-emerald-800/60 text-emerald-100 px-3 py-1 rounded-full border border-emerald-400/40">
                <Clock size={13} className="text-amber-300" />
                <span>Awaiting payment completion</span>
              </span>
            )}
          </div>
        </div>

        {/* QR Code Section */}
        <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-xs text-center space-y-4">
          <div>
            <h2 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">
              Scan & Pay via any UPI App
            </h2>
            <p className="text-xs text-gray-500 mt-0.5">
              Google Pay, PhonePe, Paytm, BHIM, Navi or Cred
            </p>
          </div>

          {/* UPI QR Display */}
          <div className="flex justify-center my-2">
            {isUpiValid ? (
              <div className="bg-white p-4 rounded-2xl border-4 border-emerald-500/80 shadow-md">
                <QRCodeSVG
                  value={upiUrl}
                  size={190}
                  level="M"
                  includeMargin={false}
                />
              </div>
            ) : (
              <div className="w-[190px] h-[190px] bg-gray-100 border-2 border-dashed border-gray-300 rounded-2xl flex flex-col items-center justify-center p-4 text-center text-xs text-gray-400">
                <ShieldAlert size={28} className="mb-2 text-gray-400" />
                <span>QR disabled: Invalid UPI ID</span>
              </div>
            )}
          </div>

          {/* UPI ID Pill & Copy Button */}
          {isUpiValid && (
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
                data-testid="copy-upi-id-btn"
              >
                {copied ? (
                  <>
                    <Check size={14} />
                    <span>Copied</span>
                  </>
                ) : (
                  <>
                    <Copy size={14} />
                    <span>Copy ID</span>
                  </>
                )}
              </button>
            </div>
          )}

          {copied && (
            <p className="text-[11px] font-bold text-emerald-700 animate-in fade-in">
              UPI ID copied to clipboard. Paste into your preferred payment application.
            </p>
          )}

          {/* Direct Pay via UPI App Button */}
          {isUpiValid ? (
            <a
              href={upiUrl}
              className="w-full bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold py-3.5 px-4 rounded-xl text-sm shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all block"
              data-testid="pay-via-upi-app-btn"
            >
              <Smartphone size={18} />
              <span>Open UPI App (₹{amount})</span>
            </a>
          ) : (
            <button
              disabled
              className="w-full bg-gray-200 text-gray-400 font-bold py-3.5 px-4 rounded-xl text-sm cursor-not-allowed block"
            >
              Payment Disabled (Invalid UPI Config)
            </button>
          )}
        </div>

        {/* User Confirmation / Limitation Notice */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-3">
          <div className="flex items-start gap-2 text-xs text-gray-500 leading-relaxed">
            <Info size={16} className="text-gray-400 shrink-0 mt-0.5" />
            <p>
              In this application, payments are transferred peer-to-peer directly to Auto Bhaiya via your UPI app. Please mark below after completing your transfer.
            </p>
          </div>

          {!isPaidConfirmed ? (
            <button
              onClick={handleUserConfirmPayment}
              className="w-full bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
              data-testid="confirm-payment-completed-btn"
            >
              <CheckCircle2 size={16} />
              <span>I Have Completed Payment</span>
            </button>
          ) : (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-center">
              <span className="text-xs font-bold text-emerald-800 block">
                Payment marked as completed by rider
              </span>
              <p className="text-[11px] text-emerald-700/80 mt-0.5">
                Thank you for riding with Auto Bhaiya by NAKPRC.
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
