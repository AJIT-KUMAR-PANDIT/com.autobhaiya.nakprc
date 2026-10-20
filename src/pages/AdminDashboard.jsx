import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ShieldCheck,
  ShieldAlert,
  CarTaxiFront,
  Users,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Lock,
  Unlock,
  RotateCcw,
  Edit3,
  Trash2,
  Plus,
  Search,
  Filter,
  Power,
  Eye,
  QrCode,
  IndianRupee,
  Activity,
  FileText,
  Check,
  X,
  Phone,
  MapPin,
  Fuel,
  Info,
  ExternalLink,
  ChevronRight,
  Sparkles,
  ArrowLeft
} from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import {
  getAutos,
  CATEGORIES,
  FUEL_TYPES,
  getVerificationUrl
} from "../data/autos.js";
import {
  getNameChangeQuota,
  updateAutoProfile,
  setDriverAvailability,
  addNewAuto,
  deleteAuto,
  resetDriverQuota,
  getAuditLogs,
  resetFleetToDefault
} from "../data/admin.js";
import { getBookings, updateBookingStatus } from "../data/bookings.js";
import { isAppwriteConfigured } from "../lib/appwrite.js";

export default function AdminDashboard() {
  // Roles: "super_admin" | "auto_admin"
  const [role, setRole] = useState("super_admin");
  const [superTab, setSuperTab] = useState("fleet"); // "fleet" | "bookings" | "audit" | "system"

  // Data states
  const [autos, setAutos] = useState(() => getAutos());
  const [bookings, setBookings] = useState(() => getBookings());
  const [auditLogs, setAuditLogs] = useState(() => getAuditLogs());

  // Selected driver for Auto Admin portal
  const [selectedAutoId, setSelectedAutoId] = useState(
    autos[0]?.id || "auto-101"
  );

  // Search & Filter in Super Admin
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [fuelFilter, setFuelFilter] = useState("all");

  // Booking filter
  const [bookingStatusFilter, setBookingStatusFilter] = useState("all");

  // Modals
  const [editingAuto, setEditingAuto] = useState(null); // for modal edit
  const [isNewAutoModalOpen, setIsNewAutoModalOpen] = useState(false);
  const [qrModalAuto, setQrModalAuto] = useState(null);

  // Notification Toast
  const [toast, setToast] = useState(null);

  const showToast = (message, type = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 4000);
  };

  // Sync with window events
  useEffect(() => {
    const handleAutosUpdated = () => setAutos(getAutos());
    const handleBookingsUpdated = () => setBookings(getBookings());
    const handleAuditUpdated = () => setAuditLogs(getAuditLogs());
    const handleQuotaUpdated = () => setAutos(getAutos());

    window.addEventListener("autobhaiya:autos-updated", handleAutosUpdated);
    window.addEventListener("autobhaiya_booking_updated", handleBookingsUpdated);
    window.addEventListener("autobhaiya:audit-updated", handleAuditUpdated);
    window.addEventListener("autobhaiya:quota-updated", handleQuotaUpdated);

    return () => {
      window.removeEventListener("autobhaiya:autos-updated", handleAutosUpdated);
      window.removeEventListener("autobhaiya_booking_updated", handleBookingsUpdated);
      window.removeEventListener("autobhaiya:audit-updated", handleAuditUpdated);
      window.removeEventListener("autobhaiya:quota-updated", handleQuotaUpdated);
    };
  }, []);

  // Find currently active auto for driver portal
  const activeDriverAuto =
    autos.find((a) => a.id === selectedAutoId) || autos[0];

  // Quota for active driver
  const driverQuota = activeDriverAuto
    ? getNameChangeQuota(activeDriverAuto.id)
    : null;

  // Auto Admin Form State
  const [driverFormData, setDriverFormData] = useState({
    driverName: "",
    name: "",
    phone: "",
    vehicleNumber: "",
    area: "",
    category: "Passenger",
    fuelType: "CNG",
    fareEstimate: 100,
    pickupNote: ""
  });

  useEffect(() => {
    if (activeDriverAuto) {
      setDriverFormData({
        driverName: activeDriverAuto.driverName || "",
        name: activeDriverAuto.name || "",
        phone: activeDriverAuto.phone || "",
        vehicleNumber: activeDriverAuto.vehicleNumber || "",
        area: activeDriverAuto.area || "",
        category: activeDriverAuto.category || "Passenger",
        fuelType: activeDriverAuto.fuelType || "CNG",
        fareEstimate: activeDriverAuto.fareEstimate || 100,
        pickupNote: activeDriverAuto.pickupNote || ""
      });
    }
  }, [activeDriverAuto]);

  // Handle Auto Admin save
  const handleDriverProfileSubmit = (e) => {
    e.preventDefault();
    if (!activeDriverAuto) return;

    const res = updateAutoProfile(activeDriverAuto.id, driverFormData, false);
    if (!res.success) {
      showToast(res.error, "error");
    } else {
      showToast(
        `Profile updated! Weekly name edits remaining: ${res.quota.remaining}/2`,
        "success"
      );
      setAutos(getAutos());
    }
  };

  // Handle Driver Availability Toggle
  const handleToggleDriverAvailability = () => {
    if (!activeDriverAuto) return;
    const newStatus = !activeDriverAuto.available;
    const res = setDriverAvailability(
      activeDriverAuto.id,
      newStatus,
      `Auto Admin (${activeDriverAuto.driverName})`
    );
    if (res.success) {
      showToast(
        `Shift status changed: You are now ${newStatus ? "ONLINE" : "OFFLINE"}.`,
        "info"
      );
      setAutos(getAutos());
    }
  };

  // Filtered autos for Super Admin
  const filteredAutos = autos.filter((a) => {
    const q = searchQuery.toLowerCase().trim();
    const matchQuery =
      !q ||
      a.autoNumber.toLowerCase().includes(q) ||
      a.driverName.toLowerCase().includes(q) ||
      a.vehicleNumber.toLowerCase().includes(q) ||
      a.area.toLowerCase().includes(q);
    const matchCategory =
      categoryFilter === "all" ||
      (a.category && a.category.toLowerCase() === categoryFilter.toLowerCase());
    const matchFuel =
      fuelFilter === "all" ||
      (a.fuelType && a.fuelType.toLowerCase() === fuelFilter.toLowerCase());
    return matchQuery && matchCategory && matchFuel;
  });

  // Filtered bookings
  const filteredBookings = bookings.filter((b) => {
    if (bookingStatusFilter === "all") return true;
    return b.status === bookingStatusFilter;
  });

  // KPI Calculations
  const totalFleet = autos.length;
  const onlineCount = autos.filter((a) => a.available).length;
  const passengerCount = autos.filter((a) => a.category === "Passenger").length;
  const cargoCount = autos.filter((a) => a.category === "Cargo").length;
  const cleanFuelCount = autos.filter(
    (a) => a.fuelType === "Electric" || a.fuelType === "CNG"
  ).length;
  const totalTrips = autos.reduce((acc, a) => acc + (a.trips || 0), 0);

  return (
    <div className="min-h-screen bg-gray-50 pb-24 text-gray-900 font-sans">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-50 max-w-sm transition-all animate-in fade-in slide-in-from-top-3">
          <div
            className={`flex items-start gap-3 p-4 rounded-2xl shadow-xl text-xs font-semibold border ${
              toast.type === "error"
                ? "bg-red-50 text-red-900 border-red-200"
                : toast.type === "info"
                ? "bg-blue-50 text-blue-900 border-blue-200"
                : "bg-emerald-50 text-emerald-900 border-emerald-200"
            }`}
          >
            {toast.type === "error" ? (
              <AlertCircle size={18} className="text-red-600 shrink-0 mt-0.5" />
            ) : toast.type === "info" ? (
              <Info size={18} className="text-blue-600 shrink-0 mt-0.5" />
            ) : (
              <CheckCircle2 size={18} className="text-emerald-600 shrink-0 mt-0.5" />
            )}
            <div className="flex-1">{toast.message}</div>
            <button
              onClick={() => setToast(null)}
              className="text-gray-400 hover:text-gray-600"
            >
              <X size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Top Admin Bar */}
      <div className="bg-gray-950 text-white px-4 py-3 sticky top-0 z-30 shadow-md">
        <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors"
              title="Return to App"
            >
              <ArrowLeft size={18} />
            </Link>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-amber-400 text-gray-950 flex items-center justify-center font-black">
                <ShieldCheck size={18} />
              </div>
              <div>
                <h1 className="text-sm font-black tracking-tight leading-none text-white">
                  Auto Bhaiya Management Portal
                </h1>
                <p className="text-[10px] text-gray-400 font-medium">
                  Super Admin & Auto Driver Command Center
                </p>
              </div>
            </div>
          </div>

          {/* Role Switching Pills */}
          <div className="flex bg-white/10 p-1 rounded-2xl border border-white/10 text-xs">
            <button
              onClick={() => setRole("super_admin")}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                role === "super_admin"
                  ? "bg-amber-400 text-gray-950 shadow-xs"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <ShieldCheck size={14} />
              <span>Super Admin</span>
            </button>
            <button
              onClick={() => setRole("auto_admin")}
              className={`px-3 py-1.5 rounded-xl font-bold flex items-center gap-1.5 transition-all ${
                role === "auto_admin"
                  ? "bg-amber-400 text-gray-950 shadow-xs"
                  : "text-gray-300 hover:text-white"
              }`}
            >
              <CarTaxiFront size={14} />
              <span>Auto Admin (Driver)</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 pt-6">
        {/* ============================================================ */}
        {/* ROLE 1: SUPER ADMIN PORTAL                                   */}
        {/* ============================================================ */}
        {role === "super_admin" && (
          <div className="space-y-6">
            {/* KPI Cards */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Total Fleet
                  </span>
                  <CarTaxiFront size={16} className="text-amber-500" />
                </div>
                <div className="text-2xl font-black text-gray-950">{totalFleet}</div>
                <div className="text-[11px] text-emerald-700 font-semibold mt-1 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {onlineCount} Online Right Now
                </div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Categories
                  </span>
                  <Users size={16} className="text-emerald-600" />
                </div>
                <div className="text-2xl font-black text-gray-950">
                  {passengerCount}{" "}
                  <span className="text-xs font-semibold text-gray-400">/ {cargoCount}</span>
                </div>
                <div className="text-[11px] text-gray-500 font-medium mt-1">
                  {passengerCount} Passenger • {cargoCount} Cargo
                </div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Clean Energy
                  </span>
                  <Fuel size={16} className="text-teal-600" />
                </div>
                <div className="text-2xl font-black text-teal-700">
                  {Math.round((cleanFuelCount / (totalFleet || 1)) * 100)}%
                </div>
                <div className="text-[11px] text-gray-500 font-medium mt-1">
                  {cleanFuelCount} Electric & CNG autos
                </div>
              </div>

              <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs">
                <div className="flex items-center justify-between text-gray-500 mb-1">
                  <span className="text-[11px] font-bold uppercase tracking-wider">
                    Total Bookings
                  </span>
                  <Activity size={16} className="text-purple-600" />
                </div>
                <div className="text-2xl font-black text-gray-950">
                  {bookings.length}
                </div>
                <div className="text-[11px] text-purple-700 font-semibold mt-1">
                  {totalTrips.toLocaleString()} Lifetime Trips
                </div>
              </div>
            </div>

            {/* Navigation Sub-Tabs */}
            <div className="flex border-b border-gray-200 gap-2 overflow-x-auto">
              {[
                { id: "fleet", label: "Fleet & Drivers", icon: CarTaxiFront },
                { id: "bookings", label: "Rides & Bookings", icon: Activity },
                { id: "audit", label: "Audit & Rate Limit Logs", icon: FileText },
                { id: "system", label: "Sync & Payment Settings", icon: ShieldCheck }
              ].map((tab) => {
                const TabIcon = tab.icon;
                const active = superTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setSuperTab(tab.id)}
                    className={`pb-3 px-3 text-xs font-bold flex items-center gap-2 border-b-2 whitespace-nowrap transition-colors ${
                      active
                        ? "border-amber-500 text-gray-950"
                        : "border-transparent text-gray-500 hover:text-gray-900"
                    }`}
                  >
                    <TabIcon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* 1. FLEET MANAGEMENT TAB */}
            {superTab === "fleet" && (
              <div className="space-y-4">
                {/* Search & Actions Bar */}
                <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row gap-3 items-center justify-between">
                  <div className="relative w-full md:w-80">
                    <Search
                      size={15}
                      className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                    />
                    <input
                      type="text"
                      placeholder="Search driver, auto #, plate, area..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl pl-9 pr-3 py-2 text-xs font-semibold outline-none focus:bg-white focus:border-amber-400"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto">
                    <select
                      value={categoryFilter}
                      onChange={(e) => setCategoryFilter(e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none"
                    >
                      <option value="all">All Categories</option>
                      {CATEGORIES.map((c) => (
                        <option key={c} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>

                    <select
                      value={fuelFilter}
                      onChange={(e) => setFuelFilter(e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700 outline-none"
                    >
                      <option value="all">All Fuels</option>
                      {FUEL_TYPES.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>

                    <button
                      onClick={() => setIsNewAutoModalOpen(true)}
                      className="bg-amber-400 hover:bg-amber-500 text-gray-950 font-black px-4 py-2 rounded-xl text-xs flex items-center gap-1.5 shrink-0 transition-transform active:scale-95"
                    >
                      <Plus size={14} />
                      <span>Add Auto</span>
                    </button>

                    <button
                      onClick={() => {
                        if (
                          window.confirm(
                            "Reset fleet to factory default dataset? All custom edits and added autos will be restored."
                          )
                        ) {
                          resetFleetToDefault();
                          setAutos(getAutos());
                          showToast("Fleet restored to baseline defaults", "info");
                        }
                      }}
                      className="bg-gray-100 hover:bg-gray-200 text-gray-700 p-2 rounded-xl text-xs shrink-0 transition-colors"
                      title="Reset Fleet to Baseline Defaults"
                    >
                      <RotateCcw size={15} />
                    </button>
                  </div>
                </div>

                {/* Fleet Table / Cards */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50/80 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Auto # & Driver</th>
                          <th className="py-3 px-4">Plate & Fuel</th>
                          <th className="py-3 px-4">Category & Area</th>
                          <th className="py-3 px-4">Weekly Name Quota</th>
                          <th className="py-3 px-4">Availability</th>
                          <th className="py-3 px-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {filteredAutos.map((auto) => {
                          const quota = getNameChangeQuota(auto.id);
                          return (
                            <tr
                              key={auto.id}
                              className="hover:bg-gray-50/70 transition-colors"
                            >
                              <td className="py-3.5 px-4">
                                <div className="flex items-center gap-2.5">
                                  <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-900 font-black flex items-center justify-center shrink-0">
                                    <CarTaxiFront size={18} />
                                  </div>
                                  <div>
                                    <span className="font-extrabold text-gray-900 block">
                                      {auto.driverName}
                                    </span>
                                    <span className="text-[11px] font-bold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60 inline-block mt-0.5">
                                      {auto.autoNumber}
                                    </span>
                                  </div>
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="font-mono text-gray-900 font-bold block">
                                  {auto.vehicleNumber}
                                </span>
                                <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                                  {auto.fuelType}
                                </span>
                              </td>

                              <td className="py-3.5 px-4">
                                <span className="text-gray-900 font-semibold block">
                                  {auto.category} Auto
                                </span>
                                <span className="text-gray-500 text-[11px]">
                                  {auto.area}
                                </span>
                              </td>

                              <td className="py-3.5 px-4">
                                <div className="space-y-1">
                                  <span
                                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full inline-flex items-center gap-1 ${
                                      quota.isLocked
                                        ? "bg-red-100 text-red-800"
                                        : quota.remaining === 1
                                        ? "bg-amber-100 text-amber-900"
                                        : "bg-emerald-100 text-emerald-800"
                                    }`}
                                  >
                                    {quota.isLocked ? (
                                      <Lock size={10} />
                                    ) : (
                                      <Unlock size={10} />
                                    )}
                                    <span>
                                      {quota.remaining}/2 Edits Remaining
                                    </span>
                                  </span>

                                  {quota.used > 0 && (
                                    <button
                                      onClick={() => {
                                        resetDriverQuota(auto.id);
                                        setAutos(getAutos());
                                        showToast(
                                          `Reset edit quota for ${auto.autoNumber}`,
                                          "success"
                                        );
                                      }}
                                      className="text-[10px] font-bold text-blue-600 hover:text-blue-800 block underline"
                                    >
                                      Reset to 2 Edits
                                    </button>
                                  )}
                                </div>
                              </td>

                              <td className="py-3.5 px-4">
                                <button
                                  onClick={() => {
                                    setDriverAvailability(
                                      auto.id,
                                      !auto.available,
                                      "Super Admin"
                                    );
                                    setAutos(getAutos());
                                  }}
                                  className={`text-xs font-bold px-2.5 py-1 rounded-xl flex items-center gap-1.5 transition-colors ${
                                    auto.available
                                      ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                                      : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                  }`}
                                >
                                  <Power size={12} />
                                  <span>{auto.available ? "Online" : "Offline"}</span>
                                </button>
                              </td>

                              <td className="py-3.5 px-4 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  <button
                                    onClick={() => setQrModalAuto(auto)}
                                    className="p-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg"
                                    title="View QR Code & Hash"
                                  >
                                    <QrCode size={14} />
                                  </button>

                                  <button
                                    onClick={() => setEditingAuto(auto)}
                                    className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-lg"
                                    title="Edit Auto Profile"
                                  >
                                    <Edit3 size={14} />
                                  </button>

                                  <button
                                    onClick={() => {
                                      if (
                                        window.confirm(
                                          `Delete ${auto.autoNumber} (${auto.driverName}) from the fleet?`
                                        )
                                      ) {
                                        deleteAuto(auto.id);
                                        setAutos(getAutos());
                                        showToast(
                                          `Removed ${auto.autoNumber}`,
                                          "info"
                                        );
                                      }
                                    }}
                                    className="p-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-lg"
                                    title="Delete Auto"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 2. BOOKINGS TAB */}
            {superTab === "bookings" && (
              <div className="space-y-4">
                <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-gray-500 uppercase tracking-wider">
                      Filter Bookings:
                    </span>
                    <select
                      value={bookingStatusFilter}
                      onChange={(e) => setBookingStatusFilter(e.target.value)}
                      className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold outline-none"
                    >
                      <option value="all">All Statuses ({bookings.length})</option>
                      <option value="confirmed">Confirmed</option>
                      <option value="accepted">Accepted</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-xl">
                    Appwrite & Local Sync Enabled
                  </span>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-gray-50 border-b border-gray-200 text-gray-500 font-bold uppercase text-[10px] tracking-wider">
                        <tr>
                          <th className="py-3 px-4">Booking #</th>
                          <th className="py-3 px-4">Driver & Auto</th>
                          <th className="py-3 px-4">Pickup & Drop</th>
                          <th className="py-3 px-4">Fare & Payment</th>
                          <th className="py-3 px-4">Ride Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100 font-medium">
                        {filteredBookings.map((b) => (
                          <tr key={b.id} className="hover:bg-gray-50/70">
                            <td className="py-3 px-4">
                              <span className="font-mono font-bold text-gray-900 block">
                                {b.bookingNumber || b.id}
                              </span>
                              <span className="text-[10px] text-gray-400">
                                {new Date(b.createdAt).toLocaleTimeString([], {
                                  hour: "2-digit",
                                  minute: "2-digit"
                                })}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-extrabold text-gray-900 block">
                                {b.driverName}
                              </span>
                              <span className="text-[10px] text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded font-bold">
                                {b.autoNumber}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="text-gray-900 font-semibold block truncate max-w-xs">
                                From: {b.pickup}
                              </span>
                              <span className="text-gray-500 text-[11px] block truncate max-w-xs">
                                To: {b.destination}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <span className="font-extrabold text-gray-900 block">
                                ₹{b.fareEstimate}
                              </span>
                              <span
                                className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                                  b.paymentStatus === "completed"
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-amber-100 text-amber-900"
                                }`}
                              >
                                {b.paymentStatus === "completed"
                                  ? "UPI Paid"
                                  : "Payment Pending"}
                              </span>
                            </td>

                            <td className="py-3 px-4">
                              <select
                                value={b.status}
                                onChange={(e) => {
                                  updateBookingStatus(b.id, e.target.value);
                                  setBookings(getBookings());
                                  showToast(
                                    `Updated booking #${b.bookingNumber} to ${e.target.value}`,
                                    "success"
                                  );
                                }}
                                className="bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1 text-xs font-bold text-gray-800 outline-none"
                              >
                                <option value="accepted">Accepted</option>
                                <option value="arriving">Arriving</option>
                                <option value="started">Started</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* 3. AUDIT & RATE LIMIT LOGS TAB */}
            {superTab === "audit" && (
              <div className="space-y-4">
                <div className="bg-amber-50 border border-amber-200 p-4 rounded-3xl flex items-start gap-3">
                  <AlertCircle size={20} className="text-amber-700 shrink-0 mt-0.5" />
                  <div className="text-xs text-amber-900 space-y-1">
                    <p className="font-black">
                      2-Edits-Per-Week Rate Limit Enforcement
                    </p>
                    <p className="leading-relaxed">
                      Auto drivers are legally restricted from altering their names
                      or vehicle identities more than 2 times every 7 days. All edit
                      attempts, overrides, and quota resets are cryptographically
                      recorded in this tamper-evident audit trail.
                    </p>
                  </div>
                </div>

                <div className="bg-white rounded-3xl border border-gray-200 shadow-xs overflow-hidden">
                  <div className="p-4 border-b border-gray-100 flex items-center justify-between">
                    <span className="font-extrabold text-xs uppercase tracking-wider text-gray-700">
                      System Activity & Rate Limit Logs ({auditLogs.length})
                    </span>
                  </div>

                  <div className="divide-y divide-gray-100">
                    {auditLogs.length === 0 ? (
                      <div className="p-8 text-center text-xs text-gray-500">
                        No recorded audit events yet. Profile updates and rate-limit triggers will appear here.
                      </div>
                    ) : (
                      auditLogs.map((log) => (
                        <div
                          key={log.id}
                          className="p-3.5 hover:bg-gray-50/60 flex items-start justify-between gap-3 text-xs"
                        >
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-800">
                                {log.action}
                              </span>
                              <span className="text-gray-500 text-[11px]">
                                by <strong className="text-gray-800">{log.actor}</strong>
                              </span>
                            </div>
                            <p className="text-gray-900 font-semibold">
                              {log.details}
                            </p>
                          </div>
                          <span className="text-[10px] text-gray-400 whitespace-nowrap">
                            {log.dateStr}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* 4. SYSTEM & SYNC SETTINGS */}
            {superTab === "system" && (
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-emerald-700">
                    <Activity size={18} />
                    <h3 className="font-black text-sm text-gray-900">
                      Appwrite Realtime Cloud Status
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    Auto Bhaiya connects to Appwrite Web SDK for bidirectional booking
                    sync and real-time fleet presence.
                  </p>
                  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200 text-xs space-y-1 font-mono">
                    <div>
                      Configured:{" "}
                      <span className="font-bold text-emerald-700">
                        {isAppwriteConfigured() ? "YES (Cloud Active)" : "NO (Offline First Mode)"}
                      </span>
                    </div>
                    <div>Database: autobhaiya_db</div>
                    <div>Collections: bookings, autos</div>
                    <div>Fallback: Browser LocalStorage (Zero latency)</div>
                  </div>
                </div>

                <div className="bg-white p-5 rounded-3xl border border-gray-200 shadow-xs space-y-3">
                  <div className="flex items-center gap-2 text-amber-600">
                    <IndianRupee size={18} />
                    <h3 className="font-black text-sm text-gray-900">
                      UPI Payment Gateway Config
                    </h3>
                  </div>
                  <p className="text-xs text-gray-600 leading-relaxed font-medium">
                    Reads directly from <code>public/data/payment.json</code> to
                    generate dynamic UPI QR codes and mobile app intents.
                  </p>
                  <div className="bg-gray-50 rounded-2xl p-3 border border-gray-200 text-xs space-y-1 font-mono">
                    <div>VPA: autobhaiya@upi</div>
                    <div>Payee: Auto Bhaiya NAKPRC</div>
                    <div>Currency: INR (₹)</div>
                    <div>Zero Commission Direct Handoff</div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ============================================================ */}
        {/* ROLE 2: AUTO ADMIN (DRIVER SELF-SERVICE PORTAL)               */}
        {/* ============================================================ */}
        {role === "auto_admin" && (
          <div className="space-y-6">
            {/* Driver Account Selector Bar */}
            <div className="bg-white p-4 rounded-3xl border border-gray-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-500 text-gray-950 flex items-center justify-center font-black shadow-xs shrink-0">
                  <CarTaxiFront size={24} />
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                    Active Driver Profile
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-black text-sm text-gray-950">
                      {activeDriverAuto?.driverName}
                    </span>
                    <span className="text-[11px] font-bold bg-amber-100 text-amber-900 px-2 py-0.5 rounded-md">
                      {activeDriverAuto?.autoNumber}
                    </span>
                  </div>
                </div>
              </div>

              {/* Selector to test any auto profile */}
              <div className="flex items-center gap-2">
                <span className="text-xs font-semibold text-gray-500">Switch Auto:</span>
                <select
                  value={selectedAutoId}
                  onChange={(e) => setSelectedAutoId(e.target.value)}
                  className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-xs font-bold text-gray-900 outline-none"
                >
                  {autos.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.autoNumber} — {a.driverName} ({a.fuelType})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Shift & Availability Action Card */}
            <div
              className={`p-5 rounded-3xl border transition-all flex flex-col md:flex-row items-center justify-between gap-4 ${
                activeDriverAuto?.available
                  ? "bg-emerald-50/80 border-emerald-300 text-emerald-950"
                  : "bg-gray-100 border-gray-200 text-gray-800"
              }`}
            >
              <div className="flex items-center gap-3.5">
                <div
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                    activeDriverAuto?.available
                      ? "bg-emerald-600 text-white shadow-xs"
                      : "bg-gray-300 text-gray-700"
                  }`}
                >
                  <Power size={22} />
                </div>
                <div>
                  <h3 className="font-black text-sm">
                    {activeDriverAuto?.available
                      ? "Shift Status: ONLINE"
                      : "Shift Status: OFFLINE"}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {activeDriverAuto?.available
                      ? "You are appearing on the map and accepting rides in " + activeDriverAuto.area
                      : "You are not receiving new ride requests. Tap to start shift."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={handleToggleDriverAvailability}
                className={`px-5 py-3 rounded-2xl font-black text-xs shadow-xs transition-all active:scale-95 ${
                  activeDriverAuto?.available
                    ? "bg-emerald-700 hover:bg-emerald-800 text-white"
                    : "bg-gray-900 hover:bg-black text-white"
                }`}
              >
                {activeDriverAuto?.available ? "Go Offline" : "Go Online (Start Shift)"}
              </button>
            </div>

            {/* Weekly Name Change Quota Banner (Core Requirement) */}
            <div
              className={`p-5 rounded-3xl border transition-all ${
                driverQuota?.isLocked
                  ? "bg-red-50/90 border-red-200 text-red-950"
                  : driverQuota?.remaining === 1
                  ? "bg-amber-50/90 border-amber-200 text-amber-950"
                  : "bg-emerald-50/90 border-emerald-200 text-emerald-950"
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    {driverQuota?.isLocked ? (
                      <Lock size={18} className="text-red-600 shrink-0" />
                    ) : (
                      <Unlock size={18} className="text-emerald-700 shrink-0" />
                    )}
                    <h3 className="font-extrabold text-sm">
                      Weekly Name Change Quota: {driverQuota?.remaining} of 2 Edits Left
                    </h3>
                  </div>

                  <p className="text-xs leading-relaxed opacity-90 max-w-2xl font-medium">
                    <strong>Rule:</strong> Auto Admins can change their registered
                    Driver Name and Auto Name a maximum of <strong>2 times per week</strong> (rolling 7 days) to protect passenger safety and verification compliance.
                  </p>

                  {driverQuota?.isLocked && driverQuota?.nextAvailableAt && (
                    <div className="pt-2">
                      <span className="inline-flex items-center gap-1.5 bg-red-100 text-red-900 font-bold px-3 py-1 rounded-xl text-xs">
                        <Clock size={13} />
                        Next Name Change Available:{" "}
                        {driverQuota.nextAvailableAt.toLocaleString("en-IN", {
                          dateStyle: "medium",
                          timeStyle: "short"
                        })}
                      </span>
                    </div>
                  )}
                </div>

                <div className="shrink-0">
                  <span
                    className={`text-xs font-black px-3 py-1 rounded-full ${
                      driverQuota?.isLocked
                        ? "bg-red-200 text-red-900"
                        : driverQuota?.remaining === 1
                        ? "bg-amber-200 text-amber-900"
                        : "bg-emerald-200 text-emerald-900"
                    }`}
                  >
                    {driverQuota?.used}/2 Used
                  </span>
                </div>
              </div>

              {/* Show recent change timestamps */}
              {driverQuota?.activeLogs && driverQuota.activeLogs.length > 0 && (
                <div className="mt-3 pt-3 border-t border-black/10 text-[11px] space-y-1">
                  <span className="font-bold uppercase tracking-wider opacity-75">
                    Recent Edits within 7 days:
                  </span>
                  {driverQuota.activeLogs.map((log, idx) => (
                    <div key={idx} className="flex items-center gap-2 opacity-85">
                      <Clock size={11} />
                      <span>
                        Changed from "{log.oldName}" to "{log.newName}" on{" "}
                        {new Date(log.timestamp).toLocaleDateString("en-IN", {
                          month: "short",
                          day: "numeric",
                          hour: "2-digit",
                          minute: "2-digit"
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile Editing Form */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-gray-100">
                <div>
                  <h3 className="font-extrabold text-sm text-gray-900">
                    Edit Auto Bhaiya Profile
                  </h3>
                  <p className="text-xs text-gray-500">
                    Fields marked with a lock icon consume from your weekly 2-edit quota.
                  </p>
                </div>
                <span className="text-xs font-mono font-bold text-gray-400">
                  ID: {activeDriverAuto?.id}
                </span>
              </div>

              <form onSubmit={handleDriverProfileSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  {/* Driver Name (Quota Sensitive) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        {driverQuota?.isLocked ? (
                          <Lock size={12} className="text-red-500" />
                        ) : (
                          <Unlock size={12} className="text-emerald-600" />
                        )}
                        Driver Name (2x/week limit)
                      </span>
                      {driverQuota?.isLocked && (
                        <span className="text-[10px] text-red-600 font-bold">
                          Locked
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      disabled={driverQuota?.isLocked}
                      value={driverFormData.driverName}
                      onChange={(e) =>
                        setDriverFormData({
                          ...driverFormData,
                          driverName: e.target.value
                        })
                      }
                      className={`w-full rounded-2xl px-3.5 py-2.5 text-xs font-semibold outline-none border transition-colors ${
                        driverQuota?.isLocked
                          ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gray-50 border-gray-200 focus:bg-white focus:border-amber-400 text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Vehicle Identity Name (Quota Sensitive) */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        {driverQuota?.isLocked ? (
                          <Lock size={12} className="text-red-500" />
                        ) : (
                          <Unlock size={12} className="text-emerald-600" />
                        )}
                        Vehicle Display Name (2x/week limit)
                      </span>
                      {driverQuota?.isLocked && (
                        <span className="text-[10px] text-red-600 font-bold">
                          Locked
                        </span>
                      )}
                    </label>
                    <input
                      type="text"
                      disabled={driverQuota?.isLocked}
                      value={driverFormData.name}
                      onChange={(e) =>
                        setDriverFormData({
                          ...driverFormData,
                          name: e.target.value
                        })
                      }
                      className={`w-full rounded-2xl px-3.5 py-2.5 text-xs font-semibold outline-none border transition-colors ${
                        driverQuota?.isLocked
                          ? "bg-gray-100 border-gray-200 text-gray-400 cursor-not-allowed"
                          : "bg-gray-50 border-gray-200 focus:bg-white focus:border-amber-400 text-gray-900"
                      }`}
                    />
                  </div>

                  {/* Phone / WhatsApp */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <Phone size={12} className="text-emerald-600" />
                      Phone / WhatsApp Number
                    </label>
                    <input
                      type="text"
                      value={driverFormData.phone}
                      onChange={(e) =>
                        setDriverFormData({
                          ...driverFormData,
                          phone: e.target.value
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-400 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none"
                    />
                  </div>

                  {/* Vehicle Plate */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <CarTaxiFront size={12} className="text-amber-600" />
                      Vehicle Plate Number
                    </label>
                    <input
                      type="text"
                      value={driverFormData.vehicleNumber}
                      onChange={(e) =>
                        setDriverFormData({
                          ...driverFormData,
                          vehicleNumber: e.target.value
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-400 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none font-mono"
                    />
                  </div>

                  {/* Category */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Vehicle Category
                    </label>
                    <select
                      value={driverFormData.category}
                      onChange={(e) =>
                        setDriverFormData({
                          ...driverFormData,
                          category: e.target.value
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-400 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none"
                    >
                      {CATEGORIES.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat} Auto
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fuel Type */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">
                      Fuel / Energy Type
                    </label>
                    <select
                      value={driverFormData.fuelType}
                      onChange={(e) =>
                        setDriverFormData({
                          ...driverFormData,
                          fuelType: e.target.value
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-400 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none"
                    >
                      {FUEL_TYPES.map((f) => (
                        <option key={f} value={f}>
                          {f}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Primary Operating Area */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <MapPin size={12} className="text-red-500" />
                      Operating Area / Stand
                    </label>
                    <input
                      type="text"
                      value={driverFormData.area}
                      onChange={(e) =>
                        setDriverFormData({
                          ...driverFormData,
                          area: e.target.value
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-400 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none"
                    />
                  </div>

                  {/* Base Fare Estimate */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700 flex items-center gap-1.5">
                      <IndianRupee size={12} className="text-emerald-700" />
                      Base Fare Estimate (₹)
                    </label>
                    <input
                      type="number"
                      value={driverFormData.fareEstimate}
                      onChange={(e) =>
                        setDriverFormData({
                          ...driverFormData,
                          fareEstimate: Number(e.target.value)
                        })
                      }
                      className="w-full bg-gray-50 border border-gray-200 focus:bg-white focus:border-amber-400 rounded-2xl px-3.5 py-2.5 text-xs font-semibold text-gray-900 outline-none"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-extrabold px-6 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-sm transition-all"
                  >
                    <Check size={16} />
                    <span>Save Profile Changes</span>
                  </button>
                </div>
              </form>
            </div>

            {/* Official Verification QR Badge for this Driver */}
            <div className="bg-white p-6 rounded-3xl border border-gray-200 shadow-xs flex flex-col md:flex-row items-center gap-6">
              <div className="p-3 bg-white border-2 border-dashed border-gray-300 rounded-3xl shrink-0 shadow-xs">
                {activeDriverAuto && (
                  <QRCodeSVG
                    value={getVerificationUrl(activeDriverAuto, true)}
                    size={130}
                    level="H"
                  />
                )}
              </div>

              <div className="space-y-2 text-center md:text-left flex-1">
                <span className="text-[10px] font-black uppercase tracking-widest text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-md inline-block">
                  Official Verification QR
                </span>
                <h4 className="font-extrabold text-base text-gray-950">
                  {activeDriverAuto?.autoNumber} Verification Badge
                </h4>
                <p className="text-xs text-gray-500 leading-relaxed font-medium">
                  Riders scan this QR code before boarding to verify your identity,
                  tamper-evident hash, and vehicle details.
                </p>
                <div className="font-mono text-xs font-bold text-gray-800 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200 inline-block">
                  Hash: {activeDriverAuto?.verificationHash}
                </div>
                <div className="pt-1">
                  <Link
                    to={`/verify?auto=${encodeURIComponent(
                      activeDriverAuto?.autoNumber || ""
                    )}&hash=${encodeURIComponent(
                      activeDriverAuto?.verificationHash || ""
                    )}`}
                    className="text-xs font-bold text-emerald-700 hover:text-emerald-800 inline-flex items-center gap-1"
                  >
                    <span>Test Passenger Verification View</span>
                    <ExternalLink size={12} />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ============================================================ */}
      {/* MODAL: EDIT AUTO PROFILE (SUPER ADMIN OVERRIDE)              */}
      {/* ============================================================ */}
      {editingAuto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="font-black text-sm text-gray-950">
                  Super Admin: Edit {editingAuto.autoNumber}
                </h3>
                <p className="text-xs text-gray-500">
                  Super admin bypasses the 2-edits-per-week rate limit.
                </p>
              </div>
              <button
                onClick={() => setEditingAuto(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const updates = {
                  driverName: formData.get("driverName"),
                  name: formData.get("name"),
                  phone: formData.get("phone"),
                  vehicleNumber: formData.get("vehicleNumber"),
                  area: formData.get("area"),
                  category: formData.get("category"),
                  fuelType: formData.get("fuelType"),
                  fareEstimate: Number(formData.get("fareEstimate"))
                };
                const res = updateAutoProfile(editingAuto.id, updates, true);
                if (res.success) {
                  showToast("Auto profile updated by Super Admin", "success");
                  setAutos(getAutos());
                  setEditingAuto(null);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Driver Name
                </label>
                <input
                  name="driverName"
                  defaultValue={editingAuto.driverName}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold outline-none focus:bg-white focus:border-amber-400"
                />
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Vehicle Name
                </label>
                <input
                  name="name"
                  defaultValue={editingAuto.name}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold outline-none focus:bg-white focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Phone
                  </label>
                  <input
                    name="phone"
                    defaultValue={editingAuto.phone}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold outline-none focus:bg-white focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Vehicle Plate
                  </label>
                  <input
                    name="vehicleNumber"
                    defaultValue={editingAuto.vehicleNumber}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold font-mono outline-none focus:bg-white focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    defaultValue={editingAuto.category}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Fuel
                  </label>
                  <select
                    name="fuelType"
                    defaultValue={editingAuto.fuelType}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold outline-none"
                  >
                    {FUEL_TYPES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Operating Area
                  </label>
                  <input
                    name="area"
                    defaultValue={editingAuto.area}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold outline-none focus:bg-white focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Fare Estimate (₹)
                  </label>
                  <input
                    name="fareEstimate"
                    type="number"
                    defaultValue={editingAuto.fareEstimate}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold outline-none focus:bg-white focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setEditingAuto(null)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-500 text-gray-950 font-black px-5 py-2 rounded-xl shadow-xs"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: REGISTER NEW AUTO (SUPER ADMIN ONLY)                  */}
      {/* ============================================================ */}
      {isNewAutoModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 max-h-[90vh] overflow-y-auto shadow-2xl animate-in zoom-in-95">
            <div className="flex items-center justify-between pb-2 border-b border-gray-100">
              <div>
                <h3 className="font-black text-sm text-gray-950">
                  Register New Auto to Fleet
                </h3>
                <p className="text-xs text-gray-500">
                  Generates tamper-evident verification hash automatically.
                </p>
              </div>
              <button
                onClick={() => setIsNewAutoModalOpen(false)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <form
              onSubmit={(e) => {
                e.preventDefault();
                const formData = new FormData(e.target);
                const newAutoData = {
                  autoNumber: formData.get("autoNumber"),
                  driverName: formData.get("driverName"),
                  name: formData.get("name"),
                  phone: formData.get("phone"),
                  vehicleNumber: formData.get("vehicleNumber"),
                  area: formData.get("area"),
                  category: formData.get("category"),
                  fuelType: formData.get("fuelType"),
                  fareEstimate: Number(formData.get("fareEstimate")) || 100
                };
                const res = addNewAuto(newAutoData, "Super Admin");
                if (res.success) {
                  showToast(
                    `Registered ${res.auto.autoNumber} (${res.auto.driverName})`,
                    "success"
                  );
                  setAutos(getAutos());
                  setIsNewAutoModalOpen(false);
                }
              }}
              className="space-y-3 text-xs"
            >
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Auto Number (e.g. AB-999)
                  </label>
                  <input
                    name="autoNumber"
                    placeholder="AB-999"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold outline-none focus:bg-white focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Driver Name
                  </label>
                  <input
                    name="driverName"
                    placeholder="Full Driver Name"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold outline-none focus:bg-white focus:border-amber-400"
                  />
                </div>
              </div>

              <div>
                <label className="font-bold text-gray-700 block mb-1">
                  Vehicle Model Name
                </label>
                <input
                  name="name"
                  placeholder="e.g. Bajaj RE EV Express"
                  required
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold outline-none focus:bg-white focus:border-amber-400"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Phone Number
                  </label>
                  <input
                    name="phone"
                    placeholder="+91 98000 00000"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold outline-none focus:bg-white focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Vehicle Plate
                  </label>
                  <input
                    name="vehicleNumber"
                    placeholder="JH05-XX-1234"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold font-mono outline-none focus:bg-white focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold outline-none"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Fuel
                  </label>
                  <select
                    name="fuelType"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold outline-none"
                  >
                    {FUEL_TYPES.map((f) => (
                      <option key={f} value={f}>
                        {f}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Operating Stand / Area
                  </label>
                  <input
                    name="area"
                    placeholder="e.g. Sakchi Stand"
                    required
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold outline-none focus:bg-white focus:border-amber-400"
                  />
                </div>
                <div>
                  <label className="font-bold text-gray-700 block mb-1">
                    Base Fare Estimate (₹)
                  </label>
                  <input
                    name="fareEstimate"
                    type="number"
                    defaultValue={100}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-semibold outline-none focus:bg-white focus:border-amber-400"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewAutoModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-gray-600 font-bold hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-amber-400 hover:bg-amber-500 text-gray-950 font-black px-5 py-2 rounded-xl shadow-xs"
                >
                  Add Auto
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ============================================================ */}
      {/* MODAL: QR & SECURITY HASH VIEWER                             */}
      {/* ============================================================ */}
      {qrModalAuto && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-sm w-full p-6 text-center space-y-4 shadow-2xl animate-in zoom-in-95">
            <div className="flex justify-end">
              <button
                onClick={() => setQrModalAuto(null)}
                className="text-gray-400 hover:text-gray-700"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex justify-center p-3 bg-white border-2 border-dashed border-gray-200 rounded-2xl mx-auto w-fit">
              <QRCodeSVG
                value={getVerificationUrl(qrModalAuto, true)}
                size={160}
                level="H"
              />
            </div>

            <div>
              <span className="text-[10px] font-bold text-amber-800 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded uppercase">
                {qrModalAuto.autoNumber}
              </span>
              <h3 className="font-extrabold text-base text-gray-900 mt-1">
                {qrModalAuto.driverName}
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                {qrModalAuto.vehicleNumber} • {qrModalAuto.vehicleType}
              </p>
            </div>

            <div className="bg-gray-50 p-2.5 rounded-xl border border-gray-200 text-xs font-mono font-bold text-gray-800">
              Security Hash: {qrModalAuto.verificationHash}
            </div>

            <Link
              to={`/verify?auto=${encodeURIComponent(
                qrModalAuto.autoNumber
              )}&hash=${encodeURIComponent(qrModalAuto.verificationHash)}`}
              onClick={() => setQrModalAuto(null)}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <span>Test Public Verification</span>
              <ExternalLink size={14} />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
