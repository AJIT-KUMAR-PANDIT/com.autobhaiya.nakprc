import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useNavigate, Link } from "react-router-dom";
import { ArrowLeft, ScanLine, Keyboard, Sparkles, ShieldCheck } from "lucide-react";

export default function ScannerPage() {
  const navigate = useNavigate();
  const [scanError, setScanError] = useState(null);

  const handleScan = (results) => {
    if (results && results.length > 0) {
      const scannedText = results[0].rawValue;
      if (!scannedText) return;

      try {
        // Try parsing as URL
        if (scannedText.includes("/verify")) {
          const url = new URL(scannedText, window.location.origin);
          const auto = url.searchParams.get("auto");
          const hash = url.searchParams.get("hash");
          if (auto && hash) {
            navigate(`/verify?auto=${encodeURIComponent(auto)}&hash=${encodeURIComponent(hash)}`);
            return;
          }
        }

        // Try query string parsing
        if (scannedText.includes("auto=") && scannedText.includes("hash=")) {
          const params = new URLSearchParams(scannedText.includes("?") ? scannedText.split("?")[1] : scannedText);
          const auto = params.get("auto");
          const hash = params.get("hash");
          if (auto && hash) {
            navigate(`/verify?auto=${encodeURIComponent(auto)}&hash=${encodeURIComponent(hash)}`);
            return;
          }
        }

        // Fallback: Check if it's formatted as AutoNumber e.g. AB-101
        const clean = scannedText.trim();
        if (clean.toUpperCase().startsWith("AB-") || clean.toUpperCase().startsWith("AB")) {
          navigate(`/verify?auto=${encodeURIComponent(clean)}`);
          return;
        }

        // Generic fallback to verify page with raw scan
        navigate(`/verify?auto=${encodeURIComponent(clean)}`);
      } catch (err) {
        console.error("Error parsing QR scan result:", err);
        navigate(`/verify?auto=${encodeURIComponent(scannedText)}`);
      }
    }
  };

  const handleSimulateScan = (auto, hash) => {
    navigate(`/verify?auto=${encodeURIComponent(auto)}&hash=${encodeURIComponent(hash)}`);
  };

  return (
    <div className="min-h-screen bg-[#0e1713] text-white flex flex-col relative pb-20">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 p-4 z-50 flex items-center justify-between bg-gradient-to-b from-black/90 to-transparent">
        <button
          onClick={() => navigate(-1)}
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
          aria-label="Back"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-base font-extrabold tracking-tight">
          Scan Auto Bhaiya QR
        </h1>
        <Link
          to="/verify"
          className="text-xs font-bold text-amber-400 bg-black/40 border border-amber-400/40 px-3 py-1.5 rounded-full backdrop-blur-md hover:bg-amber-400 hover:text-black transition-colors"
        >
          Manual Check
        </Link>
      </div>

      {/* Scanner Viewport */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden min-h-[420px]">
        <Scanner
          onScan={handleScan}
          onError={(error) => setScanError(error?.message || "Camera unavailable")}
          components={{
            audio: false,
            finder: false
          }}
          styles={{
            container: { width: "100%", height: "100%", position: "absolute", inset: 0 }
          }}
        />

        {/* Viewfinder Target Graphic */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center p-6">
          <div className="w-[72%] aspect-square max-w-[280px] border-2 border-emerald-400/80 rounded-3xl relative shadow-[0_0_50px_rgba(16,185,129,0.25)]">
            <div className="absolute -top-1 -left-1 w-7 h-7 border-t-4 border-l-4 border-emerald-400 rounded-tl-2xl"></div>
            <div className="absolute -top-1 -right-1 w-7 h-7 border-t-4 border-r-4 border-emerald-400 rounded-tr-2xl"></div>
            <div className="absolute -bottom-1 -left-1 w-7 h-7 border-b-4 border-l-4 border-emerald-400 rounded-bl-2xl"></div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 border-b-4 border-r-4 border-emerald-400 rounded-br-2xl"></div>
            <ScanLine
              size={48}
              className="absolute inset-0 m-auto text-emerald-400/60 animate-pulse"
            />
          </div>

          <p className="mt-6 text-white/90 text-xs font-semibold text-center px-4 py-2 bg-black/60 rounded-full backdrop-blur-md border border-white/10">
            Align camera with Auto Bhaiya identity sticker
          </p>
        </div>
      </div>

      {/* Quick Camera Fallback / Test Actions */}
      <div className="relative z-20 bg-gray-950/90 border-t border-gray-800 p-4 space-y-3">
        {scanError && (
          <div className="bg-amber-950/80 border border-amber-600/60 text-amber-200 px-3.5 py-2 rounded-xl text-xs flex items-center justify-between">
            <span>📷 Camera access: {scanError}</span>
          </div>
        )}

        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5">
            Simulator / Quick Test QR:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => handleSimulateScan("AB-101", "AB101-X8K92P7Q")}
              className="bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-200 text-xs font-bold py-2.5 px-3 rounded-xl transition-colors text-left"
            >
              ✓ Scan AB-101 (Valid)
            </button>
            <button
              onClick={() => handleSimulateScan("AB-204", "AB204-M4N73T9W")}
              className="bg-emerald-600/30 hover:bg-emerald-600/50 border border-emerald-500/50 text-emerald-200 text-xs font-bold py-2.5 px-3 rounded-xl transition-colors text-left"
            >
              ✓ Scan AB-204 (Valid)
            </button>
            <button
              onClick={() => handleSimulateScan("AB-101", "FAKE-HASH-123")}
              className="bg-red-950/40 hover:bg-red-900/60 border border-red-500/40 text-red-300 text-xs font-bold py-2.5 px-3 rounded-xl transition-colors text-left"
            >
              ✗ Scan Fake QR (Invalid)
            </button>
            <button
              onClick={() => navigate("/verify")}
              className="bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-bold py-2.5 px-3 rounded-xl transition-colors flex items-center justify-center gap-1.5"
            >
              <Keyboard size={14} />
              <span>Manual Entry</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
