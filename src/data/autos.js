/**
 * Auto Bhaiya - Dataset & Verification Module
 * Source of truth for local Auto Bhaiya records
 */

/**
 * @typedef {Object} Auto
 * @property {string} id
 * @property {string} autoNumber
 * @property {string} verificationHash
 * @property {string} name
 * @property {string} driverName
 * @property {string} phone
 * @property {number} rating
 * @property {number} trips
 * @property {string} vehicleNumber
 * @property {string} vehicleType
 * @property {number} seats
 * @property {string} color
 * @property {string} area
 * @property {number} etaMinutes
 * @property {number} fareEstimate
 * @property {string} pickupNote
 * @property {boolean} available
 * @property {string[]} destinationHints
 */

export const AUTOS = [
  {
    id: "auto-101",
    autoNumber: "AB-101",
    verificationHash: "AB101-X8K92P7Q",
    name: "Ashok Leyland CNG Super",
    driverName: "Ashok Kumar",
    phone: "+91 98351 23401",
    rating: 4.9,
    trips: 1240,
    vehicleNumber: "JH05-AB-1234",
    vehicleType: "CNG Auto",
    seats: 3,
    color: "Yellow & Green",
    area: "Sakchi",
    etaMinutes: 4,
    fareEstimate: 120,
    pickupNote: "Near Sakchi Golchakkar, opposite Basant Cinema",
    available: true,
    destinationHints: ["Sakchi", "Bistupur", "Kadma", "Sonari", "Tatanagar Station", "Loyola School"]
  },
  {
    id: "auto-204",
    autoNumber: "AB-204",
    verificationHash: "AB204-M4N73T9W",
    name: "Bajaj RE Maxima",
    driverName: "Rajesh Verma",
    phone: "+91 94311 88902",
    rating: 4.8,
    trips: 980,
    vehicleNumber: "JH05-CD-5678",
    vehicleType: "Bajaj RE CNG",
    seats: 3,
    color: "Yellow & Black",
    area: "Bistupur",
    etaMinutes: 6,
    fareEstimate: 135,
    pickupNote: "Opposite Gopal Maidan Gate 2",
    available: true,
    destinationHints: ["Bistupur", "Sakchi", "Jugsalai", "Kadma", "DBMS School", "Kharkai Bridge"]
  },
  {
    id: "auto-318",
    autoNumber: "AB-318",
    verificationHash: "AB318-K2P89R4F",
    name: "Piaggio Ape City Plus",
    driverName: "Sunil Mahato",
    phone: "+91 97092 33419",
    rating: 4.9,
    trips: 1520,
    vehicleNumber: "JH05-EF-9012",
    vehicleType: "Piaggio Ape",
    seats: 3,
    color: "Yellow & Green",
    area: "Kadma",
    etaMinutes: 5,
    fareEstimate: 110,
    pickupNote: "Near Rankini Mandir Kadma Market",
    available: true,
    destinationHints: ["Kadma", "Sonari", "Bistupur", "Ulyan", "Sacred Heart School"]
  },
  {
    id: "auto-427",
    autoNumber: "AB-427",
    verificationHash: "AB427-Q6W18V3S",
    name: "Atul Gem Cargo & Passenger",
    driverName: "Mohammad Imran",
    phone: "+91 93348 76523",
    rating: 4.7,
    trips: 760,
    vehicleNumber: "JH05-GH-3456",
    vehicleType: "Atul Gem CNG",
    seats: 4,
    color: "Yellow & Green",
    area: "Sonari",
    etaMinutes: 7,
    fareEstimate: 140,
    pickupNote: "Near Sonari Airport Crossing",
    available: true,
    destinationHints: ["Sonari", "Kagalnagar", "Kadma", "Sakchi", "Riverside", "Carmel School"]
  },
  {
    id: "auto-505",
    autoNumber: "AB-505",
    verificationHash: "AB505-L9C54H2D",
    name: "Mahindra Treo Eco Star",
    driverName: "Ramesh Soren",
    phone: "+91 96931 55670",
    rating: 5.0,
    trips: 1890,
    vehicleNumber: "JH05-JK-7890",
    vehicleType: "Electric Auto",
    seats: 4,
    color: "Electric Green & White",
    area: "Telco",
    etaMinutes: 3,
    fareEstimate: 150,
    pickupNote: "Plaza Market, Telco Town Area",
    available: true,
    destinationHints: ["Telco", "Golmuri", "Baridih", "Tinplate", "Little Flower School", "Telco Club"]
  },
  {
    id: "auto-612",
    autoNumber: "AB-612",
    verificationHash: "AB612-Y3J71B8E",
    name: "Bajaj Maxima Z Compact",
    driverName: "Vikram Singh",
    phone: "+91 92045 44812",
    rating: 4.8,
    trips: 1110,
    vehicleNumber: "JH05-LM-2345",
    vehicleType: "Bajaj Maxima",
    seats: 3,
    color: "Yellow & Black",
    area: "Golmuri",
    etaMinutes: 5,
    fareEstimate: 125,
    pickupNote: "Near Golmuri Clock Tower / Chowk",
    available: true,
    destinationHints: ["Golmuri", "Sakchi", "Telco", "Burmamines", "Hill Top School"]
  },
  {
    id: "auto-723",
    autoNumber: "AB-723",
    verificationHash: "AB723-Z5V92N4K",
    name: "TVS King Duramax CNG",
    driverName: "Manoj Tiwari",
    phone: "+91 95723 11984",
    rating: 4.8,
    trips: 840,
    vehicleNumber: "JH05-NP-6789",
    vehicleType: "TVS King CNG",
    seats: 3,
    color: "Yellow & Green",
    area: "Mango",
    etaMinutes: 6,
    fareEstimate: 130,
    pickupNote: "Near Mango Bridge Chowk, Dimna Road",
    available: false,
    destinationHints: ["Mango", "Dimna", "Sakchi", "Pardi", "Old Purulia Road"]
  },
  {
    id: "auto-834",
    autoNumber: "AB-834",
    verificationHash: "AB834-R7T36X1M",
    name: "Piaggio Ape E-City",
    driverName: "Gopal Prasad",
    phone: "+91 91992 67832",
    rating: 4.9,
    trips: 1390,
    vehicleNumber: "JH05-QR-4321",
    vehicleType: "Electric Auto",
    seats: 3,
    color: "Teal Green & White",
    area: "Jugsalai",
    etaMinutes: 4,
    fareEstimate: 115,
    pickupNote: "Near Jugsalai Railway Overbridge",
    available: true,
    destinationHints: ["Jugsalai", "Tatanagar Station", "Bistupur", "Station Road", "Tata Steel Gate"]
  },
  {
    id: "auto-945",
    autoNumber: "AB-945",
    verificationHash: "AB945-E2B48G9P",
    name: "Bajaj Compact 4S",
    driverName: "Deepak Sharma",
    phone: "+91 93867 43905",
    rating: 4.7,
    trips: 650,
    vehicleNumber: "JH05-ST-8765",
    vehicleType: "CNG Auto",
    seats: 3,
    color: "Yellow & Green",
    area: "Baridih",
    etaMinutes: 8,
    fareEstimate: 145,
    pickupNote: "Near Baridih Roundabout",
    available: true,
    destinationHints: ["Baridih", "Birsanagar", "Telco", "Golmuri", "Agrico"]
  },
  {
    id: "auto-156",
    autoNumber: "AB-156",
    verificationHash: "AB156-D8S63W5C",
    name: "Mahindra Alfa DX",
    driverName: "Sanjay Hansda",
    phone: "+91 98014 90817",
    rating: 4.8,
    trips: 920,
    vehicleNumber: "JH05-UV-2109",
    vehicleType: "Bajaj RE",
    seats: 3,
    color: "Yellow & Black",
    area: "Adityapur",
    etaMinutes: 9,
    fareEstimate: 160,
    pickupNote: "Near Adityapur Industrial Area Phase 1",
    available: true,
    destinationHints: ["Adityapur", "Bistupur", "NIT Jamshedpur", "Gamharia", "Toll Bridge"]
  }
];

