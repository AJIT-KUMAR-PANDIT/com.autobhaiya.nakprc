import React, { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { QRCodeSVG } from "qrcode.react";
import {
  ShieldCheck,
  Star,
  MapPin,
  Clock,
  Car,
  Phone,
  ArrowLeft,
  ArrowRight,
  ExternalLink,
  Users,
  Palette,
  CheckCircle2,
  Share2,
  Copy,
  Check
} from "lucide-react";
import { getAutoById, getVerificationUrl } from "../data/autos.js";

export default function AutoDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const auto = getAutoById(id);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!auto) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center pb-24">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-2xl mb-4">
          ⚠️
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Auto Bhaiya Not Found</h2>
        <p className="text-xs text-gray-500 max-w-xs mb-6">
          Could not locate any Auto Bhaiya with ID or plate "{id}".
        </p>
        <Link
          to="/search"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-full text-xs transition-colors"
        >
          Browse All Autos
        </Link>
      </div>
    );
  }

  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const verifyUrl = `${origin}/verify?auto=${encodeURIComponent(auto.autoNumber)}&hash=${encodeURIComponent(auto.verificationHash)}`;

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(verifyUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 py-3 shadow-2xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Go Back"
          >
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-2">
            <span className="font-mono font-extrabold text-sm text-gray-900 bg-amber-50 border border-amber-300 px-2.5 py-0.5 rounded-lg">
              {auto.autoNumber}
            </span>
            <div className="flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full border border-emerald-200">
              <ShieldCheck size={12} />
              <span>VERIFIED</span>
            </div>
          </div>
          <button
            onClick={handleCopyLink}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors text-gray-600"
            title="Copy verification link"
          >
            {copied ? <Check size={18} className="text-emerald-600" /> : <Share2 size={18} />}
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-18 h-18 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 border-2 border-white shadow-sm flex items-center justify-center text-4xl shrink-0">
              👨‍✈️
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-gray-900 truncate">
                  {auto.driverName}
                </h1>
              </div>
              <p className="text-xs font-mono text-gray-500 font-semibold mt-0.5">
                {auto.vehicleNumber} • {auto.vehicleType}
              </p>

              <div className="flex items-center gap-2 mt-2 text-xs">
                <div className="flex items-center gap-1 bg-amber-400 text-gray-950 font-bold px-2 py-0.5 rounded-md text-xs">
                  <Star size={12} fill="currentColor" strokeWidth={0} />
                  <span>{auto.rating.toFixed(1)}</span>
                </div>
                <span className="text-gray-300">•</span>
                <span className="font-semibold text-gray-700">
                  {auto.trips.toLocaleString()} verified trips
                </span>
              </div>
            </div>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 mt-5 pt-4 border-t border-gray-100 text-center">
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">
                Estimated Fare
              </span>
              <span className="font-black text-gray-900 text-base mt-0.5 block">
                ₹{auto.fareEstimate}
              </span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">
                Pickup ETA
              </span>
              <span className="font-black text-emerald-700 text-base mt-0.5 block">
                {auto.etaMinutes} min
              </span>
            </div>
            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-100">
              <span className="text-[10px] font-bold text-gray-400 uppercase block">
                Capacity
              </span>
              <span className="font-black text-gray-900 text-base mt-0.5 block">
                {auto.seats} Seats
              </span>
            </div>
          </div>
        </div>

        {/* Vehicle & Trip Specs */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">
            Vehicle & Driver Specifications
          </h2>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
              <Car size={16} className="text-gray-400 shrink-0" />
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Model / Fuel</span>
                <span className="font-bold text-gray-800">{auto.name}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
              <Palette size={16} className="text-gray-400 shrink-0" />
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Vehicle Color</span>
                <span className="font-bold text-gray-800">{auto.color}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
              <MapPin size={16} className="text-gray-400 shrink-0" />
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Operating Hub</span>
                <span className="font-bold text-gray-800">{auto.area}</span>
              </div>
            </div>

            <div className="flex items-center gap-2 p-2.5 bg-gray-50 rounded-xl">
              <Phone size={16} className="text-gray-400 shrink-0" />
              <div>
                <span className="text-[10px] text-gray-400 block font-medium">Contact</span>
                <span className="font-bold text-gray-800">{auto.phone}</span>
              </div>
            </div>
          </div>

          {/* Pickup note */}
          {auto.pickupNote && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs">
              <span className="font-bold text-amber-900 block mb-0.5">Pickup Landmark:</span>
              <p className="text-amber-800 font-medium">{auto.pickupNote}</p>
            </div>
          )}

          {/* Popular Destination Hints */}
          {auto.destinationHints?.length > 0 && (
            <div className="pt-2">
              <span className="text-[11px] font-bold text-gray-400 block mb-1.5">
                Frequent Routes / Drop Points:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {auto.destinationHints.map((hint, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] font-semibold bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full"
                  >
                    {hint}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* OFFICIAL QR IDENTITY CARD (Section 14 & 15) */}
        <div id="qr-verify" className="bg-gradient-to-b from-gray-900 via-gray-900 to-black text-white rounded-3xl p-6 shadow-xl border border-gray-800 relative overflow-hidden">
          {/* Decorative badges */}
          <div className="flex items-center justify-between pb-4 border-b border-gray-800">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400">
                OFFICIAL IDENTITY CARD
              </span>
              <h3 className="text-xl font-black tracking-tight text-white mt-0.5">
                AUTO BHAIYA
              </h3>
            </div>
            <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full px-2.5 py-1 text-[10px] font-mono font-bold flex items-center gap-1">
              <ShieldCheck size={14} />
              <span>REGISTRY ID</span>
            </div>
          </div>

          {/* QR Code Presentation */}
          <div className="my-6 flex flex-col items-center">
            <div className="bg-white p-4 rounded-2xl shadow-md border-4 border-emerald-400/80">
              <QRCodeSVG
                value={verifyUrl}
                size={180}
                level="M"
                includeMargin={false}
              />
            </div>
            <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase mt-3">
              Scan to verify this auto
            </span>
            <div className="mt-1 flex items-center gap-2">
              <span className="font-mono font-black text-lg text-amber-400 tracking-wider">
                {auto.autoNumber}
              </span>
              <span className="text-gray-500">•</span>
              <span className="font-mono text-xs text-gray-300">
                {auto.verificationHash}
              </span>
            </div>
          </div>

          {/* Card footer actions */}
          <div className="pt-4 border-t border-gray-800 flex items-center justify-between gap-3">
            <button
              onClick={() => navigate(getVerificationUrl(auto))}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
            >
              <ShieldCheck size={16} />
              <span>Open Verification</span>
            </button>

            <button
              onClick={handleCopyLink}
              className="py-3 px-3 rounded-xl border border-gray-700 text-gray-300 hover:text-white hover:border-gray-500 text-xs font-bold transition-colors flex items-center gap-1"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy Link"}</span>
            </button>
          </div>
        </div>

        {/* Primary Bottom Floating / Action Bar */}
        <div className="pt-2 flex flex-col gap-2.5">
          <button
            onClick={() => navigate(`/booking/${auto.id}`)}
            className="w-full bg-amber-400 hover:bg-amber-500 active:scale-[0.98] text-gray-950 font-black py-4 px-6 rounded-2xl text-base shadow-lg shadow-amber-400/30 flex items-center justify-center gap-2 transition-all"
          >
            <span>Book This Auto Now</span>
            <ArrowRight size={20} />
          </button>

          <a
            href={`tel:${auto.phone.replace(/[\s-]/g, "")}`}
            className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold py-3 px-4 rounded-2xl text-xs text-center transition-colors flex items-center justify-center gap-2"
          >
            <Phone size={14} />
            <span>Call Driver ({auto.driverName})</span>
          </a>
        </div>
      </div>
    </div>
  );
}
