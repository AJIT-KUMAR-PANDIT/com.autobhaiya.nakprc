import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams, Link } from "react-router-dom";
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
  MessageCircle,
  Copy,
  Check,
  Share2,
  Navigation,
  Eye,
  EyeOff,
  AlertTriangle,
  User,
  Fuel,
  Info
} from "lucide-react";
import { getAutoById, getVerificationUrl } from "../data/autos.js";

export default function AutoDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);
  const [showRawHash, setShowRawHash] = useState(false);

  const auto = getAutoById(id);

  // Editable trip details for Personal Booking Touch (PBT) and Google Maps
  const [pickup, setPickup] = useState(searchParams.get("pickup") || auto?.area || "Sakchi Golchakkar");
  const [destination, setDestination] = useState(searchParams.get("destination") || auto?.destinationHints?.[0] || "Bistupur Market");

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);

  if (!auto) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 text-center pb-24">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle size={32} />
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1">Auto Bhaiya Not Found</h2>
        <p className="text-xs text-gray-500 max-w-xs mb-6">
          Could not locate any Auto Bhaiya with identifier "{id}".
        </p>
        <Link
          to="/search"
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-3 rounded-full text-xs transition-colors"
          data-testid="back-to-search-btn"
        >
          Browse Verified Autos
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

  // WhatsApp Personal Booking Touch (PBT) URL
  const cleanPhone = (auto.phone || "").replace(/[^0-9]/g, "");
  const pbtMessage = encodeURIComponent(
    `Namaste ${auto.driverName} Bhaiya (Auto ${auto.autoNumber}), I want to book a ride from ${pickup || auto.area} to ${destination || "my destination"} via Personal Booking Touch (PBT). Are you available?`
  );
  const pbtWhatsAppUrl = `https://wa.me/${cleanPhone}?text=${pbtMessage}`;

  // External Google Maps directions handoff (no Ola Maps, no in-app API key needed)
  const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}`;

  const categoryColor = auto.category === "Cargo" ? "bg-purple-100 text-purple-900 border-purple-200" : "bg-blue-100 text-blue-900 border-blue-200";
  const fuelColor =
    auto.fuelType === "Electric"
      ? "bg-emerald-100 text-emerald-900 border-emerald-200"
      : auto.fuelType === "CNG"
      ? "bg-teal-100 text-teal-900 border-teal-200"
      : auto.fuelType === "Hydrogen"
      ? "bg-sky-100 text-sky-900 border-sky-200"
      : "bg-amber-100 text-amber-900 border-amber-200";

  return (
    <div className="min-h-screen bg-gray-50 pb-36" data-testid="auto-profile-page">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 py-3 shadow-2xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Go Back"
            data-testid="profile-back-btn"
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
            data-testid="share-profile-btn"
          >
            {copied ? <Check size={18} className="text-emerald-600" /> : <Share2 size={18} />}
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Profile Identity Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs relative overflow-hidden">
          <div className="flex items-start gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-400 border border-amber-300 shadow-2xs flex items-center justify-center text-gray-950 shrink-0">
              <User size={32} strokeWidth={2.2} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-1">
                <h1 className="text-lg font-black text-gray-900 truncate">
                  {auto.driverName}
                </h1>
                <span
                  className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 ${
                    auto.available
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : "bg-gray-100 text-gray-600 border-gray-200"
                  }`}
                >
                  {auto.available ? "Available Now" : "Currently Busy"}
                </span>
              </div>

              <p className="text-xs font-mono text-gray-500 font-semibold mt-0.5">
                {auto.vehicleNumber} • {auto.name}
              </p>

              {/* Category and Fuel Badges */}
              <div className="flex flex-wrap items-center gap-1.5 mt-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${categoryColor}`}>
                  {auto.category || "Passenger"}
                </span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border flex items-center gap-1 ${fuelColor}`}>
                  <Fuel size={10} />
                  <span>{auto.fuelType || "CNG"}</span>
                </span>
                <div className="flex items-center gap-1 bg-amber-400 text-gray-950 font-bold px-2 py-0.5 rounded-md text-[10px]">
                  <Star size={10} fill="currentColor" strokeWidth={0} />
                  <span>{auto.rating.toFixed(1)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Metrics summary */}
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
                ~{auto.etaMinutes} min
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

          <div className="mt-3 text-[10px] text-gray-400 text-center flex items-center justify-center gap-1">
            <Info size={11} />
            <span>ETA and fare are local estimates, not live satellite GPS tracking.</span>
          </div>
        </div>

        {/* Trip Route Configuration & PBT (Personal Booking Touch) */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-3.5">
          <div className="flex items-center justify-between pb-2 border-b border-gray-100">
            <div>
              <h2 className="text-xs font-black uppercase tracking-wider text-gray-900">
                Plan Trip & Personal Booking Touch (PBT)
              </h2>
              <p className="text-[11px] text-gray-500 mt-0.5">
                Set pickup & drop to contact driver directly via WhatsApp or open Google Maps.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                Pickup Location
              </label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-3 text-emerald-600" />
                <input
                  type="text"
                  value={pickup}
                  onChange={(e) => setPickup(e.target.value)}
                  placeholder="Enter pickup point"
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-emerald-500 outline-none"
                  data-testid="profile-pickup-input"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-gray-500 uppercase block mb-1">
                Destination Point
              </label>
              <div className="relative">
                <MapPin size={14} className="absolute left-3 top-3 text-amber-500" />
                <input
                  type="text"
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder="Enter destination"
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-900 focus:bg-white focus:border-amber-500 outline-none"
                  data-testid="profile-destination-input"
                />
              </div>
            </div>
          </div>

          {/* Action Row: WhatsApp PBT + Google Maps Navigation */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {/* WhatsApp PBT Button */}
            <a
              href={pbtWhatsAppUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white font-extrabold py-3 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              data-testid="pbt-whatsapp-btn"
            >
              <MessageCircle size={15} />
              <span>WhatsApp (PBT)</span>
            </a>

            {/* External Google Maps Button */}
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-blue-600 hover:bg-blue-700 active:scale-[0.98] text-white font-extrabold py-3 px-3 rounded-2xl text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all"
              data-testid="google-maps-btn"
              title="Open directions in Google Maps app or web"
            >
              <Navigation size={15} />
              <span>Google Maps</span>
            </a>
          </div>

          <p className="text-[10px] text-gray-400 text-center leading-relaxed">
            Opens external Google Maps directions link directly. No in-app map API quota or key required.
          </p>
        </div>

        {/* Specifications & Operating Area */}
        <div className="bg-white border border-gray-200 rounded-2xl p-4 shadow-xs space-y-3">
          <h2 className="text-xs font-black uppercase tracking-wider text-gray-400">
            Vehicle & Driver Specifications
          </h2>
          <div className="grid grid-cols-2 gap-2.5 text-xs">
            <div className="p-2.5 bg-gray-50 rounded-xl">
              <span className="text-[10px] text-gray-400 block font-medium">Category</span>
              <span className="font-bold text-gray-800">{auto.category || "Passenger Auto"}</span>
            </div>

            <div className="p-2.5 bg-gray-50 rounded-xl">
              <span className="text-[10px] text-gray-400 block font-medium">Fuel / Energy</span>
              <span className="font-bold text-gray-800">{auto.fuelType || "CNG"}</span>
            </div>

            <div className="p-2.5 bg-gray-50 rounded-xl">
              <span className="text-[10px] text-gray-400 block font-medium">Operating Hub</span>
              <span className="font-bold text-gray-800">{auto.area}</span>
            </div>

            <div className="p-2.5 bg-gray-50 rounded-xl">
              <span className="text-[10px] text-gray-400 block font-medium">Registration</span>
              <span className="font-mono font-bold text-gray-800">{auto.vehicleNumber}</span>
            </div>
          </div>

          {auto.pickupNote && (
            <div className="p-3 bg-amber-50/70 border border-amber-200/70 rounded-xl text-xs">
              <span className="font-bold text-amber-900 block mb-0.5">Pickup Landmark:</span>
              <p className="text-amber-800 font-medium">{auto.pickupNote}</p>
            </div>
          )}
        </div>

        {/* DISTINCT VERIFICATION QR CODE (Tied to Auto ID, Number & Hash) */}
        <div id="qr-verify" className="bg-gray-900 text-white rounded-3xl p-6 shadow-xl border border-gray-800 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-800">
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 block">
                OFFICIAL IDENTITY QR
              </span>
              <h3 className="text-base font-black text-white mt-0.5">
                Auto Bhaiya #{auto.autoNumber}
              </h3>
            </div>
            <div className="bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full px-2.5 py-1 text-[10px] font-mono font-bold flex items-center gap-1">
              <ShieldCheck size={13} />
              <span>REGISTRY CODE</span>
            </div>
          </div>

          {/* QR Code */}
          <div className="flex flex-col items-center my-3">
            <div className="bg-white p-4 rounded-2xl shadow-md border-4 border-emerald-400/80">
              <QRCodeSVG
                value={verifyUrl}
                size={180}
                level="M"
                includeMargin={false}
              />
            </div>
            <span className="text-[10px] font-mono tracking-wider text-gray-400 uppercase mt-3">
              Scan with camera or scanner to verify
            </span>

            {/* Verification Security Hash - Masked by default */}
            <div className="mt-2 flex items-center gap-2 bg-gray-800/80 px-3 py-1.5 rounded-xl border border-gray-700/80">
              <span className="text-[10px] text-gray-400 font-medium">Hash:</span>
              <span className="font-mono text-xs font-bold text-amber-400">
                {showRawHash ? auto.verificationHash : `${auto.verificationHash.slice(0, 5)}••••••••`}
              </span>
              <button
                type="button"
                onClick={() => setShowRawHash((v) => !v)}
                className="text-gray-400 hover:text-white p-0.5"
                title={showRawHash ? "Hide hash" : "View raw hash"}
              >
                {showRawHash ? <EyeOff size={13} /> : <Eye size={13} />}
              </button>
            </div>
          </div>

          {/* Security Boundary Notice */}
          <div className="p-3 bg-gray-800/70 border border-gray-700 rounded-xl text-[11px] text-gray-300 leading-relaxed">
            <span className="font-bold text-amber-400 block mb-0.5">Security Boundary:</span>
            Frontend verification confirms that the Auto Bhaiya number and security hash match local bundled registry records. This verifies dataset membership, but cannot prevent someone copying a printed QR sticker. It is not server-tamper-proof.
          </div>

          <div className="pt-2 flex items-center gap-2">
            <button
              onClick={() => navigate(getVerificationUrl(auto))}
              className="flex-1 bg-emerald-500 hover:bg-emerald-400 text-gray-950 font-black py-3 px-4 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-md shadow-emerald-500/20"
              data-testid="open-verify-screen-btn"
            >
              <ShieldCheck size={16} />
              <span>Verify This Auto</span>
            </button>
            <button
              onClick={handleCopyLink}
              className="py-3 px-3 rounded-xl border border-gray-700 text-gray-300 hover:text-white text-xs font-bold transition-colors flex items-center gap-1"
            >
              {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
              <span>{copied ? "Copied" : "Copy Link"}</span>
            </button>
          </div>
        </div>

        {/* Primary Action Buttons */}
        <div className="pt-2 flex flex-col gap-2.5">
          <button
            onClick={() => navigate(`/booking/${auto.id}?pickup=${encodeURIComponent(pickup)}&destination=${encodeURIComponent(destination)}`)}
            className="w-full bg-amber-400 hover:bg-amber-500 active:scale-[0.98] text-gray-950 font-black py-4 px-6 rounded-2xl text-base shadow-lg shadow-amber-400/30 flex items-center justify-center gap-2 transition-all"
            data-testid="book-auto-now-btn"
          >
            <span>Book This Auto Now (₹{auto.fareEstimate})</span>
            <ArrowRight size={20} />
          </button>

          <a
            href={`tel:${auto.phone.replace(/[\s-]/g, "")}`}
            className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-800 font-bold py-3 px-4 rounded-2xl text-xs text-center transition-colors flex items-center justify-center gap-2"
            data-testid="call-driver-btn"
          >
            <Phone size={14} />
            <span>Direct Call ({auto.driverName})</span>
          </a>
        </div>
      </div>
    </div>
  );
}
