import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CarTaxiFront,
  UserCheck,
  Calendar,
  Clock,
  ShieldCheck,
  Star,
  MapPin,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Phone,
  MessageCircle,
  Sparkles,
  Info,
  Check,
  Car,
  AlertCircle,
  HelpCircle,
  CalendarRange
} from "lucide-react";
import {
  RENTAL_PACKAGES,
  RENTAL_DRIVERS,
  RENTAL_SERVICE_TYPES,
  createRentalBooking,
  getRentalBookings
} from "../data/rentals.js";
import { useAuth } from "../context/AuthContext.jsx";

export default function RentDriverPage() {
  const navigate = useNavigate();
  const { user, isSignedIn, openAuthModal } = useAuth();

  const [activeTab, setActiveTab] = useState("packages"); // "packages" | "drivers" | "my_rentals"
  const [serviceType, setServiceType] = useState("auto_and_driver");
  const [selectedPackageId, setSelectedPackageId] = useState("pkg-4h");
  const [selectedDriverId, setSelectedDriverId] = useState("rd-101");

  // Booking form state
  const [pickupAddress, setPickupAddress] = useState(
    user?.savedPlaces?.[0]?.address || "Sakchi Golchakkar, Jamshedpur"
  );
  const [startDate, setStartDate] = useState(
    () => new Date().toISOString().split("T")[0]
  );
  const [startTime, setStartTime] = useState("10:00 AM");
  const [tripNote, setTripNote] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState(null);

  // My rentals list
  const [rentalHistory, setRentalHistory] = useState(() => getRentalBookings());

  const selectedPackage =
    RENTAL_PACKAGES.find((p) => p.id === selectedPackageId) ||
    RENTAL_PACKAGES[1];

  const selectedDriver =
    RENTAL_DRIVERS.find((d) => d.id === selectedDriverId) || RENTAL_DRIVERS[0];

  // Adjust price if driver only
  const calculatedFare =
    serviceType === "driver_only"
      ? Math.round(selectedPackage.price * 0.65)
      : serviceType === "school_office_monthly"
      ? 3500
      : selectedPackage.price;

  const handleConfirmRental = (e) => {
    e?.preventDefault();
    if (!pickupAddress.trim()) return;

    setIsSubmitting(true);
    setTimeout(() => {
      const newBooking = createRentalBooking({
        packageId: selectedPackage.id,
        packageName:
          serviceType === "school_office_monthly"
            ? "Monthly Commute Pass"
            : selectedPackage.name,
        serviceType,
        durationHours:
          serviceType === "school_office_monthly"
            ? 30 * 2
            : selectedPackage.durationHours,
        includedKm:
          serviceType === "school_office_monthly"
            ? 300
            : selectedPackage.includedKm,
        totalFare: calculatedFare,
        driverId: selectedDriver.id,
        driverName: selectedDriver.name,
        driverPhone: selectedDriver.phone,
        autoNumber: selectedDriver.autoNumber,
        vehicleNumber: selectedDriver.vehicleNumber,
        pickupAddress,
        startDate,
        startTime,
        purpose: tripNote.trim() || "City Errands & Multi-stop Rental",
        passengerName: user?.name || "Verified Customer",
        passengerPhone: user?.phone || "+91 98765 43210",
        passengerId: user?.id || ""
      });

      setIsSubmitting(false);
      setConfirmedBooking(newBooking);
      setRentalHistory(getRentalBookings());
    }, 450);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-32" data-testid="rent-driver-page">
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
          <div className="text-center">
            <h1 className="font-extrabold text-base text-gray-900 leading-tight">
              Rent Auto & Driver
            </h1>
            <p className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider">
              By Hour • Day • Monthly
            </p>
          </div>
          <Link
            to="/profile"
            className="w-9 h-9 rounded-full bg-amber-100 flex items-center justify-center font-bold text-xs text-amber-950"
            title="Profile"
          >
            {user ? user.name[0] : "AB"}
          </Link>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 pt-4 space-y-4">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-amber-400 via-amber-300 to-yellow-200 rounded-3xl p-5 shadow-xs text-gray-950 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 bg-black/10 px-2.5 py-0.5 rounded-full text-xs font-black">
              <ShieldCheck size={14} />
              <span>Jamshedpur Chauffeur Fleet</span>
            </div>
            <span className="text-[11px] font-black tracking-wide">NAKPRC</span>
          </div>

          <div>
            <h2 className="text-2xl font-black tracking-tight leading-tight">
              Hire a Verified Bhaiya <br />
              <span className="text-emerald-950">On Your Schedule</span>
            </h2>
            <p className="text-xs font-semibold text-gray-800/90 mt-1">
              Multi-stop market shopping, family hospital visits, sight-seeing, or hiring a driver for your own auto/car.
            </p>
          </div>

          {/* Quick Pillars */}
          <div className="grid grid-cols-3 gap-2 pt-1 text-center">
            <div className="bg-white/80 backdrop-blur-xs p-2 rounded-xl border border-amber-200">
              <span className="block text-xs font-black text-gray-900">Zero Surge</span>
              <span className="text-[9px] text-gray-600 font-bold">Standard Rates</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-2 rounded-xl border border-amber-200">
              <span className="block text-xs font-black text-gray-900">Wait Free</span>
              <span className="text-[9px] text-gray-600 font-bold">Hours Included</span>
            </div>
            <div className="bg-white/80 backdrop-blur-xs p-2 rounded-xl border border-amber-200">
              <span className="block text-xs font-black text-gray-900">Verified</span>
              <span className="text-[9px] text-gray-600 font-bold">Police Checked</span>
            </div>
          </div>
        </div>

        {/* View Switcher Tabs */}
        <div className="grid grid-cols-3 p-1 bg-gray-200/80 rounded-2xl text-xs font-bold">
          <button
            onClick={() => setActiveTab("packages")}
            className={`py-2 rounded-xl transition-all ${
              activeTab === "packages"
                ? "bg-white text-gray-950 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Hourly Packages
          </button>
          <button
            onClick={() => setActiveTab("drivers")}
            className={`py-2 rounded-xl transition-all ${
              activeTab === "drivers"
                ? "bg-white text-gray-950 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Choose Driver
          </button>
          <button
            onClick={() => setActiveTab("my_rentals")}
            className={`py-2 rounded-xl transition-all ${
              activeTab === "my_rentals"
                ? "bg-white text-gray-950 shadow-xs"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            My Rentals ({rentalHistory.length})
          </button>
        </div>

        {/* ============================================================ */}
        {/* TAB 1: PACKAGES & DIRECT BOOKING                             */}
        {/* ============================================================ */}
        {activeTab === "packages" && (
          <div className="space-y-4">
            {/* Service Mode Selector */}
            <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-xs space-y-2.5">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block">
                Select Rental Category
              </span>

              <div className="grid grid-cols-1 gap-2">
                <button
                  type="button"
                  onClick={() => setServiceType("auto_and_driver")}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    serviceType === "auto_and_driver"
                      ? "border-emerald-500 bg-emerald-50/40 ring-2 ring-emerald-400/20"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
                      <CarTaxiFront size={20} />
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-gray-900">
                        Auto + Verified Driver
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Vehicle & driver for your city trip / errands
                      </p>
                    </div>
                  </div>
                  {serviceType === "auto_and_driver" && (
                    <CheckCircle2 size={18} className="text-emerald-600" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setServiceType("driver_only")}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    serviceType === "driver_only"
                      ? "border-amber-500 bg-amber-50/40 ring-2 ring-amber-400/20"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
                      <UserCheck size={20} />
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-gray-900">
                        Hire Driver Only
                      </p>
                      <p className="text-[11px] text-gray-500">
                        For your personal auto, van, or private car (35% off)
                      </p>
                    </div>
                  </div>
                  {serviceType === "driver_only" && (
                    <CheckCircle2 size={18} className="text-amber-600" />
                  )}
                </button>

                <button
                  type="button"
                  onClick={() => setServiceType("school_office_monthly")}
                  className={`p-3 rounded-2xl border text-left flex items-center justify-between transition-all ${
                    serviceType === "school_office_monthly"
                      ? "border-indigo-500 bg-indigo-50/40 ring-2 ring-indigo-400/20"
                      : "border-gray-200 hover:bg-gray-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-900 flex items-center justify-center shrink-0">
                      <CalendarRange size={20} />
                    </div>
                    <div>
                      <p className="font-extrabold text-xs text-gray-900">
                        Monthly School / Office Pass
                      </p>
                      <p className="text-[11px] text-gray-500">
                        Fixed morning pickup & afternoon return every weekday
                      </p>
                    </div>
                  </div>
                  {serviceType === "school_office_monthly" && (
                    <CheckCircle2 size={18} className="text-indigo-600" />
                  )}
                </button>
              </div>
            </div>

            {/* Package Cards */}
            {serviceType !== "school_office_monthly" ? (
              <div className="space-y-2.5">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 block px-1">
                  Choose Duration Package
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {RENTAL_PACKAGES.map((pkg) => {
                    const isSelected = selectedPackageId === pkg.id;
                    const displayPrice =
                      serviceType === "driver_only"
                        ? Math.round(pkg.price * 0.65)
                        : pkg.price;

                    return (
                      <div
                        key={pkg.id}
                        onClick={() => setSelectedPackageId(pkg.id)}
                        className={`cursor-pointer bg-white rounded-3xl p-4 border transition-all relative ${
                          isSelected
                            ? "border-emerald-500 ring-2 ring-emerald-400/20 shadow-sm"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        {pkg.popular && (
                          <span className="absolute -top-2.5 right-4 bg-emerald-600 text-white text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full shadow-2xs">
                            {pkg.tag}
                          </span>
                        )}

                        <div className="flex items-start justify-between">
                          <div>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">
                              {pkg.durationHours} Hours • {pkg.includedKm} KM
                            </span>
                            <h3 className="font-black text-sm text-gray-950 mt-0.5">
                              {pkg.name}
                            </h3>
                          </div>
                          <span className="text-lg font-black text-gray-950">
                            ₹{displayPrice}
                          </span>
                        </div>

                        <p className="text-[11px] text-gray-500 mt-2 leading-relaxed">
                          {pkg.description}
                        </p>

                        <div className="mt-3 pt-2.5 border-t border-gray-100 flex items-center justify-between text-[10px] text-gray-500 font-medium">
                          <span>Extra: ₹{pkg.extraKmRate}/km</span>
                          <span>Extra hr: ₹{pkg.extraHourRate}/hr</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="bg-indigo-50/70 border border-indigo-200 rounded-3xl p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-indigo-800">
                      Monthly Subscription Pass
                    </span>
                    <h3 className="font-black text-base text-indigo-950 mt-0.5">
                      30-Day School & College Commute
                    </h3>
                  </div>
                  <span className="text-xl font-black text-indigo-950">
                    ₹3,500 <span className="text-xs font-normal text-gray-600">/mo</span>
                  </span>
                </div>
                <p className="text-xs text-indigo-900/80 leading-relaxed font-medium">
                  Guaranteed daily pickup from your home doorstep directly to school/college gate, and safe return drop. Includes live parent tracking link and zero surge charges.
                </p>
              </div>
            )}

            {/* Selected Driver Profile Preview */}
            <div className="bg-white border border-gray-200 rounded-3xl p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-black uppercase tracking-wider text-gray-400">
                  Assigned Verified Bhaiya
                </span>
                <button
                  onClick={() => setActiveTab("drivers")}
                  className="text-[11px] font-bold text-emerald-700 hover:underline"
                >
                  Change Driver
                </button>
              </div>

              <div className="flex items-center gap-3">
                <img
                  src={selectedDriver.avatar}
                  alt={selectedDriver.name}
                  className="w-13 h-13 rounded-2xl object-cover shrink-0 shadow-2xs border border-gray-100"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-black text-sm text-gray-950 truncate">
                      {selectedDriver.name}
                    </h4>
                    <span className="text-[10px] font-mono font-bold bg-amber-50 text-amber-900 px-1.5 py-0.5 rounded border border-amber-200">
                      {selectedDriver.autoNumber}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500 mt-0.5">
                    <span className="flex items-center gap-0.5 font-bold text-gray-900">
                      <Star size={12} className="text-amber-500 fill-amber-400" />
                      {selectedDriver.rating}
                    </span>
                    <span>•</span>
                    <span>{selectedDriver.experienceYears} yrs exp.</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">
                      {selectedDriver.operatingHub}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Booking Details Input Form */}
            <form
              onSubmit={handleConfirmRental}
              className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-4"
            >
              <h3 className="font-black text-xs uppercase tracking-wider text-gray-400">
                Rental Schedule & Location
              </h3>

              {/* Pickup Point */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1 flex items-center gap-1">
                  <MapPin size={13} className="text-emerald-600" />
                  <span>Pickup Location (Jamshedpur)</span>
                </label>
                <input
                  type="text"
                  value={pickupAddress}
                  onChange={(e) => setPickupAddress(e.target.value)}
                  placeholder="Enter home, apartment, or landmark..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-bold text-gray-900 focus:bg-white focus:border-amber-400 outline-none"
                  required
                />
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={startDate}
                    onChange={(e) => setStartDate(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:bg-white focus:border-amber-400 outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-gray-700 mb-1">
                    Start Time
                  </label>
                  <input
                    type="text"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    placeholder="e.g. 10:00 AM"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-900 focus:bg-white focus:border-amber-400 outline-none"
                  />
                </div>
              </div>

              {/* Errand Notes */}
              <div>
                <label className="block text-[11px] font-bold text-gray-700 mb-1">
                  Trip Note / Stops (Optional)
                </label>
                <input
                  type="text"
                  value={tripNote}
                  onChange={(e) => setTripNote(e.target.value)}
                  placeholder="e.g. TMH Hospital, then Bistupur market with waiting"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-medium text-gray-900 focus:bg-white focus:border-amber-400 outline-none"
                />
              </div>

              {/* Passenger Info */}
              <div className="pt-2 border-t border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">
                    Customer Name
                  </span>
                  <span className="font-extrabold text-gray-900">
                    {user?.name || "Booking as Guest"}
                  </span>
                </div>
                {!isSignedIn && (
                  <button
                    type="button"
                    onClick={() => openAuthModal("phone")}
                    className="text-[11px] font-bold text-emerald-700 underline"
                  >
                    Sign In
                  </button>
                )}
              </div>

              {/* Confirm Rental Button */}
              <button
                type="submit"
                disabled={isSubmitting || !pickupAddress.trim()}
                className="w-full py-4 rounded-2xl bg-amber-400 hover:bg-amber-500 active:scale-98 text-gray-950 font-black text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/30 transition-all disabled:opacity-50"
              >
                {isSubmitting ? (
                  <span>Reserving Auto Bhaiya...</span>
                ) : (
                  <>
                    <span>Book Rental ({calculatedFare ? `₹${calculatedFare}` : ""})</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-[10px] text-gray-400 text-center leading-tight">
                No advance payment needed. Pay direct to Bhaiya via UPI or Cash upon arrival.
              </p>
            </form>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 2: CHOOSE VERIFIED DRIVERS FOR RENT                      */}
        {/* ============================================================ */}
        {activeTab === "drivers" && (
          <div className="space-y-3">
            <div className="px-1">
              <h3 className="font-black text-sm text-gray-900">
                Verified Bhaiyas Available for Hire
              </h3>
              <p className="text-xs text-gray-500">
                Experienced, background-checked drivers ready for hourly and daily hire.
              </p>
            </div>

            <div className="space-y-3">
              {RENTAL_DRIVERS.map((d) => {
                const isSelected = selectedDriverId === d.id;
                return (
                  <div
                    key={d.id}
                    className={`bg-white rounded-3xl p-5 border shadow-xs transition-all ${
                      isSelected
                        ? "border-emerald-500 ring-2 ring-emerald-400/20"
                        : "border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <img
                        src={d.avatar}
                        alt={d.name}
                        className="w-16 h-16 rounded-2xl object-cover shrink-0 shadow-2xs border border-gray-100"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <h4 className="font-black text-base text-gray-950 leading-tight">
                            {d.name}
                          </h4>
                          <span className="text-xs font-black text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                            ₹{d.hourlyRate}/hr
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-gray-500 mt-1">
                          <span className="flex items-center gap-0.5 font-bold text-gray-900">
                            <Star size={12} className="text-amber-500 fill-amber-400" />
                            {d.rating}
                          </span>
                          <span>•</span>
                          <span>{d.experienceYears} yrs exp.</span>
                          <span>•</span>
                          <span>{d.totalRentalTrips}+ trips</span>
                        </div>

                        <p className="text-xs text-gray-600 mt-2 line-clamp-2 leading-relaxed">
                          {d.bio}
                        </p>

                        <div className="flex flex-wrap gap-1.5 mt-2.5">
                          {d.badges.map((b) => (
                            <span
                              key={b}
                              className="text-[9px] font-bold bg-gray-100 text-gray-700 px-2 py-0.5 rounded-md"
                            >
                              {b}
                            </span>
                          ))}
                        </div>

                        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
                          <div className="text-[11px] text-gray-500 font-medium">
                            Operating: <strong className="text-gray-900">{d.operatingHub}</strong>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              setSelectedDriverId(d.id);
                              setActiveTab("packages");
                            }}
                            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                              isSelected
                                ? "bg-emerald-600 text-white shadow-xs"
                                : "bg-gray-950 hover:bg-black text-white"
                            }`}
                          >
                            {isSelected ? "Selected ✓" : "Select Bhaiya"}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ============================================================ */}
        {/* TAB 3: MY RENTALS LIST                                       */}
        {/* ============================================================ */}
        {activeTab === "my_rentals" && (
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <div>
                <h3 className="font-black text-sm text-gray-900">
                  Rental Bookings History
                </h3>
                <p className="text-xs text-gray-500">
                  Your active and completed hourly / daily rentals
                </p>
              </div>
              <button
                onClick={() => setActiveTab("packages")}
                className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200"
              >
                + New Rental
              </button>
            </div>

            {rentalHistory.length > 0 ? (
              <div className="space-y-3">
                {rentalHistory.map((rental) => (
                  <div
                    key={rental.id}
                    className="bg-white border border-gray-200 rounded-3xl p-5 shadow-xs space-y-3"
                  >
                    <div className="flex items-center justify-between pb-2.5 border-b border-gray-100">
                      <div>
                        <span className="font-mono font-bold text-xs text-gray-950">
                          {rental.bookingNumber}
                        </span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          {rental.startDate} at {rental.startTime}
                        </span>
                      </div>
                      <span
                        className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                          rental.status === "completed"
                            ? "bg-emerald-50 text-emerald-800 border-emerald-200"
                            : "bg-amber-50 text-amber-800 border-amber-200"
                        }`}
                      >
                        {rental.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-black text-sm text-gray-900">
                          {rental.packageName}
                        </h4>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Driver: <strong>{rental.driverName}</strong> ({rental.autoNumber})
                        </p>
                        <p className="text-[11px] text-gray-500 mt-1 flex items-center gap-1">
                          <MapPin size={12} className="text-emerald-600" />
                          <span className="truncate max-w-[220px]">{rental.pickupAddress}</span>
                        </p>
                      </div>
                      <div className="text-right">
                        <span className="text-base font-black text-gray-950 block">
                          ₹{rental.totalFare}
                        </span>
                        <span className="text-[10px] font-bold text-emerald-700">
                          {rental.paymentStatus === "completed" ? "Paid" : "Pay on arrival"}
                        </span>
                      </div>
                    </div>

                    <div className="pt-2 flex gap-2">
                      <a
                        href={`tel:${rental.driverPhone?.replace(/\s+/g, "")}`}
                        className="flex-1 py-2 bg-emerald-50 text-emerald-900 hover:bg-emerald-100 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors border border-emerald-200"
                      >
                        <Phone size={14} />
                        <span>Call Bhaiya</span>
                      </a>
                      <a
                        href={`https://wa.me/${rental.driverPhone?.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-bold text-xs rounded-xl flex items-center justify-center gap-1.5 transition-colors"
                      >
                        <MessageCircle size={14} />
                        <span>WhatsApp</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="bg-white border border-gray-200 rounded-3xl p-8 text-center space-y-3">
                <CarTaxiFront size={32} className="mx-auto text-gray-400" />
                <h4 className="font-bold text-sm text-gray-800">No Rental Bookings Yet</h4>
                <p className="text-xs text-gray-500 max-w-xs mx-auto">
                  Book an Auto Bhaiya by the hour for multi-stop errands or city tours.
                </p>
                <button
                  onClick={() => setActiveTab("packages")}
                  className="bg-amber-400 hover:bg-amber-500 text-gray-950 font-bold text-xs px-4 py-2 rounded-xl shadow-xs"
                >
                  Browse Packages
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Confirmation Success Modal */}
      {confirmedBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-gray-100 text-center space-y-4">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <CheckCircle2 size={36} />
            </div>

            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200">
                Rental Confirmed
              </span>
              <h3 className="text-xl font-black text-gray-950 mt-2">
                Auto Bhaiya Assigned!
              </h3>
              <p className="text-xs text-gray-500 mt-0.5">
                Booking ID: <strong>{confirmedBooking.bookingNumber}</strong>
              </p>
            </div>

            {/* Assigned Driver Card */}
            <div className="bg-gray-50 border border-gray-200 rounded-2xl p-4 text-left flex items-center gap-3">
              <img
                src={selectedDriver.avatar}
                alt={confirmedBooking.driverName}
                className="w-12 h-12 rounded-xl object-cover"
              />
              <div className="flex-1 min-w-0">
                <p className="font-extrabold text-sm text-gray-900">
                  {confirmedBooking.driverName}
                </p>
                <p className="text-xs text-gray-500 font-mono">
                  {confirmedBooking.autoNumber} • {confirmedBooking.vehicleNumber}
                </p>
                <p className="text-[11px] text-emerald-700 font-bold mt-0.5">
                  ₹{confirmedBooking.totalFare} for {confirmedBooking.packageName}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2">
              <a
                href={`tel:${confirmedBooking.driverPhone?.replace(/\s+/g, "")}`}
                className="py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30"
              >
                <Phone size={15} />
                <span>Call Bhaiya</span>
              </a>
              <button
                onClick={() => {
                  setConfirmedBooking(null);
                  setActiveTab("my_rentals");
                }}
                className="py-3 rounded-2xl bg-gray-950 hover:bg-black text-white font-bold text-xs transition-colors"
              >
                View Rentals
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
