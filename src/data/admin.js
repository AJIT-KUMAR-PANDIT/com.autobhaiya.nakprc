/**
 * Auto Bhaiya - Admin Management & Rate-Limiting Module
 * Handles Super Admin controls, Auto Admin (Driver) profile editing,
 * and the 2-times-a-week name change policy.
 */

import { AUTOS, AUTOS_STORAGE_KEY, getAutos } from "./autos.js";
import { syncBookingToAppwrite } from "../lib/appwrite.js";

export const NAME_CHANGE_LOG_KEY = "autobhaiya_name_change_logs";
export const AUDIT_LOG_KEY = "autobhaiya_admin_audit_logs";
export const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;
export const MAX_NAME_CHANGES_PER_WEEK = 2;

/**
 * Read raw name change logs from localStorage
 * @returns {Record<string, Array<{ timestamp: number, oldName: string, newName: string, field: string, changedBy: string }>>}
 */
export function getNameChangeLogs() {
  if (typeof window === "undefined") return {};
  try {
    const raw = localStorage.getItem(NAME_CHANGE_LOG_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/**
 * Save name change logs
 */
function saveNameChangeLogs(logs) {
  if (typeof window === "undefined") return;
  localStorage.setItem(NAME_CHANGE_LOG_KEY, JSON.stringify(logs));
}

/**
 * Read audit logs
 */
export function getAuditLogs() {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(AUDIT_LOG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

/**
 * Add an entry to the system audit log
 */
export function addAuditLog(action, details, actor = "Super Admin") {
  if (typeof window === "undefined") return;
  const logs = getAuditLogs();
  const entry = {
    id: "log_" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    action,
    details,
    actor,
    timestamp: Date.now(),
    dateStr: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    })
  };
  const updated = [entry, ...logs].slice(0, 100); // keep recent 100
  localStorage.setItem(AUDIT_LOG_KEY, JSON.stringify(updated));
  window.dispatchEvent(new CustomEvent("autobhaiya:audit-updated", { detail: entry }));
  return entry;
}

/**
 * Check the 2-times-a-week quota for an auto driver
 * @param {string} autoId 
 * @returns {{
 *   used: number,
 *   total: number,
 *   remaining: number,
 *   isLocked: boolean,
 *   nextAvailableAt: Date | null,
 *   nextAvailableMs: number | null,
 *   activeLogs: Array<{ timestamp: number, oldName: string, newName: string, field: string, changedBy: string }>,
 *   allLogs: Array<{ timestamp: number, oldName: string, newName: string, field: string, changedBy: string }>
 * }}
 */
export function getNameChangeQuota(autoId) {
  if (!autoId) {
    return {
      used: 0,
      total: MAX_NAME_CHANGES_PER_WEEK,
      remaining: MAX_NAME_CHANGES_PER_WEEK,
      isLocked: false,
      nextAvailableAt: null,
      nextAvailableMs: null,
      activeLogs: [],
      allLogs: []
    };
  }

  const allLogs = getNameChangeLogs();
  const driverLogs = allLogs[autoId] || [];
  const now = Date.now();

  // Filter logs within the rolling 7-day window
  const activeLogs = driverLogs.filter(
    (log) => now - log.timestamp < SEVEN_DAYS_MS
  );

  const used = activeLogs.length;
  const remaining = Math.max(0, MAX_NAME_CHANGES_PER_WEEK - used);
  const isLocked = remaining <= 0;

  let nextAvailableAt = null;
  let nextAvailableMs = null;

  if (isLocked && activeLogs.length > 0) {
    // Sort oldest first
    const sorted = [...activeLogs].sort((a, b) => a.timestamp - b.timestamp);
    const oldestTimestamp = sorted[0].timestamp;
    nextAvailableMs = oldestTimestamp + SEVEN_DAYS_MS;
    nextAvailableAt = new Date(nextAvailableMs);
  }

  return {
    used,
    total: MAX_NAME_CHANGES_PER_WEEK,
    remaining,
    isLocked,
    nextAvailableAt,
    nextAvailableMs,
    activeLogs,
    allLogs: driverLogs
  };
}

/**
 * Record a name change event
 */
export function recordNameChange(autoId, oldName, newName, field = "driverName", changedBy = "Auto Admin") {
  if (typeof window === "undefined" || !autoId) return;
  const allLogs = getNameChangeLogs();
  const driverLogs = allLogs[autoId] || [];

  const entry = {
    timestamp: Date.now(),
    oldName,
    newName,
    field,
    changedBy
  };

  allLogs[autoId] = [entry, ...driverLogs];
  saveNameChangeLogs(allLogs);

  addAuditLog(
    "NAME_CHANGE",
    `Auto ${autoId} ${field} changed from "${oldName}" to "${newName}" by ${changedBy}`,
    changedBy
  );

  window.dispatchEvent(new CustomEvent("autobhaiya:quota-updated", { detail: { autoId, entry } }));
}

/**
 * Super Admin privilege: Reset the 2-per-week edit quota for a driver
 */
export function resetDriverQuota(autoId, actor = "Super Admin") {
  if (typeof window === "undefined" || !autoId) return;
  const allLogs = getNameChangeLogs();
  allLogs[autoId] = [];
  saveNameChangeLogs(allLogs);

  addAuditLog(
    "QUOTA_RESET",
    `Super Admin reset weekly name change quota for Auto ${autoId}`,
    actor
  );

  window.dispatchEvent(new CustomEvent("autobhaiya:quota-updated", { detail: { autoId } }));
  return { success: true, message: `Weekly edit quota for Auto ${autoId} has been reset.` };
}

/**
 * Save the entire autos fleet array into storage
 */
export function saveManagedAutos(autosList) {
  if (typeof window === "undefined") return;
  localStorage.setItem(AUTOS_STORAGE_KEY, JSON.stringify(autosList));
  window.dispatchEvent(new CustomEvent("autobhaiya:autos-updated", { detail: autosList }));
}

/**
 * Update an existing Auto's profile.
 * Applies the 2-times-a-week name change policy for Auto Admin!
 * Super Admin can bypass the quota.
 * 
 * @param {string} autoId 
 * @param {Partial<import("./autos.js").Auto>} updates 
 * @param {boolean} [isSuperAdmin=false] 
 * @returns {{ success: boolean, auto?: any, error?: string, quota?: any }}
 */
export function updateAutoProfile(autoId, updates, isSuperAdmin = false) {
  const currentList = getAutos();
  const targetIndex = currentList.findIndex(
    (a) => a.id.toLowerCase() === autoId.toLowerCase() || a.autoNumber.toLowerCase() === autoId.toLowerCase()
  );

  if (targetIndex === -1) {
    return { success: false, error: `Auto with ID ${autoId} not found.` };
  }

  const currentAuto = currentList[targetIndex];

  // Detect identifying name changes: driverName or vehicle registration name
  const isDriverNameChanged = updates.driverName && updates.driverName.trim() !== currentAuto.driverName;
  const isAutoNameChanged = updates.name && updates.name.trim() !== currentAuto.name;

  if ((isDriverNameChanged || isAutoNameChanged) && !isSuperAdmin) {
    const quota = getNameChangeQuota(currentAuto.id);
    if (quota.isLocked) {
      const formattedDate = quota.nextAvailableAt
        ? quota.nextAvailableAt.toLocaleString("en-IN", {
            dateStyle: "medium",
            timeStyle: "short"
          })
        : "7 days from your previous change";

      return {
        success: false,
        error: `Weekly limit reached: Auto admins can only change their name or vehicle identity up to ${MAX_NAME_CHANGES_PER_WEEK} times a week. Next edit available after ${formattedDate}.`,
        quota
      };
    }

    // Record the change in the rolling log
    if (isDriverNameChanged) {
      recordNameChange(currentAuto.id, currentAuto.driverName, updates.driverName, "driverName", "Auto Admin");
    }
    if (isAutoNameChanged) {
      recordNameChange(currentAuto.id, currentAuto.name, updates.name, "name", "Auto Admin");
    }
  } else if ((isDriverNameChanged || isAutoNameChanged) && isSuperAdmin) {
    // Super admin override
    addAuditLog(
      "SUPER_ADMIN_EDIT",
      `Super Admin modified identity for Auto ${currentAuto.autoNumber} (${currentAuto.driverName} -> ${updates.driverName || currentAuto.driverName})`,
      "Super Admin"
    );
  }

  // Merge updates
  const updatedAuto = {
    ...currentAuto,
    ...updates,
    id: currentAuto.id, // Immutable ID
    autoNumber: currentAuto.autoNumber, // Immutable identity tag
    updatedAt: new Date().toISOString()
  };

  const newList = [...currentList];
  newList[targetIndex] = updatedAuto;
  saveManagedAutos(newList);

  const newQuota = getNameChangeQuota(currentAuto.id);
  return {
    success: true,
    auto: updatedAuto,
    quota: newQuota,
    message: "Auto profile successfully updated."
  };
}

/**
 * Toggle driver availability (Online / Offline)
 */
export function setDriverAvailability(autoId, available, actor = "Auto Admin") {
  const currentList = getAutos();
  const targetIndex = currentList.findIndex(
    (a) => a.id.toLowerCase() === autoId.toLowerCase() || a.autoNumber.toLowerCase() === autoId.toLowerCase()
  );

  if (targetIndex === -1) return { success: false, error: "Auto not found" };

  const currentAuto = currentList[targetIndex];
  const updatedAuto = {
    ...currentAuto,
    available: Boolean(available),
    updatedAt: new Date().toISOString()
  };

  const newList = [...currentList];
  newList[targetIndex] = updatedAuto;
  saveManagedAutos(newList);

  addAuditLog(
    "AVAILABILITY_CHANGE",
    `${currentAuto.autoNumber} (${currentAuto.driverName}) set availability to ${available ? "ONLINE" : "OFFLINE"}`,
    actor
  );

  return { success: true, auto: updatedAuto };
}

/**
 * Add a new Auto to the fleet (Super Admin only)
 */
export function addNewAuto(autoData, actor = "Super Admin") {
  const currentList = getAutos();

  // Generate unique ID and Auto Number
  const nextNum = 900 + (currentList.length + 1);
  const autoNumber = autoData.autoNumber?.trim() || `AB-${nextNum}`;
  const id = autoData.id?.trim() || `auto-${nextNum}`;
  
  // Generate random tamper-evident verification hash
  const hashChars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let randomCode = "";
  for (let i = 0; i < 8; i++) {
    randomCode += hashChars.charAt(Math.floor(Math.random() * hashChars.length));
  }
  const verificationHash = `${autoNumber.replace("-", "")}-${randomCode}`;

  const newAuto = {
    id,
    autoNumber,
    verificationHash,
    name: autoData.name || "Auto Bhaiya Super",
    driverName: autoData.driverName || "New Driver",
    phone: autoData.phone || "+91 98000 00000",
    rating: 5.0,
    trips: 0,
    vehicleNumber: autoData.vehicleNumber || `JH05-XX-${Math.floor(1000 + Math.random() * 9000)}`,
    vehicleType: autoData.vehicleType || "Electric Auto",
    category: autoData.category || "Passenger",
    fuelType: autoData.fuelType || "Electric",
    seats: Number(autoData.seats) || 3,
    color: autoData.color || "Yellow & Green",
    area: autoData.area || "City Center",
    etaMinutes: 5,
    fareEstimate: Number(autoData.fareEstimate) || 100,
    pickupNote: autoData.pickupNote || "Available at transit stand.",
    available: true,
    destinationHints: autoData.destinationHints || ["Station", "Market", "Hospital"],
    createdAt: new Date().toISOString()
  };

  const newList = [newAuto, ...currentList];
  saveManagedAutos(newList);

  addAuditLog(
    "AUTO_ADDED",
    `Added new Auto ${newAuto.autoNumber} (${newAuto.driverName}, ${newAuto.vehicleType})`,
    actor
  );

  return { success: true, auto: newAuto };
}

/**
 * Delete an Auto from the fleet (Super Admin only)
 */
export function deleteAuto(autoId, actor = "Super Admin") {
  const currentList = getAutos();
  const filtered = currentList.filter(
    (a) => a.id.toLowerCase() !== autoId.toLowerCase() && a.autoNumber.toLowerCase() !== autoId.toLowerCase()
  );

  if (filtered.length === currentList.length) {
    return { success: false, error: "Auto not found" };
  }

  saveManagedAutos(filtered);

  addAuditLog(
    "AUTO_DELETED",
    `Deleted Auto ${autoId} from the fleet`,
    actor
  );

  return { success: true };
}

/**
 * Reset fleet to initial default dataset (Super Admin only)
 */
export function resetFleetToDefault() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(AUTOS_STORAGE_KEY);
  localStorage.removeItem(NAME_CHANGE_LOG_KEY);
  window.dispatchEvent(new CustomEvent("autobhaiya:autos-updated", { detail: AUTOS }));
  addAuditLog("SYSTEM_RESET", "Reset fleet dataset to baseline factory defaults", "Super Admin");
  return { success: true };
}
