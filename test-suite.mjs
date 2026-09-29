import {
  AUTOS,
  validateAutoDataset,
  verifyAuto,
  searchAutos,
  getAutoById,
  getAutoByAutoNumber,
  getVerificationUrl
} from "./src/data/autos.js";
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

// SUMMARY
console.log(`\n========================================`);
console.log(`Tests Passed: ${passed} | Failed: ${failed}`);
if (failed > 0) {
  console.error("TEST SUITE FAILED");
  process.exit(1);
} else {
  console.log("ALL TESTS PASSED WITH 100% SUCCESS!");
}