/**
 * Validates dataset uniqueness on startup
 */
export function validateAutoDataset(dataset = AUTOS) {
  const ids = new Set();
  const autoNumbers = new Set();
  const hashes = new Set();
  const vehicleNumbers = new Set();
  const errors = [];

  for (const item of dataset) {
    if (ids.has(item.id)) {
      errors.push(`Duplicate ID found: ${item.id}`);
    }
    ids.add(item.id);

    const normAutoNo = item.autoNumber.toUpperCase().trim();
    if (autoNumbers.has(normAutoNo)) {
      errors.push(`Duplicate Auto Number found: ${item.autoNumber}`);
    }
    autoNumbers.add(normAutoNo);

    const normHash = item.verificationHash.toUpperCase().trim();
    if (hashes.has(normHash)) {
      errors.push(`Duplicate Verification Hash found: ${item.verificationHash}`);
    }
    hashes.add(normHash);

    const normVehNo = item.vehicleNumber.toUpperCase().replace(/\s+/g, "");
    if (vehicleNumbers.has(normVehNo)) {
      errors.push(`Duplicate Vehicle Number found: ${item.vehicleNumber}`);
    }
    vehicleNumbers.add(normVehNo);
  }

  if (errors.length > 0) {
    console.error("Auto Bhaiya Dataset Integrity Validation Failed:", errors);
  } else {
    console.log(`[Auto Bhaiya] Verified ${dataset.length} autos with 100% unique identities.`);
  }

  return {
    valid: errors.length === 0,
    errors,
    count: dataset.length
  };
}

