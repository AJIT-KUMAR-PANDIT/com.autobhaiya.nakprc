import { Link, useLocation, useParams } from "react-router-dom";
import { Home, History, Wallet, User } from "lucide-react";

export default function BottomNav() {
  const { pathname } = useLocation();
  const { vNumber } = useParams();

  // If we have a vNumber, the base path changes
  const basePath = vNumber ? `/auto-bhaiya/${vNumber}` : "/";

  // Build the correct links dynamically depending on context
  const homeLink = vNumber ? `/auto-bhaiya/${vNumber}` : "/";
  const historyLink = "/search"; // Route not properly defined yet, redirect to search maybe? Or keep history if you plan to add it
  const paymentsLink = vNumber ? `/auto-bhaiya/${vNumber}/payments` : "/"; // Payments require vNumber according to App.jsx
  const profileLink = vNumber ? `/auto-bhaiya/${vNumber}/profile` : "/"; // Profile requires vNumber according to App.jsx

  // Check which link is active
  const isHomeActive = pathname === homeLink || pathname === "/";
  const isHistoryActive = pathname.includes("/search") || pathname.includes("/history");
  const isPaymentsActive = pathname.includes("/payments");
  const isProfileActive = pathname.includes("/profile");

  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-card-dark border-t border-gray-100 dark:border-gray-800 pb-[env(safe-area-inset-bottom)] pt-2 px-6 z-50 h-[80px]">
      <div className="flex justify-between items-center h-full pb-4">
        <Link
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${isHomeActive ? "text-primary dark:text-primary" : "text-gray-400 hover:text-text-main dark:hover:text-white"}`}
          to={homeLink}
        >
          <Home className={`w-[26px] h-[26px] ${isHomeActive ? "fill-current" : ""}`} />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${isHistoryActive ? "text-primary dark:text-primary" : "text-gray-400 hover:text-text-main dark:hover:text-white"}`}
          to={historyLink}
        >
          <History className={`w-[26px] h-[26px] ${isHistoryActive ? "fill-current" : ""}`} />
          <span className="text-[10px] font-medium">History</span>
        </Link>
        <Link
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${isPaymentsActive ? "text-primary dark:text-primary" : "text-gray-400 hover:text-text-main dark:hover:text-white"}`}
          to={paymentsLink}
        >
          <Wallet className={`w-[26px] h-[26px] ${isPaymentsActive ? "fill-current" : ""}`} />
          <span className="text-[10px] font-medium">Earnings</span>
        </Link>
        <Link
          className={`flex flex-col items-center gap-1 w-16 transition-colors ${isProfileActive ? "text-primary dark:text-primary" : "text-gray-400 hover:text-text-main dark:hover:text-white"}`}
          to={profileLink}
        >
          <User className={`w-[26px] h-[26px] ${isProfileActive ? "fill-current" : ""}`} />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
