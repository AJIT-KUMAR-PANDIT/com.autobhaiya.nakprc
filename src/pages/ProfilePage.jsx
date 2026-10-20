import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  User,
  Phone,
  Mail,
  ShieldCheck,
  ShieldAlert,
  MapPin,
  Clock,
  LogOut,
  Edit3,
  Check,
  X,
  Plus,
  ArrowLeft,
  ChevronRight,
  CarTaxiFront,
  Sparkles,
  PhoneCall
} from "lucide-react";
import { useAuth } from "../context/AuthContext.jsx";

export default function ProfilePage() {
  const navigate = useNavigate();
  const {
    user,
    isSignedIn,
    updateProfile,
    logout,
    openAuthModal,
    loginAsDemo
  } = useAuth();

  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name || "");
  const [email, setEmail] = useState(user?.email || "");
  const [emergencyName, setEmergencyName] = useState(
    user?.emergencyContact?.name || ""
  );
  const [emergencyPhone, setEmergencyPhone] = useState(
    user?.emergencyContact?.phone || ""
  );
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Sync edit state when user changes
  const handleStartEdit = () => {
    setName(user?.name || "");
    setEmail(user?.email || "");
    setEmergencyName(user?.emergencyContact?.name || "");
    setEmergencyPhone(user?.emergencyContact?.phone || "");
    setIsEditing(true);
    setSaveSuccess(false);
  };

  const handleSaveProfile = (e) => {
    e?.preventDefault();
    updateProfile({
      name: name.trim() || user.name,
      email: email.trim(),
      emergencyContact: {
        name: emergencyName.trim(),
        phone: emergencyPhone.trim()
      }
    });
    setIsEditing(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  if (!isSignedIn || !user) {
    return (
      <div className="min-h-screen bg-gray-50 pb-32" data-testid="profile-guest">
        {/* Header */}
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
              Account Profile
            </h1>
            <div className="w-9" />
          </div>
        </div>

        <div className="max-w-md mx-auto px-4 pt-10 text-center space-y-4">
          <div className="w-20 h-20 rounded-3xl bg-amber-100 text-amber-900 flex items-center justify-center mx-auto shadow-xs">
            <User size={36} strokeWidth={2.2} />
          </div>
          <div>
            <h2 className="text-xl font-black text-gray-900">
              Sign In to Auto Bhaiya
            </h2>
            <p className="text-xs text-gray-500 max-w-xs mx-auto mt-1">
              Save your emergency safety contacts, fast-book verified autos, and track your rides across Jamshedpur.
            </p>
          </div>

          <div className="pt-4 space-y-2.5 max-w-xs mx-auto">
            <button
              onClick={() => openAuthModal("phone")}
              className="w-full py-3.5 rounded-2xl bg-gray-950 hover:bg-black text-white font-extrabold text-xs shadow-md active:scale-98 transition-transform"
            >
              Sign In with Mobile OTP
            </button>
            <button
              onClick={() => openAuthModal("demo")}
              className="w-full py-3.5 rounded-2xl bg-amber-400 hover:bg-amber-500 text-gray-950 font-extrabold text-xs shadow-xs active:scale-98 transition-transform flex items-center justify-center gap-1.5"
            >
              <Sparkles size={16} />
              <span>1-Tap Demo Profiles</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  const roleLabel =
    user.role === "driver"
      ? "Verified Auto Driver"
      : user.role === "super_admin"
      ? "Super Administrator"
      : "Passenger";

  const roleBadgeColor =
    user.role === "driver"
      ? "bg-emerald-100 text-emerald-800 border-emerald-200"
      : user.role === "super_admin"
      ? "bg-indigo-100 text-indigo-800 border-indigo-200"
      : "bg-amber-100 text-amber-800 border-amber-200";

  return (
    <div className="min-h-screen bg-gray-50 pb-32" data-testid="profile-page">
      {/* Header */}
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
            Account Profile
          </h1>
          <button
            onClick={() => {
              logout();
              navigate("/");
            }}
            className="text-xs text-rose-600 font-bold hover:bg-rose-50 px-2.5 py-1.5 rounded-lg transition-colors flex items-center gap-1"
            title="Sign Out"
          >
            <LogOut size={14} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {saveSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold flex items-center gap-2 animate-in fade-in">
            <Check size={16} className="text-emerald-600" />
            <span>Profile and emergency safety contacts updated!</span>
          </div>
        )}

        {/* Profile Card */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3.5">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-400 to-yellow-300 text-gray-950 flex items-center justify-center font-black text-xl shadow-xs">
                {user.avatar ? (
                  <img
                    src={user.avatar}
                    alt={user.name}
                    className="w-full h-full rounded-2xl object-cover"
                  />
                ) : user.name ? (
                  user.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)
                ) : (
                  "U"
                )}
              </div>
              <div>
                <h2 className="font-black text-lg text-gray-950 leading-tight">
                  {user.name}
                </h2>
                <div className="flex items-center gap-1.5 mt-1">
                  <span
                    className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${roleBadgeColor}`}
                  >
                    {roleLabel}
                  </span>
                  {user.autoNumber && (
                    <span className="text-[10px] font-mono font-bold bg-gray-100 text-gray-800 px-1.5 py-0.5 rounded">
                      {user.autoNumber}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {!isEditing ? (
              <button
                onClick={handleStartEdit}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
                title="Edit Profile"
              >
                <Edit3 size={16} />
              </button>
            ) : (
              <button
                onClick={() => setIsEditing(false)}
                className="p-2 rounded-xl border border-gray-200 hover:bg-gray-100 text-gray-600 transition-colors"
                title="Cancel Edit"
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Quick Contact Info */}
          {!isEditing ? (
            <div className="grid grid-cols-1 gap-2 pt-2 border-t border-gray-100 text-xs">
              <div className="flex items-center gap-2.5 text-gray-700 py-1">
                <Phone size={15} className="text-gray-400" />
                <span className="font-bold">{user.phone || "No phone linked"}</span>
              </div>
              {user.email && (
                <div className="flex items-center gap-2.5 text-gray-700 py-1">
                  <Mail size={15} className="text-gray-400" />
                  <span className="font-medium text-gray-600">{user.email}</span>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleSaveProfile} className="space-y-3 pt-3 border-t border-gray-100">
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-xs font-bold border border-gray-200 rounded-xl outline-none focus:border-amber-400"
                />
              </div>
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full px-3 py-2 text-xs font-medium border border-gray-200 rounded-xl outline-none focus:border-amber-400"
                />
              </div>

              <div className="pt-2">
                <label className="block text-[11px] font-bold text-rose-800 mb-1">
                  Emergency Contact (Name & Phone)
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={emergencyName}
                    onChange={(e) => setEmergencyName(e.target.value)}
                    placeholder="Contact Name (e.g. Father)"
                    className="w-full px-3 py-2 text-xs font-medium border border-gray-200 rounded-xl outline-none focus:border-amber-400"
                  />
                  <input
                    type="tel"
                    value={emergencyPhone}
                    onChange={(e) => setEmergencyPhone(e.target.value)}
                    placeholder="+91 98765 11111"
                    className="w-full px-3 py-2 text-xs font-medium border border-gray-200 rounded-xl outline-none focus:border-amber-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gray-950 text-white font-bold text-xs flex items-center justify-center gap-1.5 hover:bg-black transition-colors"
              >
                <Check size={15} />
                <span>Save Changes</span>
              </button>
            </form>
          )}
        </div>

        {/* Emergency Safety Card (Passenger & Driver protection) */}
        <div className="bg-rose-50/70 border border-rose-200/80 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-rose-900 font-extrabold text-sm">
              <ShieldAlert size={18} className="text-rose-600" />
              <span>Emergency Safety Contact</span>
            </div>
            <span className="text-[10px] font-bold bg-rose-200/60 text-rose-800 px-2 py-0.5 rounded-full">
              SOS Active
            </span>
          </div>

          <p className="text-xs text-rose-900/80 leading-relaxed">
            In case of emergency during your ride, Auto Bhaiya safety can share your live ride tracking link and vehicle verification details with this contact.
          </p>

          <div className="bg-white rounded-2xl p-3 border border-rose-100 flex items-center justify-between">
            <div>
              <p className="font-bold text-xs text-gray-900">
                {user.emergencyContact?.name || "Not Configured Yet"}
              </p>
              <p className="text-xs text-gray-500 font-mono">
                {user.emergencyContact?.phone || "Tap Edit above to add emergency phone"}
              </p>
            </div>
            {user.emergencyContact?.phone && (
              <a
                href={`tel:${user.emergencyContact.phone.replace(/\s+/g, "")}`}
                className="w-9 h-9 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center hover:bg-rose-200 transition-colors"
                title="Call Emergency Contact"
              >
                <PhoneCall size={16} />
              </a>
            )}
          </div>
        </div>

        {/* Quick Links Menu */}
        <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-xs divide-y divide-gray-100">
          <Link
            to="/bookings"
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center">
                <Clock size={18} />
              </div>
              <div>
                <p className="font-extrabold text-xs text-gray-900">
                  Ride History & Bookings
                </p>
                <p className="text-[11px] text-gray-500">
                  {user.ridesCount || 0} total trips completed
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </Link>

          {/* Admin / Driver Portal Link */}
          <Link
            to="/admin"
            className="flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center">
                <ShieldCheck size={18} />
              </div>
              <div>
                <p className="font-extrabold text-xs text-gray-900">
                  Admin & Driver Management Portal
                </p>
                <p className="text-[11px] text-gray-500">
                  Weekly name-edit quota, fleet directory & audit
                </p>
              </div>
            </div>
            <ChevronRight size={18} className="text-gray-400" />
          </Link>
        </div>

        {/* Switch Persona for Demo/Testing */}
        <div className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
              Quick Role Switcher (Test / Demo)
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2">
            <button
              onClick={() => loginAsDemo("passenger")}
              className={`p-2.5 rounded-2xl border text-center transition-all ${
                user.role === "passenger"
                  ? "border-amber-400 bg-amber-50 text-amber-950 font-bold shadow-2xs"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700 text-xs"
              }`}
            >
              <span className="block text-xs font-bold">Passenger</span>
              <span className="text-[10px] text-gray-500">Pooja</span>
            </button>

            <button
              onClick={() => loginAsDemo("driver")}
              className={`p-2.5 rounded-2xl border text-center transition-all ${
                user.role === "driver"
                  ? "border-emerald-400 bg-emerald-50 text-emerald-950 font-bold shadow-2xs"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700 text-xs"
              }`}
            >
              <span className="block text-xs font-bold">Auto Bhaiya</span>
              <span className="text-[10px] text-gray-500">AB-101</span>
            </button>

            <button
              onClick={() => loginAsDemo("admin")}
              className={`p-2.5 rounded-2xl border text-center transition-all ${
                user.role === "super_admin"
                  ? "border-indigo-400 bg-indigo-50 text-indigo-950 font-bold shadow-2xs"
                  : "border-gray-200 hover:bg-gray-50 text-gray-700 text-xs"
              }`}
            >
              <span className="block text-xs font-bold">Super Admin</span>
              <span className="text-[10px] text-gray-500">NAKPRC</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