// Run verification at module load time
validateAutoDataset(AUTOS);

/**
 * Get all autos
 * @returns {Auto[]}
 */
export function getAutos() {
  return AUTOS;
}

/**
 * Find auto by ID
 * @param {string} id
 * @returns {Auto | undefined}
 */
export function getAutoById(id) {
  if (!id) return undefined;
  const clean = id.trim().toLowerCase();
  return AUTOS.find(
    (a) =>
      a.id.toLowerCase() === clean ||
      a.autoNumber.toLowerCase() === clean ||
      a.vehicleNumber.replace(/\s+/g, "").toLowerCase() === clean.replace(/\s+/g, "")
  );
}

/**
 * Find auto by Auto Number (e.g., "AB-101" or "AB101")
 * @param {string} autoNumber
 * @returns {Auto | undefined}
 */
export function getAutoByAutoNumber(autoNumber) {
  if (!autoNumber) return undefined;
  const clean = autoNumber.trim().toUpperCase().replace(/[\s_]/g, "-");
  return AUTOS.find(
    (a) =>
      a.autoNumber.toUpperCase() === clean ||
      a.autoNumber.toUpperCase().replace("-", "") === clean.replace("-", "")
  );
}

/**
 * Cryptographic-style local verification helper
 * Compares autoNumber + verificationHash against local trusted dataset
 * 
 * @param {string} autoNumber 
 * @param {string} verificationHash 
 * @returns {{
 *   verified: boolean,
 *   auto?: Auto,
 *   reason?: string,
 *   message: string,
 *   timestamp?: string
 * }}
 */
export function verifyAuto(autoNumber, verificationHash) {
  if (!autoNumber || !autoNumber.trim()) {
    return {
      verified: false,
      reason: "missing_auto_number",
      message: "Auto Bhaiya Number is required for verification."
    };
  }

  if (!verificationHash || !verificationHash.trim()) {
    return {
      verified: false,
      reason: "missing_hash",
      message: "Verification Hash / Security Code is required."
    };
  }

  const cleanAuto = autoNumber.trim().toUpperCase();
  const cleanHash = verificationHash.trim().toUpperCase();

  // Find Auto by autoNumber (or without hyphen)
  const matchedAuto = AUTOS.find((a) => {
    const aNum = a.autoNumber.toUpperCase();
    return aNum === cleanAuto || aNum.replace("-", "") === cleanAuto.replace("-", "");
  });

  if (!matchedAuto) {
    return {
      verified: false,
      reason: "auto_not_found",
      message: `No Auto Bhaiya registered with number "${autoNumber}".`
    };
  }

  // Exact pair comparison with verificationHash
  if (matchedAuto.verificationHash.toUpperCase() !== cleanHash) {
    return {
      verified: false,
      reason: "hash_mismatch",
      message: `Verification code "${verificationHash}" does not match the registered hash for ${matchedAuto.autoNumber}.`
    };
  }

  return {
    verified: true,
    auto: matchedAuto,
    timestamp: new Date().toLocaleString("en-IN", {
      dateStyle: "medium",
      timeStyle: "short"
    }),
    message: "This QR verifies that the Auto Bhaiya number and verification code match a registered Auto Bhaiya record in this application."
  };
}

/**
 * Generate full verification link or relative path for an auto
 * @param {Auto} auto
 * @param {boolean} [absolute=false]
 * @returns {string}
 */
export function getVerificationUrl(auto, absolute = false) {
  const query = `?auto=${encodeURIComponent(auto.autoNumber)}&hash=${encodeURIComponent(auto.verificationHash)}`;
  if (absolute && typeof window !== "undefined") {
    return `${window.location.origin}/verify${query}`;
  }
  return `/verify${query}`;
}

/**
 * Search autos by query string
 * Matches driver, vehicle number, auto number, area, destination, vehicle type
 * @param {string} query
 * @returns {Auto[]}
 */
export function searchAutos(query) {
  if (!query || !query.trim()) return AUTOS;
  const q = query.toLowerCase().trim();

  return AUTOS.filter((a) => {
    return (
      a.autoNumber.toLowerCase().includes(q) ||
      a.autoNumber.replace("-", "").toLowerCase().includes(q) ||
      a.driverName.toLowerCase().includes(q) ||
      a.vehicleNumber.toLowerCase().includes(q) ||
      a.vehicleType.toLowerCase().includes(q) ||
      a.area.toLowerCase().includes(q) ||
      a.name.toLowerCase().includes(q) ||
      a.destinationHints.some((d) => d.toLowerCase().includes(q))
    );
  });
}
