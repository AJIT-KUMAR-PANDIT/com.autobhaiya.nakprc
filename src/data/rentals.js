/**
 * Auto Bhaiya - Rent a Driver & Hourly Auto Rental Service
 * Manages rental packages, verified rental drivers, and rental bookings.
 */

const RENTALS_STORAGE_KEY = "autobhaiya_rentals_v1";

/**
 * Predefined Hourly & Daily Rental Packages
 */
export const RENTAL_PACKAGES = [
  {
    id: "pkg-2h",
    name: "Short Trip & Market Run",
    durationHours: 2,
    includedKm: 20,
    price: 350,
    tag: "Popular for Errands",
    popular: false,
    description: "Ideal for quick bank visits, market shopping, or medical checkups with waiting included.",
    extraKmRate: 14,
    extraHourRate: 90
  },
  {
    id: "pkg-4h",
    name: "Half Day City Rental",
    durationHours: 4,
    includedKm: 40,
    price: 650,
    tag: "Best Value",
    popular: true,
    description: "Perfect for multi-stop errands across Bistupur, Sakchi, Kadma, and Sonari.",
    extraKmRate: 14,
    extraHourRate: 90
  },
  {
    id: "pkg-8h",
    name: "Full Day Dedicated Bhaiya",
    durationHours: 8,
    includedKm: 80,
    price: 1200,
    tag: "Full Day Shift",
    popular: false,
    description: "Dedicated Auto Bhaiya on standby all day for family functions, weddings, or business visits.",
    extraKmRate: 12,
    extraHourRate: 80
  },
  {
    id: "pkg-outstation",
    name: "Sightseeing & Outstation",
    durationHours: 10,
    includedKm: 120,
    price: 1850,
    tag: "Dalma & Dimna Lake",
    popular: false,
    description: "Specialized trip covering Dimna Lake, Dalma Wildlife Sanctuary, or scenic outskirts.",
    extraKmRate: 15,
    extraHourRate: 100
  }
];

/**
 * Pre-screened, verified Drivers available for Rent
 */
export const RENTAL_DRIVERS = [
  {
    id: "rd-101",
    name: "Ashok Kumar",
    phone: "+91 98351 23401",
    experienceYears: 7,
    rating: 4.95,
    totalRentalTrips: 342,
    languages: ["Hindi", "Bhojpuri", "Basic English"],
    vehiclePreference: "Bajaj RE CNG / EV Auto",
    hourlyRate: 120,
    dailyRate: 900,
    autoNumber: "AB-101",
    vehicleNumber: "JH05-AB-1234",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    badges: ["Police Verified", "Defensive Driving Certified", "Top Rated 2025"],
    availableNow: true,
    operatingHub: "Sakchi & Bistupur",
    bio: "Punctual, non-smoking, patient with elderly family members and children. 7+ years zero-accident record in Jamshedpur."
  },
  {
    id: "rd-204",
    name: "Manoj Singh",
    phone: "+91 98351 23402",
    experienceYears: 10,
    rating: 4.92,
    totalRentalTrips: 489,
    languages: ["Hindi", "Bengali"],
    vehiclePreference: "Mahindra Treo Electric",
    hourlyRate: 110,
    dailyRate: 850,
    autoNumber: "AB-204",
    vehicleNumber: "JH05-CD-5678",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    badges: ["EV Specialist", "Smooth Driver", "Route Master"],
    availableNow: true,
    operatingHub: "Bistupur & Kadma",
    bio: "Specializes in smooth electric auto rides. Knows all shortcut lanes to beat railway crossing and Golchakkar rush."
  },
  {
    id: "rd-318",
    name: "Raju Mahto",
    phone: "+91 98351 23403",
    experienceYears: 6,
    rating: 4.88,
    totalRentalTrips: 215,
    languages: ["Hindi", "Santhali"],
    vehiclePreference: "Piaggio Ape Cargo & Passenger",
    hourlyRate: 100,
    dailyRate: 800,
    autoNumber: "AB-318",
    vehicleNumber: "JH05-EF-9012",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    badges: ["Luggage & Cargo Expert", "Police Verified"],
    availableNow: true,
    operatingHub: "Tatanagar Station & Burma Mines",
    bio: "Specialist for station pickups, heavy luggage shifting, and full day commercial logistics."
  },
  {
    id: "rd-427",
    name: "Sunil Verma",
    phone: "+91 98351 23404",
    experienceYears: 8,
    rating: 4.97,
    totalRentalTrips: 378,
    languages: ["Hindi", "English"],
    vehiclePreference: "TVS King Deluxe CNG",
    hourlyRate: 130,
    dailyRate: 950,
    autoNumber: "AB-427",
    vehicleNumber: "JH05-GH-3456",
    avatar: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80",
    badges: ["School Routine Pro", "Family Friendly", "Background Verified"],
    availableNow: false,
    operatingHub: "Telco & Golmuri",
    bio: "Trusted by 20+ families for safe daily school and college drops for daughters and students."
  }
];

