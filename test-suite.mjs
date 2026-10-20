import {
  AUTOS,
  validateAutoDataset,
  verifyAuto,
  searchAutos,
  getAutoById,
  getAutoByAutoNumber,
  getVerificationUrl
} from "./src/data/autos.js";
import {
  requestOtp,
  verifyOtp,
  loginAsDemo,
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  updateUserProfile,
  sanitizePhone,
  isValidPhone,
  DEMO_PROFILES
} from "./src/data/auth.js";
import { readFileSync } from "fs";
import { resolve } from "path";

console.log("=== AUTO BHAIYA TEST SUITE ===");

let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✓ ${message}`);
    passed++;
  } else {
    console.error(`  ✗ FAIL: ${message}`);
    failed++;
  }
}

// 1. DATASET INTEGRITY
console.log("\n1. Testing Dataset Integrity & Uniqueness...");
const valResult = validateAutoDataset(AUTOS);
assert(valResult.valid, "validateAutoDataset passes with 0 duplicate errors");
assert(AUTOS.length >= 10, `At least 10 autos in registry (found ${AUTOS.length})`);

const ids = new Set();
const autoNumbers = new Set();
const hashes = new Set();
const vehNumbers = new Set();

for (const a of AUTOS) {
  assert(!ids.has(a.id), `ID ${a.id} is unique`);
  ids.add(a.id);

  assert(!autoNumbers.has(a.autoNumber), `Auto Number ${a.autoNumber} is unique`);
  autoNumbers.add(a.autoNumber);

  assert(!hashes.has(a.verificationHash), `Verification Hash ${a.verificationHash} is unique`);
  hashes.add(a.verificationHash);

  const normV = a.vehicleNumber.replace(/\s+/g, "").toUpperCase();
  assert(!vehNumbers.has(normV), `Vehicle Number ${a.vehicleNumber} is unique`);
  vehNumbers.add(normV);
}

// 2. VERIFICATION LOGIC
console.log("\n2. Testing Verification Logic (verifyAuto)...");

// Test valid pair
const validTest = verifyAuto("AB-101", "AB101-X8K92P7Q");
assert(validTest.verified === true, "Valid pair (AB-101 + AB101-X8K92P7Q) is verified");
assert(validTest.auto?.driverName === "Ashok Kumar", "Returns matching Auto record (Ashok Kumar)");

// Test case insensitivity & whitespace
const caseTest = verifyAuto(" ab-101 ", " ab101-x8k92p7q ");
assert(caseTest.verified === true, "Case-insensitive and trimmed pair verification succeeds");

// Test valid auto with incorrect hash
const wrongHashTest = verifyAuto("AB-101", "WRONG-HASH-123");
assert(wrongHashTest.verified === false, "Valid auto with WRONG hash returns verified: false");
assert(wrongHashTest.reason === "hash_mismatch", "Reason is hash_mismatch");

// Test unknown auto
const unknownAutoTest = verifyAuto("AB-999", "SOME-HASH");
assert(unknownAutoTest.verified === false, "Unknown auto returns verified: false");
assert(unknownAutoTest.reason === "auto_not_found", "Reason is auto_not_found");

// Test missing hash
const missingHashTest = verifyAuto("AB-101", "");
assert(missingHashTest.verified === false, "Missing hash returns verified: false");
assert(missingHashTest.reason === "missing_hash", "Reason is missing_hash");

// Test cross-pair mismatch (Auto A with Auto B's valid hash)
const crossHashTest = verifyAuto("AB-101", "AB204-M4N73T9W");
assert(crossHashTest.verified === false, "Auto A with Auto B's hash returns verified: false (cross-matching impossible)");

// 3. SEARCH
console.log("\n3. Testing Search System...");
const searchByAuto = searchAutos("AB-101");
assert(searchByAuto.length >= 1 && searchByAuto[0].autoNumber === "AB-101", "Search by Auto Number finds AB-101");

const searchByDriver = searchAutos("Ashok");
assert(searchByDriver.length >= 1 && searchByDriver[0].driverName.includes("Ashok"), "Search by Driver name finds Ashok");

const searchByPlate = searchAutos("JH05");
assert(searchByPlate.length === AUTOS.length, "Search by state code 'JH05' matches autos");

const searchByArea = searchAutos("Sakchi");
assert(searchByArea.length >= 1, "Search by area 'Sakchi' matches relevant autos");

const searchByVehicle = searchAutos("Electric Auto");
assert(searchByVehicle.length >= 2, "Search by vehicle type 'Electric Auto' matches electric autos");

// 4. VERIFICATION URL
console.log("\n4. Testing Verification URL Generator...");
const sampleAuto = AUTOS[0];
const sampleUrl = getVerificationUrl(sampleAuto);
assert(sampleUrl.includes("/verify?auto=AB-101"), "Verification URL contains correct path and auto param");
assert(sampleUrl.includes("&hash=AB101-X8K92P7Q"), "Verification URL contains correct hash param");

// 5. PAYMENT CONFIGURATION
console.log("\n5. Testing Payment Configuration JSON...");
const paymentRaw = readFileSync(resolve("public/data/payment.json"), "utf-8");
const paymentJson = JSON.parse(paymentRaw);
assert(typeof paymentJson.upiId === "string" && paymentJson.upiId.includes("@"), "payment.json has valid UPI ID format");
assert(typeof paymentJson.merchantName === "string", "payment.json has merchantName");
assert(paymentJson.currency === "INR", "payment.json has currency INR");

// 6. ADMIN & 2-TIMES-A-WEEK NAME EDIT QUOTA POLICY
console.log("\n6. Testing Admin & 2-Times-a-Week Name Edit Quota Policy...");

// Set up mock window and localStorage for Node testing
const memStorage = {};
globalThis.localStorage = {
  getItem: (key) => memStorage[key] || null,
  setItem: (key, val) => { memStorage[key] = String(val); },
  removeItem: (key) => { delete memStorage[key]; }
};
globalThis.window = {
  dispatchEvent: () => true
};
globalThis.CustomEvent = class { constructor(type, detail) { this.type = type; this.detail = detail; } };

const {
  getNameChangeQuota,
  updateAutoProfile,
  resetDriverQuota,
  setDriverAvailability,
  addNewAuto
} = await import("./src/data/admin.js");

const testAutoId = "auto-101";

// 1. Initial quota should be 2 remaining, 0 used, not locked
const initialQuota = getNameChangeQuota(testAutoId);
assert(initialQuota.total === 2, "Weekly quota total is 2");
assert(initialQuota.remaining === 2, "Initial remaining quota is 2");
assert(initialQuota.used === 0, "Initial used quota is 0");
assert(initialQuota.isLocked === false, "Driver is not locked initially");

// 2. Perform 1st name change as Auto Admin
const edit1 = updateAutoProfile(testAutoId, { driverName: "Ashok Kumar Sharma" }, false);
assert(edit1.success === true, "1st name edit by Auto Admin succeeds");
assert(edit1.quota.remaining === 1, "Remaining quota is now 1 after 1st edit");
assert(edit1.quota.used === 1, "Used quota is 1 after 1st edit");
assert(edit1.quota.isLocked === false, "Driver is still not locked after 1st edit");

// 3. Perform 2nd name change as Auto Admin
const edit2 = updateAutoProfile(testAutoId, { driverName: "Ashok K. Sharma" }, false);
assert(edit2.success === true, "2nd name edit by Auto Admin succeeds");
assert(edit2.quota.remaining === 0, "Remaining quota is now 0 after 2nd edit");
assert(edit2.quota.used === 2, "Used quota is 2 after 2nd edit");
assert(edit2.quota.isLocked === true, "Driver is now LOCKED after exhausting 2 weekly edits");
assert(edit2.quota.nextAvailableAt instanceof Date, "Calculates next available edit Date");

// 4. Attempt 3rd name change as Auto Admin (MUST FAIL with quota error)
const edit3 = updateAutoProfile(testAutoId, { driverName: "Ashok The Legend" }, false);
assert(edit3.success === false, "3rd name edit by Auto Admin is REJECTED by rate limit");
assert(edit3.error && edit3.error.includes("Weekly limit reached"), "Returns clear rate limit policy error message");

// 5. Non-name edit (e.g. phone or area) should still succeed even when name is locked
const editNonName = updateAutoProfile(testAutoId, { area: "Kadma Market" }, false);
assert(editNonName.success === true, "Non-name edits (area/phone) succeed even when name change is locked");

// 6. Super Admin override should succeed even when locked
const superAdminEdit = updateAutoProfile(testAutoId, { driverName: "Ashok Super Admin Override" }, true);
assert(superAdminEdit.success === true, "Super Admin can bypass the 2-edits-per-week quota");

// 7. Super Admin reset quota
const resetResult = resetDriverQuota(testAutoId);
assert(resetResult.success === true, "Super Admin resetDriverQuota succeeds");
const quotaAfterReset = getNameChangeQuota(testAutoId);
assert(quotaAfterReset.remaining === 2, "Driver quota is fully restored to 2 after Super Admin reset");
assert(quotaAfterReset.isLocked === false, "Driver is unlocked after Super Admin reset");

// 8. Driver availability toggle
const availToggle = setDriverAvailability(testAutoId, false, "Auto Admin");
assert(availToggle.success === true, "setDriverAvailability succeeds");
assert(availToggle.auto.available === false, "Driver is set to offline");

// 7. AUTHENTICATION & USER MANAGEMENT
console.log("\n7. Testing Authentication & User Management...");

// Test phone validation and sanitization
assert(isValidPhone("9876543210") === true, "isValidPhone validates 10-digit number");
assert(isValidPhone("123") === false, "isValidPhone rejects short numbers");
assert(sanitizePhone("9876543210") === "+91 98765 43210", "sanitizePhone formats Indian number correctly");

// Test OTP request
const otpReqSuccess = requestOtp("9876543210");
assert(otpReqSuccess.success === true, "requestOtp succeeds for valid phone");
assert(otpReqSuccess.otp === "1234", "requestOtp returns demo verification OTP");

const otpReqFail = requestOtp("123");
assert(otpReqFail.success === false, "requestOtp fails for invalid phone");

// Test OTP verification with bad code
const verifyFail = verifyOtp("9876543210", "00");
assert(verifyFail.success === false, "verifyOtp fails for invalid OTP code");

// Test Passenger Login via OTP
const passengerAuth = verifyOtp("9876543210", "1234");
assert(passengerAuth.success === true, "verifyOtp succeeds for passenger number");
assert(passengerAuth.user.name === "Pooja Sharma", "Matches Pooja Sharma passenger profile");
assert(getStoredUser()?.name === "Pooja Sharma", "getStoredUser reflects active passenger session");

// Test Updating Profile & Emergency Contact
const profileUpdate = updateUserProfile({
  email: "pooja.updated@example.com",
  emergencyContact: { name: "Anand Sharma", phone: "+91 98765 22222" }
});
assert(profileUpdate.email === "pooja.updated@example.com", "updateUserProfile updates email");
assert(profileUpdate.emergencyContact.name === "Anand Sharma", "updateUserProfile updates emergency contact name");
assert(getStoredUser().emergencyContact.phone === "+91 98765 22222", "Stored user holds new emergency phone");

// Test Driver Login via Demo
const driverDemo = loginAsDemo("driver");
assert(driverDemo.role === "driver", "loginAsDemo switches role to driver");
assert(driverDemo.autoNumber === "AB-101", "Driver has valid autoNumber AB-101");
assert(getStoredUser()?.role === "driver", "getStoredUser reflects driver role");

// Test Super Admin Login via Demo
const adminDemo = loginAsDemo("admin");
assert(adminDemo.role === "super_admin", "loginAsDemo switches role to super_admin");
assert(getStoredUser()?.role === "super_admin", "getStoredUser reflects super_admin role");

// Test Sign Out
clearStoredUser();
assert(getStoredUser() === null, "clearStoredUser successfully signs out user");

// SUMMARY
console.log(`\n========================================`);
console.log(`Tests Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) {
  console.error("TEST SUITE FAILED");
  process.exit(1);
} else {
  console.log("ALL TESTS PASSED WITH 100% SUCCESS!");
}
