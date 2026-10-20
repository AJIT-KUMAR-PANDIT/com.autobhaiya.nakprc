import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Smartphone,
  ShieldCheck,
  User,
  CarTaxiFront,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  X,
  RotateCw
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function LoginPage() {
  const navigate = useNavigate();
  const {
    user,
    isSignedIn,
    requestOtp,
    verifyOtp,
    loginAsDemo,
    logout,
    demoProfiles
  } = useAuth();

  const [activeTab, setActiveTab] = useState("phone");
  const [phone, setPhone] = useState("");
  const [otpStep, setOtpStep] = useState(false);
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");
  const [loading, setLoading] = useState(false);

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
        setOtp("1234");
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
        navigate("/profile");
      } else {
        setError(res.message || "Invalid OTP code.");
      }
    }, 400);
  };

  const handleDemoSelect = (roleKey) => {
    loginAsDemo(roleKey);
    navigate("/profile");
  };

  if (isSignedIn && user) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col justify-center items-center px-4 py-12 pb-32">
        <div className="w-full max-w-md bg-white border border-gray-200 rounded-3xl p-6 shadow-sm text-center space-y-4">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-black text-xl">
            {user.name
              ? user.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")
                  .slice(0, 2)
              : "U"}
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
              Already Signed In
            </span>
            <h2 className="text-xl font-black text-gray-950 mt-2">
              {user.name}
            </h2>
            <p className="text-xs text-gray-500">{user.phone || user.email}</p>
          </div>

          <div className="pt-2 flex flex-col gap-2">
            <Link
              to="/profile"
              className="w-full py-3 rounded-2xl bg-gray-950 text-white font-bold text-xs flex items-center justify-center gap-2 hover:bg-black transition-colors"
            >
              <span>View Profile & Emergency Contacts</span>
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/"
              className="w-full py-3 rounded-2xl bg-amber-400 text-gray-950 font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-500 transition-colors"
            >
              <span>Go to Home</span>
            </Link>
            <button
              onClick={() => logout()}
              className="w-full py-2.5 rounded-2xl border border-gray-200 text-rose-600 font-bold text-xs hover:bg-rose-50 transition-colors"
            >
              Sign Out
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-32" data-testid="login-page">
      {/* Top Header */}
      <div className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-gray-200/80 px-4 py-3 shadow-2xs">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-gray-100 transition-colors"
            aria-label="Back"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="font-extrabold text-base text-gray-900">
            Sign In / Register
          </h1>
          <div className="w-9" />
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-6 space-y-5">
        {/* Brand Banner */}
        <div className="bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-200 rounded-3xl p-5 text-gray-950 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/90 backdrop-blur-xs flex items-center justify-center shrink-0 shadow-xs">
            <CarTaxiFront size={28} className="text-gray-950" />
          </div>
          <div>
            <h2 className="font-black text-lg leading-tight">
              Auto Bhaiya Account
            </h2>
            <p className="text-xs font-semibold text-gray-800 mt-0.5">
              Instant ride booking, fair fares & verified safety records.
            </p>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-2 p-1 bg-gray-200/70 rounded-2xl">
          <button
            type="button"
            onClick={() => {
              setActiveTab("phone");
              setError("");
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "phone"
                ? "bg-white text-gray-950 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Smartphone size={16} />
            <span>Mobile OTP</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab("demo");
              setError("");
            }}
            className={`py-2.5 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeTab === "demo"
                ? "bg-white text-gray-950 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            <Sparkles size={16} className="text-amber-500" />
            <span>1-Tap Demo</span>
          </button>
        </div>

        {/* Form Container */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
              <X size={16} className="shrink-0 text-rose-600" />
              <span>{error}</span>
            </div>
          )}

          {info && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2">
              <CheckCircle2 size={16} className="shrink-0 text-emerald-600" />
              <span>{info}</span>
            </div>
          )}

          {activeTab === "phone" ? (
            <div>
              {!otpStep ? (
                <form onSubmit={handleSendOtp} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 mb-1.5">
                      Your 10-Digit Mobile Number
                    </label>
                    <div className="relative flex items-center border-2 border-gray-200 rounded-2xl focus-within:border-amber-400 focus-within:ring-2 focus-within:ring-amber-200 transition-all bg-gray-50/50">
                      <span className="pl-3.5 pr-2 py-3.5 text-xs font-black text-gray-500 border-r border-gray-200">
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
                        className="w-full pl-3 pr-4 py-3.5 bg-transparent text-sm font-bold text-gray-900 outline-none"
                        autoFocus
                      />
                    </div>
                  </div>

                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl space-y-1.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">
                      Try Demo Test Numbers
                    </span>
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => setPhone("9876543210")}
                        className="text-[11px] bg-white border border-amber-300 px-2 py-1 rounded-md text-gray-800 font-semibold"
                      >
                        Passenger: 98765 43210
                      </button>
                      <button
                        type="button"
                        onClick={() => setPhone("9835123401")}
                        className="text-[11px] bg-white border border-amber-300 px-2 py-1 rounded-md text-gray-800 font-semibold"
                      >
                        Driver: 98351 23401
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
                        <span>Send OTP Verification</span>
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
                        Enter 4-Digit OTP Code
                      </label>
                      <button
                        type="button"
                        onClick={() => setOtpStep(false)}
                        className="text-[11px] text-emerald-700 font-bold hover:underline"
                      >
                        Change Number
                      </button>
                    </div>
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
                    <p className="text-[11px] text-gray-500 mt-1.5 text-center">
                      Demo verification code is <strong>1234</strong>
                    </p>
                  </div>

                  <button
                    type="submit"
                    disabled={loading || otp.length < 4}
                    className="w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-sm flex items-center justify-center gap-2 transition-transform active:scale-98 disabled:opacity-50 shadow-md"
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
          ) : (
            <div className="space-y-2.5">
              {/* Passenger */}
              <button
                type="button"
                onClick={() => handleDemoSelect("passenger")}
                className="w-full p-4 rounded-2xl border border-gray-200 hover:border-amber-400 hover:bg-amber-50/30 transition-all text-left flex items-center gap-3.5 group active:scale-98"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-900 shrink-0 font-black text-sm">
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
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-900" />
              </button>

              {/* Driver */}
              <button
                type="button"
                onClick={() => handleDemoSelect("driver")}
                className="w-full p-4 rounded-2xl border border-gray-200 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all text-left flex items-center gap-3.5 group active:scale-98"
              >
                <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-900 shrink-0 font-black text-sm">
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
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-900" />
              </button>

              {/* Admin */}
              <button
                type="button"
                onClick={() => handleDemoSelect("admin")}
                className="w-full p-4 rounded-2xl border border-gray-200 hover:border-indigo-400 hover:bg-indigo-50/30 transition-all text-left flex items-center gap-3.5 group active:scale-98"
              >
                <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-900 shrink-0 font-black text-sm">
                  <ShieldCheck size={22} />
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
                    Full safety management & audit logs
                  </p>
                </div>
                <ArrowRight size={18} className="text-gray-400 group-hover:text-gray-900" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
