import React, { useState, useMemo } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import {
  ShieldCheck,
  ShieldAlert,
  QrCode,
  ArrowRight,
  RotateCcw,
  MapPin,
  Info
} from "lucide-react";
import { verifyAuto } from "../data/autos.js";

export default function VerifyPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const queryAuto = searchParams.get("auto") || "";
  const queryHash = searchParams.get("hash") || "";

  // Form states for manual input
  const [inputAuto, setInputAuto] = useState(queryAuto);
  const [inputHash, setInputHash] = useState(queryHash);
  const [activeTab, setActiveTab] = useState(queryAuto ? "result" : "manual");
  const [manualResult, setManualResult] = useState(null);

  // Directly derive verification result (React 19 pattern: render computation over effect sync)
  const verificationResult = useMemo(() => {
    if (manualResult) return manualResult;
    if (queryAuto && queryHash) {
      return verifyAuto(queryAuto, queryHash);
    }
    if (queryAuto && !queryHash) {
      return {
        verified: false,
        reason: "missing_hash",
        message: "A verification code/hash is required. An Auto number alone cannot be verified."
      };
    }
    return null;
  }, [queryAuto, queryHash, manualResult]);

  const handleManualVerify = (e) => {
    e?.preventDefault();
    if (!inputAuto.trim()) return;

    const result = verifyAuto(inputAuto, inputHash);
    setManualResult(result);
    setActiveTab("result");

    setSearchParams({
      auto: inputAuto.trim().toUpperCase(),
      hash: inputHash.trim().toUpperCase()
    });
  };

  const handleReset = () => {
    setSearchParams({});
    setInputAuto("");
    setInputHash("");
    setManualResult(null);
    setActiveTab("manual");
  };

  const handleQuickFill = (autoNumber, hash) => {
    setInputAuto(autoNumber);
    setInputHash(hash);
    setManualResult(null);
    setActiveTab("result");
    setSearchParams({ auto: autoNumber, hash });
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Top Banner */}
      <div className="bg-white border-b border-gray-200/80 px-4 py-5 shadow-2xs">
        <div className="max-w-md mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] font-extrabold uppercase tracking-widest text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                Official Verification
              </span>
              <h1 className="text-2xl font-black text-gray-900 mt-1">
                Auto Verification
              </h1>
            </div>
            <Link
              to="/scan"
              className="flex items-center gap-1.5 bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold px-3 py-2 rounded-xl transition-colors shadow-xs"
            >
              <QrCode size={16} />
              <span>Scan QR</span>
            </Link>
          </div>
          <p className="text-xs text-gray-500 font-medium mt-1">
            Verify Auto Bhaiya number and security hash against trusted records.
          </p>

          {/* Tab Selector */}
          <div className="flex bg-gray-100 p-1 rounded-xl mt-4">
            <button
              onClick={() => setActiveTab("manual")}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === "manual"
                  ? "bg-white text-gray-950 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Manual Verification
            </button>
            <button
              onClick={() => {
                if (verificationResult) setActiveTab("result");
                else handleManualVerify();
              }}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                activeTab === "result"
                  ? "bg-white text-gray-950 shadow-xs"
                  : "text-gray-500 hover:text-gray-900"
              }`}
            >
              Verification Status
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-5">
        {/* 1. VERIFIED AUTO RESULT */}
        {activeTab === "result" && verificationResult?.verified && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Verified Header Badge */}
            <div className="bg-emerald-600 text-white rounded-3xl p-6 shadow-md shadow-emerald-600/20 relative overflow-hidden">
              <div className="absolute top-0 right-0 -mr-6 -mt-6 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                    <ShieldCheck size={20} className="text-white" />
                  </div>
                  <span className="text-xs font-black tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full">
                    Match Confirmed
                  </span>
                </div>
                <h2 className="text-2xl font-black tracking-tight">
                  VERIFIED AUTO BHAIYA
                </h2>
                <p className="text-emerald-100 text-xs mt-1 font-medium">
                  This QR belongs to this registered Auto Bhaiya record.
                </p>

                <div className="mt-4 pt-3 border-t border-emerald-500/60 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-100">Session Verified:</span>
                  <span className="font-bold text-white">
                    {verificationResult.timestamp || "Just now"}
                  </span>
                </div>
              </div>
            </div>

            {/* Verified Details Card */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
              {/* Auto Number & Driver */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-gray-100">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Auto Bhaiya Number
                  </span>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-2xl font-black font-mono text-gray-950">
                      {verificationResult.auto.autoNumber}
                    </span>
                    <span className="bg-emerald-100 text-emerald-800 text-[10px] font-black px-2 py-0.5 rounded-md">
                      ACTIVE
                    </span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
                    Operating Area
                  </span>
                  <p className="font-bold text-sm text-gray-900 mt-0.5 flex items-center justify-end gap-1">
                    <MapPin size={13} className="text-emerald-600" />
                    {verificationResult.auto.area}
                  </p>
                </div>
              </div>

              {/* Data Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 font-medium block text-[10px]">
                    Driver Name
                  </span>
                  <span className="font-extrabold text-gray-900 text-sm mt-0.5 block">
                    {verificationResult.auto.driverName}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {verificationResult.auto.phone}
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 font-medium block text-[10px]">
                    Vehicle Number
                  </span>
                  <span className="font-extrabold text-gray-900 text-sm font-mono mt-0.5 block">
                    {verificationResult.auto.vehicleNumber}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {verificationResult.auto.vehicleType}
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 font-medium block text-[10px]">
                    Experience & Rating
                  </span>
                  <span className="font-extrabold text-gray-900 text-sm mt-0.5 block">
                    ★ {verificationResult.auto.rating.toFixed(1)}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    {verificationResult.auto.trips.toLocaleString()} trips completed
                  </span>
                </div>

                <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-gray-400 font-medium block text-[10px]">
                    Current Availability
                  </span>
                  <span className="font-extrabold text-emerald-700 text-sm mt-0.5 block flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    {verificationResult.auto.available ? "Ready for Rides" : "Currently on Trip"}
                  </span>
                  <span className="text-[11px] text-gray-500">
                    ETA: ~{verificationResult.auto.etaMinutes} mins
                  </span>
                </div>
              </div>

              {/* Hash & Security info */}
              <div className="p-3 bg-emerald-50/60 border border-emerald-200/60 rounded-xl">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="font-bold text-emerald-900">Security Hash:</span>
                  <span className="font-mono font-bold text-emerald-800">
                    {verificationResult.auto.verificationHash}
                  </span>
                </div>
                <p className="text-[10px] text-emerald-800/80 mt-1 leading-relaxed">
                  ✓ Pair match confirmed with local Auto Bhaiya registry.
                </p>
              </div>

              {/* Trust Disclaimer */}
              <div className="flex items-start gap-2 bg-gray-50 p-3 rounded-xl text-gray-500 text-[11px] leading-relaxed">
                <Info size={16} className="text-gray-400 shrink-0 mt-0.5" />
                <p>
                  This verification verifies that the Auto Bhaiya number and verification hash match a registered Auto Bhaiya record in this application.
                </p>
              </div>

              {/* Primary Action Buttons: View Auto & Book This Auto */}
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={() => navigate(`/booking/${verificationResult.auto.id}`)}
                  className="w-full bg-amber-400 hover:bg-amber-500 active:scale-[0.98] text-gray-950 font-black py-3.5 px-4 rounded-xl text-sm shadow-md shadow-amber-400/20 flex items-center justify-center gap-2 transition-all"
                >
                  <span>Book This Auto ({verificationResult.auto.autoNumber})</span>
                  <ArrowRight size={18} />
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate(`/auto/${verificationResult.auto.id}`)}
                    className="flex-1 bg-white hover:bg-gray-50 border border-gray-300 font-bold py-2.5 px-3 rounded-xl text-xs text-gray-700 transition-colors"
                  >
                    View Auto Profile
                  </button>

                  <button
                    onClick={handleReset}
                    className="py-2.5 px-3 rounded-xl border border-gray-200 text-gray-500 hover:text-gray-800 text-xs font-semibold flex items-center gap-1"
                  >
                    <RotateCcw size={14} />
                    <span>Check Another</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. INVALID AUTO RESULT */}
        {activeTab === "result" && verificationResult && !verificationResult.verified && (
          <div className="space-y-4 animate-in fade-in duration-300">
            {/* Warning Header */}
            <div className="bg-red-600 text-white rounded-3xl p-6 shadow-md shadow-red-600/20 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
                  <ShieldAlert size={20} className="text-white" />
                </div>
                <span className="text-xs font-black tracking-widest uppercase bg-white/20 px-2 py-0.5 rounded-full">
                  Verification Failed
                </span>
              </div>
              <h2 className="text-2xl font-black tracking-tight">
                AUTO COULD NOT BE VERIFIED
              </h2>
              <p className="text-red-100 text-xs mt-1 font-medium">
                {verificationResult.message}
              </p>
            </div>

            {/* Possible Reasons */}
            <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-4">
              <div>
                <h3 className="text-xs font-black uppercase tracking-wider text-gray-500 mb-2">
                  Possible reasons:
                </h3>
                <ul className="space-y-2 text-xs text-gray-700 font-medium">
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                    <span>QR code is invalid or corrupted</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                    <span>Auto Bhaiya number does not exist in the registry</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                    <span>Verification security code / hash does not match</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                    <span>QR sticker may be outdated or replaced</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-1.5" />
                    <span>Vehicle is not registered in this application</span>
                  </li>
                </ul>
              </div>

              {/* Troubleshooting Actions */}
              <div className="pt-2 flex flex-col gap-2.5">
                <button
                  onClick={() => setActiveTab("manual")}
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold py-3.5 px-4 rounded-xl text-xs shadow-xs transition-colors flex items-center justify-center gap-2"
                >
                  <span>Enter Auto Number Manually</span>
                  <ArrowRight size={14} />
                </button>

                <div className="flex gap-2">
                  <button
                    onClick={() => navigate("/scan")}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-gray-300 font-bold text-xs text-gray-700 hover:bg-gray-50 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <QrCode size={14} />
                    <span>Try Scan Again</span>
                  </button>

                  <button
                    onClick={() => navigate("/search")}
                    className="flex-1 py-2.5 px-3 rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 text-xs font-semibold text-center"
                  >
                    Return to Search
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. MANUAL VERIFICATION FORM */}
        {activeTab === "manual" && (
          <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-xs space-y-5 animate-in fade-in duration-300">
            <div>
              <h2 className="text-base font-extrabold text-gray-900">
                Manual Identity Check
              </h2>
              <p className="text-xs text-gray-500 mt-0.5">
                Enter both the Auto Bhaiya Number and Security Hash to authenticate.
              </p>
            </div>

            <form onSubmit={handleManualVerify} className="space-y-4">
              {/* Auto Number Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Auto Bhaiya Number
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputAuto}
                    onChange={(e) => setInputAuto(e.target.value.toUpperCase())}
                    placeholder="e.g. AB-101"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-3 font-mono font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none uppercase text-sm"
                    required
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold bg-gray-200 text-gray-600 px-2 py-0.5 rounded">
                    AB-XXX
                  </span>
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Printed on the Auto Bhaiya badge or sticker.
                </p>
              </div>

              {/* Verification Hash Input */}
              <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">
                  Verification Code / Hash
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={inputHash}
                    onChange={(e) => setInputHash(e.target.value.toUpperCase())}
                    placeholder="e.g. AB101-X8K92P7Q"
                    className="w-full bg-gray-50 border border-gray-300 rounded-xl px-3.5 py-3 font-mono font-bold text-gray-900 placeholder:text-gray-400 placeholder:font-normal focus:bg-white focus:border-emerald-600 focus:ring-2 focus:ring-emerald-500/20 outline-none uppercase text-sm"
                    required
                  />
                </div>
                <p className="text-[10px] text-gray-400 mt-1">
                  Found on the QR card or official certificate.
                </p>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={!inputAuto.trim() || !inputHash.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] text-white font-extrabold py-3.5 px-4 rounded-xl text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <ShieldCheck size={18} />
                <span>VERIFY AUTO</span>
              </button>
            </form>

            {/* Quick Demo Pre-fill helper */}
            <div className="pt-3 border-t border-gray-100">
              <span className="text-[11px] font-bold text-gray-500 uppercase tracking-wider block mb-2">
                Quick Test Autofill:
              </span>
              <div className="flex flex-wrap gap-1.5">
                <button
                  type="button"
                  onClick={() => handleQuickFill("AB-101", "AB101-X8K92P7Q")}
                  className="text-[11px] font-mono font-bold bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-gray-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  AB-101 (Valid)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("AB-204", "AB204-M4N73T9W")}
                  className="text-[11px] font-mono font-bold bg-gray-100 hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 border border-gray-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  AB-204 (Valid)
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickFill("AB-101", "WRONG-HASH-999")}
                  className="text-[11px] font-mono font-bold bg-red-50 text-red-700 border border-red-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  Wrong Hash (Test)
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