/**
 * Service Modes
 */
export const RENTAL_SERVICE_TYPES = [
  {
    id: "auto_and_driver",
    title: "Auto + Verified Driver",
    subtitle: "Complete auto vehicle with Bhaiya included",
    icon: "CarTaxiFront"
  },
  {
    id: "driver_only",
    title: "Driver Only (For Your Vehicle)",
    subtitle: "Hire a professional driver for your personal auto or car",
    icon: "UserCheck"
  },
  {
    id: "school_office_monthly",
    title: "Monthly School / Office Pass",
    subtitle: "Fixed daily morning & evening commute subscription",
    icon: "Calendar"
  }
];

let inMemoryRentals = null;

/**
 * Get all rental bookings
 * @returns {Array<object>}
 */
export function getRentalBookings() {
  if (typeof window === "undefined" || typeof localStorage === "undefined") {
    return inMemoryRentals || [];
  }
  try {
    const raw = localStorage.getItem(RENTALS_STORAGE_KEY);
    if (!raw) {
      // Seed a sample completed demo rental
      const seed = [
        {
          id: "RENT-9021",
          bookingNumber: "RENT-9021",
          packageId: "pkg-4h",
          packageName: "Half Day City Rental",
          serviceType: "auto_and_driver",
          durationHours: 4,
          includedKm: 40,
          totalFare: 650,
          driverId: "rd-101",
          driverName: "Ashok Kumar",
          driverPhone: "+91 98351 23401",
          autoNumber: "AB-101",
          vehicleNumber: "JH05-AB-1234",
          pickupAddress: "Kadma Uliyan, Jamshedpur",
          startDate: new Date(Date.now() - 86400000).toISOString().split("T")[0],
          startTime: "10:00 AM",
          purpose: "Shopping & Medical Checkup",
          passengerName: "Pooja Sharma",
          passengerPhone: "+91 98765 43210",
          status: "completed",
          paymentStatus: "completed",
          createdAt: new Date(Date.now() - 86400000).toISOString()
        }
      ];
      localStorage.setItem(RENTALS_STORAGE_KEY, JSON.stringify(seed));
      return seed;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.error("[Rentals] Failed to read stored rentals:", err);
    return [];
  }
}

/**
 * Create a new rental booking
 * @param {object} bookingData
 * @returns {object}
 */
export function createRentalBooking(bookingData) {
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const bookingNumber = `RENT-${randomNum}`;

  const newRental = {
    id: bookingNumber,
    bookingNumber,
    createdAt: new Date().toISOString(),
    status: "confirmed",
    paymentStatus: "pending",
    ...bookingData
  };

  const existing = getRentalBookings();
  const updated = [newRental, ...existing];

  inMemoryRentals = updated;

  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(RENTALS_STORAGE_KEY, JSON.stringify(updated));
    } catch (err) {
      console.error("[Rentals] Failed to write rental:", err);
    }
  }

  return newRental;
}

/**
 * Get rental booking by ID
 * @param {string} id
 * @returns {object|undefined}
 */
export function getRentalById(id) {
  if (!id) return undefined;
  const list = getRentalBookings();
  const clean = id.trim().toLowerCase();
  return list.find(
    (r) => r.id.toLowerCase() === clean || r.bookingNumber?.toLowerCase() === clean
  );
}

/**
 * Update rental booking status
 * @param {string} id
 * @param {"confirmed" | "in_progress" | "completed" | "cancelled"} status
 * @param {"pending" | "completed"} [paymentStatus]
 * @returns {object|null}
 */
export function updateRentalStatus(id, status, paymentStatus) {
  const list = getRentalBookings();
  const index = list.findIndex((r) => r.id === id || r.bookingNumber === id);
  if (index === -1) return null;

  list[index] = {
    ...list[index],
    status,
    ...(paymentStatus ? { paymentStatus } : {}),
    updatedAt: new Date().toISOString()
  };

  inMemoryRentals = list;

  if (typeof window !== "undefined" && typeof localStorage !== "undefined") {
    try {
      localStorage.setItem(RENTALS_STORAGE_KEY, JSON.stringify(list));
    } catch (err) {
      console.error("[Rentals] Failed to update rental status:", err);
    }
  }

  return list[index];
}
