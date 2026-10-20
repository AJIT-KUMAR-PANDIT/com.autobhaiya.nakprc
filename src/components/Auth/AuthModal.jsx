import React, { useState, useEffect } from "react";
import {
  X,
  Smartphone,
  ShieldCheck,
  User,
  CarTaxiFront,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Lock,
  RotateCw
} from "lucide-react";
import { useAuth } from "../../context/AuthContext.jsx";

export default function AuthModal() {
  const {
    isAuthModalOpen,
    closeAuthModal,
    authModalInitialTab,
    requestOtp,
    verifyOtp,
    loginAsDemo,
    demoProfiles,
    hasClerk
  } = useAuth();

  const [activeTab, setActiveTab] = useState("phone"); // "phone" | "demo"
  const [phone, setPhone] = useState("");
  const [otpStep, setOtpStep] = useState(false); // false: phone input, true: otp input
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isAuthModalOpen) {
      setActiveTab(authModalInitialTab || "phone");
      setError("");
      setInfo("");
      setOtpStep(false);
      setOtp("");
    }
  }, [isAuthModalOpen, authModalInitialTab]);

  if (!isAuthModalOpen) return null;

  const handleSendOtp = (e) => {
    e?.preventDefault();
    setError("");
    setInfo("");
    if (!phone || phone.replace(/\D/g, "").length < 10) {
      setError("Please enter a valid 10-digit mobile number.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = requestOtp(phone);
      setLoading(false);
      if (res.success) {
        setOtpStep(true);
        setOtp("1234"); // Auto prefill demo code for effortless UX
        setInfo(`Code sent to ${res.phone}. Use demo code 1234.`);
      } else {
        setError(res.message);
      }
    }, 400);
  };

  const handleVerify = (e) => {
    e?.preventDefault();
    setError("");
    setInfo("");
    if (!otp || otp.length < 4) {
      setError("Please enter the 4-digit code.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const res = verifyOtp(phone, otp);
      setLoading(false);
      if (res.success) {
        closeAuthModal();
      } else {
        setError(res.message || "Invalid OTP code.");
      }
    }, 400);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
      data-testid="auth-modal"
    >
      {/* Backdrop click to dismiss */}
      <div
        className="fixed inset-0"
        onClick={closeAuthModal}
        aria-hidden="true"
      />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-gray-100 overflow-hidden z-10 max-h-[90vh] flex flex-col">
        {/* Header Bar */}
        <div className="p-5 pb-3 border-b border-gray-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-emerald-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-400 flex items-center justify-center shadow-xs text-gray-950">
              <CarTaxiFront size={20} strokeWidth={2.4} />
            </div>
            <div>
              <h3 className="font-extrabold text-gray-900 text-base leading-tight">
                Auto Bhaiya Account
              </h3>
              <p className="text-[11px] font-semibold text-emerald-800">
                Safe Rides • Verified Fleet • Fair Fares
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-200/80 text-gray-500 transition-colors"
            aria-label="Close"
          >
            <X size={18} />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 p-1.5 mx-4 mt-3 bg-gray-100 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab("phone");
              setError("");
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "phone"
                ? "bg-white text-gray-950 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Smartphone size={15} />
            <span>Mobile OTP</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("demo");
              setError("");
            }}
            className={`py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "demo"
                ? "bg-white text-gray-950 shadow-xs"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            <Sparkles size={15} className="text-amber-500" />
            <span>1-Tap Profiles</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <X size={16} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {info && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <span>{info}</span>
            </div>
          )}

          {/* TAB 1: PHONE / OTP */}
          {activeTab === "phone" && (
            <div>
              {!otpStep ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Enter Mobile Number
                    </label>
                    <div className="relative flex items-center border-2 border-gray-200 rounded-2xl focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200 transition-all bg-gray-50/50">
                      <span className="pl-3.5 pr-2 py-3 text-xs font-black text-gray-500 border-r border-gray-200">
                        🇮🇳 +91
                      </span>
                      <input
                        type="tel"
                        maxLength={10}
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        placeholder="98765 43210"
                        className="w-full pl-3 pr-4 py-3 bg-transparent text-sm font-bold text-gray-900 outline-none"
                        autoFocus
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1.5">
                      We'll send a 4-digit OTP code to verify your mobile number.
                    </p>
                  </div>

                  {/* Quick autofill links */}
                  <div className="p-3 bg-amber-50/80 border border-amber-200/80 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-800">
                      Quick Test Numbers
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      <button
                        type="button"
                        onClick={() => setPhone("9876543210")}
                        className="text-[11px] bg-white border border-amber-200 px-2 py-1 rounded-md text-gray-800 font-semibold hover:bg-amber-100 transition-colors"
                      >
                        Passenger (98765 43210)
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhone("9835123401")}
                        className="text-[11px] bg-white border border-amber-200 px-2 py-1 rounded-md text-gray-800 font-semibold hover:bg-amber-100 transition-colors"
                      >
                        Driver (98351 23401)
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || phone.length < 10}
                    className="w-full py-3.5 rounded-2xl bg-gray-950 hover:bg-black text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-transform active:scale-98 disabled:opacity-50 shadow-md"
                  >
                    {loading ? (
                      <>
                        <RotateCw size={18} className="animate-spin" />
                        <span>Sending OTP...</span>
                      </>
                    ) : (
                      <>
                        <span>Send Verification Code</span>
                        <ArrowRight size={18} />
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleVerify} className="space-y-4">
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-xs font-bold text-gray-700">
                        Enter 4-Digit Code
                      </label>
                      <button
                        type="button"
                        onClick={() => {
                          setOtpStep(false);
                          setError("");
                        }}
                        className="text-[11px] text-emerald-700 font-bold hover:underline"
                      >
                        Change Number
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="text"
                        maxLength={4}
                        value={otp}
                        onChange={(e) =>
                          setOtp(e.target.value.replace(/\D/g, "").slice(0, 4))
                        }
                        placeholder="1 2 3 4"
                        className="w-full py-3 text-center tracking-[0.5em] text-2xl font-black rounded-2xl border-2 border-emerald-400 bg-emerald-50/40 text-gray-950 outline-none focus:ring-2 focus:ring-emerald-300"
                        autoFocus
                      />
                    </div>
                    <p className="text-[11px] text-gray-500 mt-1.5 text-center">
                      Demo test code is <strong>1234</strong>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 4}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-transform active:scale-98 disabled:opacity-50 shadow-md shadow-emerald-600/30"
                  >
                    {loading ? (
                      <>
                        <RotateCw size={18} className="animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 size={18} />
                        <span>Verify & Sign In</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          )}

          {/* TAB 2: 1-TAP DEMO PROFILES */}
          {activeTab === "demo" && (
            <div className="space-y-2.5">
              <p className="text-xs text-gray-500 font-medium mb-1">
                Select a verified persona to experience Auto Bhaiya as a passenger, registered auto driver, or safety supervisor:
              </p>

              {/* Passenger */}
              <button
                type="button"
                onClick={() => loginAsDemo("passenger")}
                className="w-full p-3.5 rounded-2xl border border-gray-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all text-left flex items-center gap-3 group active:scale-98"
              >
                <div className="w-11 h-11 rounded-full bg-amber-100 flex items-center justify-center text-amber-900 shrink-0 font-bold text-sm">
                  PS
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-gray-900 group-hover:text-amber-950">
                      {demoProfiles.passenger.name}
                    </span>
                    <span className="text-[10px] font-bold bg-amber-100 text-amber-800 px-2 py-0.5 rounded-full">
                      Passenger
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    {demoProfiles.passenger.phone} • Kadma Uliyan
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="text-gray-400 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all"
                />
              </button>

              {/* Driver */}
              <button
                type="button"
                onClick={() => loginAsDemo("driver")}
                className="w-full p-3.5 rounded-2xl border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/40 transition-all text-left flex items-center gap-3 group active:scale-98"
              >
                <div className="w-11 h-11 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-900 shrink-0 font-bold text-sm">
                  AK
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-gray-900 group-hover:text-emerald-950">
                      {demoProfiles.driver.name}
                    </span>
                    <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
                      Driver (AB-101)
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    JH05-AB-1234 • Sakchi Golchakkar
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="text-gray-400 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all"
                />
              </button>

              {/* Super Admin */}
              <button
                type="button"
                onClick={() => loginAsDemo("admin")}
                className="w-full p-3.5 rounded-2xl border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/40 transition-all text-left flex items-center gap-3 group active:scale-98"
              >
                <div className="w-11 h-11 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-900 shrink-0 font-bold text-sm">
                  <ShieldCheck size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-sm text-gray-900 group-hover:text-indigo-950">
                      {demoProfiles.admin.name}
                    </span>
                    <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded-full">
                      Super Admin
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate mt-0.5">
                    Full fleet control & safety audit logs
                  </p>
                </div>
                <ArrowRight
                  size={18}
                  className="text-gray-400 group-hover:text-gray-900 group-hover:translate-x-0.5 transition-all"
                />
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-gray-50 border-t border-gray-100 text-center">
          <p className="text-[10px] font-medium text-gray-500">
            Protected by NAKPRC safety guidelines & Truecaller verification
          </p>
        </div>
      </div>
    </div>
  );
}
