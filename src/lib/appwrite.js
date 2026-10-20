import { Client, Databases, ID, Query } from "appwrite";

/**
 * Appwrite Client Configuration for Auto Bhaiya by NAKPRC
 * Provides real-time synchronization for rides, bookings, and verified auto statuses.
 */

const getEnv = (key, fallback = "") => {
  try {
    if (typeof import.meta !== "undefined" && import.meta?.env?.[key]) {
      return import.meta.env[key];
    }
  } catch {
    // fallback
  }
  try {
    if (typeof process !== "undefined" && process?.env?.[key]) {
      return process.env[key];
    }
  } catch {
    // fallback
  }
  return fallback;
};

const ENDPOINT = getEnv("VITE_APPWRITE_ENDPOINT", "https://cloud.appwrite.io/v1");
const PROJECT_ID = getEnv("VITE_APPWRITE_PROJECT_ID", "");
const DATABASE_ID = getEnv("VITE_APPWRITE_DATABASE_ID", "autobhaiya_db");
const BOOKINGS_COLLECTION = getEnv("VITE_APPWRITE_BOOKINGS_COLLECTION_ID", "bookings");
const AUTOS_COLLECTION = getEnv("VITE_APPWRITE_AUTOS_COLLECTION_ID", "autos");

export const isAppwriteConfigured = () => {
  return Boolean(PROJECT_ID && PROJECT_ID.trim().length > 0 && !PROJECT_ID.includes("your-project-id"));
};

export const client = new Client();

if (isAppwriteConfigured()) {
  client.setEndpoint(ENDPOINT).setProject(PROJECT_ID);
}

export const databases = new Databases(client);

export const APPWRITE_CONFIG = {
  endpoint: ENDPOINT,
  projectId: PROJECT_ID,
  databaseId: DATABASE_ID,
  bookingsCollection: BOOKINGS_COLLECTION,
  autosCollection: AUTOS_COLLECTION
};

/**
 * Subscribe to real-time updates for a specific booking or all bookings
 * @param {string} [bookingId]
 * @param {(payload: any) => void} onUpdate
 * @returns {() => void} Unsubscribe function
 */
export function subscribeToBookingRealtime(bookingId, onUpdate) {
  if (!isAppwriteConfigured()) {
    return () => {};
  }

  const channel = `databases.${DATABASE_ID}.collections.${BOOKINGS_COLLECTION}.documents`;
  
  try {
    const unsubscribe = client.subscribe(channel, (response) => {
      if (response && response.payload) {
        if (!bookingId || response.payload.$id === bookingId || response.payload.id === bookingId) {
          onUpdate(response.payload);
        }
      }
    });
    return unsubscribe;
  } catch (err) {
    console.warn("[Appwrite Realtime] Failed to subscribe to bookings channel:", err);
    return () => {};
  }
}

/**
 * Subscribe to real-time updates for autos availability
 * @param {(payload: any) => void} onUpdate
 * @returns {() => void} Unsubscribe function
 */
export function subscribeToAutosRealtime(onUpdate) {
  if (!isAppwriteConfigured()) {
    return () => {};
  }

  const channel = `databases.${DATABASE_ID}.collections.${AUTOS_COLLECTION}.documents`;
  try {
    const unsubscribe = client.subscribe(channel, (response) => {
      if (response && response.payload) {
        onUpdate(response.payload);
      }
    });
    return unsubscribe;
  } catch (err) {
    console.warn("[Appwrite Realtime] Failed to subscribe to autos channel:", err);
    return () => {};
  }
}

/**
 * Push booking to Appwrite if configured
 * @param {any} bookingData
 */
export async function syncBookingToAppwrite(bookingData) {
  if (!isAppwriteConfigured()) return null;

  try {
    const documentId = bookingData.id || ID.unique();
    return await databases.createDocument(
      DATABASE_ID,
      BOOKINGS_COLLECTION,
      documentId,
      {
        ...bookingData,
        updatedAt: new Date().toISOString()
      }
    );
  } catch (err) {
    // If already exists, attempt update
    try {
      return await databases.updateDocument(
        DATABASE_ID,
        BOOKINGS_COLLECTION,
        bookingData.id,
        {
          ...bookingData,
          updatedAt: new Date().toISOString()
        }
      );
    } catch (updateErr) {
      console.warn("[Appwrite] syncBookingToAppwrite fallback:", updateErr);
      return null;
    }
  }
}

/**
 * Update booking status in Appwrite
 */
export async function updateAppwriteBookingStatus(id, status, paymentStatus) {
  if (!isAppwriteConfigured()) return null;
  try {
    const patch = {};
    if (status) patch.status = status;
    if (paymentStatus) patch.paymentStatus = paymentStatus;
    patch.updatedAt = new Date().toISOString();

    return await databases.updateDocument(
      DATABASE_ID,
      BOOKINGS_COLLECTION,
      id,
      patch
    );
  } catch (err) {
    console.warn("[Appwrite] updateAppwriteBookingStatus error:", err);
    return null;
  }
}
