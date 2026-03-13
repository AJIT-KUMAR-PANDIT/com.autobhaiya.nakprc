import React, { useState } from "react";
import { Scanner } from "@yudiel/react-qr-scanner";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ScanLine } from "lucide-react";

export default function ScannerPage() {
  const navigate = useNavigate();
  const [scanError, setScanError] = useState(null);

  const handleScan = (results) => {
    if (results && results.length > 0) {
      const scannedText = results[0].rawValue;
      // Extract number plate if there's any specific URL format, otherwise assume raw text is plate number
      const autoNumber = scannedText.split('/').pop().trim();
      if (autoNumber) {
        navigate(`/auto-bhaiya/${autoNumber}`);
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#111] text-white flex flex-col relative">
      {/* Header */}
      <div className="absolute top-0 left-0 w-full p-4 z-50 flex items-center gap-4 bg-gradient-to-b from-black/80 to-transparent">
        <button 
          onClick={() => navigate(-1)} 
          className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-md hover:bg-white/30 transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold tracking-tight">Scan Auto QR</h1>
      </div>

      {/* Scanner Area */}
      <div className="flex-1 flex flex-col items-center justify-center relative overflow-hidden">
        <Scanner
          onScan={handleScan}
          onError={(error) => setScanError(error?.message || "Failed to start camera")}
          components={{
            audio: false,
            finder: false // custom finder below
          }}
          styles={{
            container: { width: "100%", height: "100%", position: "absolute", inset: 0 }
          }}
        />

        {/* Custom Overlay */}
        <div className="absolute inset-0 z-10 pointer-events-none flex flex-col items-center justify-center">
          <div className="w-[80%] aspect-square max-w-[300px] border-2 border-emerald-500 rounded-3xl relative">
            <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-emerald-400 rounded-tl-3xl"></div>
            <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-emerald-400 rounded-tr-3xl"></div>
            <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-emerald-400 rounded-bl-3xl"></div>
            <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-emerald-400 rounded-br-3xl"></div>
            <ScanLine size={48} className="absolute inset-0 m-auto text-emerald-400/50 animate-pulse" />
          </div>
          <p className="mt-8 text-white/80 font-medium text-center px-8 bg-black/40 py-2 rounded-full backdrop-blur-md">
            Point camera at the Auto's QR Code
          </p>
        </div>
      </div>

      {scanError && (
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-red-500/90 text-white px-6 py-3 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 w-max">
          <span>⚠️</span> {scanError}
        </div>
      )}
    </div>
  );
}
