/**
 * Auto Bhaiya - Local Booking Management
 * Manages bookings in browser localStorage
 */

import {
  syncBookingToAppwrite,
  updateAppwriteBookingStatus,
  subscribeToBookingRealtime,
  isAppwriteConfigured
} from "../lib/appwrite.js";

const STORAGE_KEY = "autobhaiya_bookings_v1";

/**
 * @typedef {Object} Booking
 * @property {string} id
 * @property {string} bookingNumber
 * @property {string} autoId
 * @property {string} autoNumber
 * @property {string} driverName
 * @property {string} driverPhone
 * @property {string} vehicleNumber
 * @property {string} vehicleType
 * @property {string} pickup
 * @property {string} destination
 * @property {number} fareEstimate
 * @property {string} createdAt
 * @property {"created" | "contacting" | "accepted" | "arriving" | "started" | "completed"} status
 * @property {"pending" | "completed"} paymentStatus
 */

/**
 * Get all stored bookings
 * @returns {Booking[]}
 */
export function getBookings() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      // Seed a default demo booking so user sees realistic data
      const defaultBooking = {
        id: "ABR-10291",
        bookingNumber: "ABR-10291",
        autoId: "auto-101",
        autoNumber: "AB-101",
        driverName: "Ashok Kumar",
        driverPhone: "+91 98351 23401",
        vehicleNumber: "JH05-AB-1234",
        vehicleType: "CNG Auto",
        pickup: "Sakchi Golchakkar",
        destination: "Bistupur Market",
        fareEstimate: 120,
        createdAt: new Date(Date.now() - 3600000).toISOString(),
        status: "completed",
        paymentStatus: "completed"
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify([defaultBooking]));
      return [defaultBooking];
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("Error reading bookings from localStorage:", err);
    return [];
  }
}

/**
 * Get a specific booking by ID or bookingNumber
 * @param {string} id
 * @returns {Booking | undefined}
 */
export function getBookingById(id) {
  if (!id) return undefined;
  const bookings = getBookings();
  const clean = id.trim().toLowerCase();
  return bookings.find(
    (b) => b.id.toLowerCase() === clean || b.bookingNumber.toLowerCase() === clean
  );
}

/**
 * Create a new booking
 * @param {Object} params
 * @param {import("./autos.js").Auto} params.auto
 * @param {string} params.pickup
 * @param {string} params.destination
 * @param {number} [params.fareEstimate]
 * @returns {Booking}
 */
export function createBooking({ auto, pickup, destination, fareEstimate }) {
  const randomNum = Math.floor(10000 + Math.random() * 90000);
  const bookingNumber = `ABR-${randomNum}`;

  /** @type {Booking} */
  const newBooking = {
    id: bookingNumber,
    bookingNumber,
    autoId: auto.id,
    autoNumber: auto.autoNumber,
    driverName: auto.driverName,
    driverPhone: auto.phone,
    vehicleNumber: auto.vehicleNumber,
    vehicleType: auto.vehicleType,
    pickup: pickup || auto.area,
    destination: destination || "Bistupur Market",
    fareEstimate: fareEstimate || auto.fareEstimate || 120,
    createdAt: new Date().toISOString(),
    status: "accepted",
    paymentStatus: "pending"
  };

  const current = getBookings();
  const updated = [newBooking, ...current.filter((b) => b.id !== newBooking.id)];
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("autobhaiya_booking_updated", { detail: newBooking }));

  if (isAppwriteConfigured()) {
    syncBookingToAppwrite(newBooking);
  }

  return newBooking;
}

/**
 * Update booking status
 * @param {string} id
 * @param {Booking["status"]} status
 * @returns {Booking | undefined}
 */
export function updateBookingStatus(id, status) {
  const bookings = getBookings();
  const index = bookings.findIndex((b) => b.id === id || b.bookingNumber === id);
  if (index === -1) return undefined;

  bookings[index] = {
    ...bookings[index],
    status,
    ...(status === "completed" ? { completedAt: new Date().toISOString() } : {})
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  window.dispatchEvent(new CustomEvent("autobhaiya_booking_updated", { detail: bookings[index] }));

  if (isAppwriteConfigured()) {
    updateAppwriteBookingStatus(bookings[index].id, status, null);
  }

  return bookings[index];
}

/**
 * Update payment status
 * @param {string} id
 * @param {"pending" | "completed"} paymentStatus
 * @returns {Booking | undefined}
 */
export function updatePaymentStatus(id, paymentStatus) {
  const bookings = getBookings();
  const index = bookings.findIndex((b) => b.id === id || b.bookingNumber === id);
  if (index === -1) return undefined;

  bookings[index] = {
    ...bookings[index],
    paymentStatus
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(bookings));
  window.dispatchEvent(new CustomEvent("autobhaiya_booking_updated", { detail: bookings[index] }));

  // Appwrite sync in background
  if (isAppwriteConfigured()) {
    updateAppwriteBookingStatus(bookings[index].id, null, paymentStatus);
  }

  return bookings[index];
}

/**
 * Save or merge a remote booking into local storage
 * @param {Booking} booking
 */
export function saveBookingLocally(booking) {
  if (!booking || !booking.id) return;
  const current = getBookings();
  const existingIndex = current.findIndex((b) => b.id === booking.id || b.bookingNumber === booking.id);
  let updated;
  if (existingIndex >= 0) {
    current[existingIndex] = { ...current[existingIndex], ...booking };
    updated = [...current];
  } else {
    updated = [booking, ...current];
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("autobhaiya_booking_updated", { detail: booking }));
}

/**
 * Listen to real-time booking changes (Appwrite Realtime + local events)
 * @param {string} [bookingId]
 * @param {(booking: Booking) => void} callback
 * @returns {() => void}
 */
export function subscribeToBookingUpdates(bookingId, callback) {
  const handleLocal = (event) => {
    const updated = event?.detail;
    if (updated && (!bookingId || updated.id === bookingId || updated.bookingNumber === bookingId)) {
      callback(updated);
    }
  };

  window.addEventListener("autobhaiya_booking_updated", handleLocal);

  const unsubAppwrite = subscribeToBookingRealtime(bookingId, (remoteDoc) => {
    saveBookingLocally(remoteDoc);
    callback(remoteDoc);
  });

  return () => {
    window.removeEventListener("autobhaiya_booking_updated", handleLocal);
    unsubAppwrite();
  };
}
