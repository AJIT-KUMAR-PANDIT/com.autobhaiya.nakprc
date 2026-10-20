/**
 * Auto Bhaiya - Authentication & User State Service
 * Supports Phone/OTP login, Demo profiles (Passenger, Driver, Super Admin),
 * and persistent session state in localStorage.
 */

const STORAGE_KEY = "autobhaiya_user_v1";

export const DEMO_PROFILES = {
  passenger: {
    id: "usr-pass-001",
    name: "Pooja Sharma",
    phone: "+91 98765 43210",
    email: "pooja.sharma@example.com",
    role: "passenger",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80",
    emergencyContact: {
      name: "Rajesh Sharma (Father)",
      phone: "+91 98765 11111"
    },
    savedPlaces: [
      { id: "p-home", label: "Home", address: "Kadma Uliyan, Jamshedpur" },
      { id: "p-work", label: "Work", address: "Bistupur Main Road, Jamshedpur" }
    ],
    ridesCount: 14,
    rating: 4.95
  },
  driver: {
    id: "usr-driver-101",
    name: "Ashok Kumar",
    phone: "+91 98351 23401",
    email: "ashok.bhaiya@autobhaiya.in",
    role: "driver",
    autoNumber: "AB-101",
    vehicleNumber: "JH05-AB-1234",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80",
    emergencyContact: {
      name: "Sunita Devi (Wife)",
      phone: "+91 98351 99999"
    },
    savedPlaces: [
      { id: "p-stand", label: "Auto Stand", address: "Sakchi Golchakkar Auto Stand" }
    ],
    ridesCount: 1243,
    rating: 4.9
  },
  admin: {
    id: "usr-admin-999",
    name: "NAKPRC Safety Desk",
    phone: "+91 94311 00000",
    email: "safety@nakprc.org",
    role: "super_admin",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80",
    emergencyContact: {
      name: "NAKPRC Control Room",
      phone: "+91 1800 234 567"
    },
    savedPlaces: [
      { id: "p-hq", label: "HQ", address: "NAKPRC Operations Hub, Jamshedpur" }
    ],
    ridesCount: 0,
    rating: 5.0
  }
};

/**
 * Format and sanitize Indian phone number (+91 XXXXX XXXXX)
 * @param {string} rawPhone
 * @returns {string}
 */
export function sanitizePhone(rawPhone) {
  if (!rawPhone) return "";
  const digits = rawPhone.replace(/\D/g, "");
  if (digits.length >= 10) {
    const last10 = digits.slice(-10);
    return `+91 ${last10.slice(0, 5)} ${last10.slice(5)}`;
  }
  return rawPhone.trim();
}

/**
 * Validate phone number
 * @param {string} rawPhone
 * @returns {boolean}
 */
export function isValidPhone(rawPhone) {
  if (!rawPhone) return false;
  const digits = rawPhone.replace(/\D/g, "");
  return digits.length >= 10;
}

let memoryStore = null;

/**
 * Get currently authenticated user from localStorage or memory store
 * @returns {object|null}
 */
export function getStoredUser() {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return memoryStore;
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (err) {
    console.error("[Auth] Failed to parse stored user:", err);
    return null;
  }
}

/**
 * Store user session in localStorage or memory store
 * @param {object} user
 */
export function setStoredUser(user) {
  memoryStore = user ? { ...user } : null;
  if (typeof window === "undefined" || typeof localStorage === "undefined") return;
  try {
    if (!user) {
      localStorage.removeItem(STORAGE_KEY);
    } else {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
    }
  } catch (err) {
    console.error("[Auth] Failed to set stored user:", err);
  }
}

/**
 * Clear user session (Sign out)
 */
export function clearStoredUser() {
  memoryStore = null;
  if (typeof window === "undefined" || typeof localStorage === "undefined") return;
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("[Auth] Failed to clear user:", err);
  }
}

/**
 * Request an OTP for phone number
 * @param {string} phone
 * @returns {{ success: boolean, phone: string, otp: string, message: string }}
 */
export function requestOtp(phone) {
  if (!isValidPhone(phone)) {
    return {
      success: false,
      phone,
      otp: "",
      message: "Please enter a valid 10-digit mobile number."
    };
  }

  const formattedPhone = sanitizePhone(phone);
  // Default predictable demo OTP for testing
  const otp = "1234";

  return {
    success: true,
    phone: formattedPhone,
    otp,
    message: `OTP sent to ${formattedPhone}. (Demo OTP: ${otp})`
  };
}

/**
 * Verify OTP and authenticate user
 * @param {string} phone
 * @param {string} otp
 * @returns {{ success: boolean, user?: object, message?: string }}
 */
export function verifyOtp(phone, otp) {
  if (!isValidPhone(phone)) {
    return { success: false, message: "Invalid phone number." };
  }

  const cleanOtp = (otp || "").trim();
  // Allow '1234' or any 4-digit code in local/demo environment
  if (!cleanOtp || cleanOtp.length < 4) {
    return { success: false, message: "Please enter a valid 4-digit OTP." };
  }

  const formatted = sanitizePhone(phone);

  // Check if matching driver demo phone
  if (formatted === DEMO_PROFILES.driver.phone) {
    const user = { ...DEMO_PROFILES.driver };
    setStoredUser(user);
    return { success: true, user };
  }

  // Check if matching admin demo phone
  if (formatted === DEMO_PROFILES.admin.phone) {
    const user = { ...DEMO_PROFILES.admin };
    setStoredUser(user);
    return { success: true, user };
  }

  // Check if matching passenger demo phone
  if (formatted === DEMO_PROFILES.passenger.phone) {
    const user = { ...DEMO_PROFILES.passenger };
    setStoredUser(user);
    return { success: true, user };
  }

  // Create new user profile for phone
  const existing = getStoredUser();
  const user = {
    id: existing?.id || `usr-${Date.now().toString(36)}`,
    name: existing?.phone === formatted ? existing.name : `Auto Rider ${formatted.slice(-4)}`,
    phone: formatted,
    email: existing?.phone === formatted ? existing.email : "",
    role: "passenger",
    avatar: existing?.avatar || "",
    emergencyContact: existing?.emergencyContact || { name: "", phone: "" },
    savedPlaces: existing?.savedPlaces || [],
    ridesCount: existing?.ridesCount || 1,
    rating: 5.0
  };

  setStoredUser(user);
  return { success: true, user };
}

/**
 * Switch directly to a preset demo role
 * @param {"passenger" | "driver" | "admin"} roleKey
 * @returns {object}
 */
export function loginAsDemo(roleKey) {
  const profile = DEMO_PROFILES[roleKey] || DEMO_PROFILES.passenger;
  const user = { ...profile };
  setStoredUser(user);
  return user;
}

/**
 * Update user profile attributes
 * @param {Partial<object>} updates
 * @returns {object|null}
 */
export function updateUserProfile(updates) {
  const current = getStoredUser();
  if (!current) return null;
  const updated = {
    ...current,
    ...updates,
    updatedAt: new Date().toISOString()
  };
  setStoredUser(updated);
  return updated;
}
