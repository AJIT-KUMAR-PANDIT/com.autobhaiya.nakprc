import { Link } from "react-router-dom";
import { Home, History, Wallet, User } from "lucide-react";

export default function BottomNav() {
  return (
    <nav className="fixed bottom-0 left-0 w-full bg-white dark:bg-card-dark border-t border-gray-100 dark:border-gray-800 pb-[env(safe-area-inset-bottom)] pt-2 px-6 z-50 h-[80px]">
      <div className="flex justify-between items-center h-full pb-4">
        <Link
          className="flex flex-col items-center gap-1 text-primary w-16"
          to="/"
        >
          <Home className="w-[26px] h-[26px] fill-current" />
          <span className="text-[10px] font-medium">Home</span>
        </Link>
        <Link
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-text-main dark:hover:text-white transition-colors w-16"
          to="/history"
        >
          <History className="w-[26px] h-[26px]" />
          <span className="text-[10px] font-medium">History</span>
        </Link>
        <Link
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-text-main dark:hover:text-white transition-colors w-16"
          to="/payments"
        >
          <Wallet className="w-[26px] h-[26px]" />
          <span className="text-[10px] font-medium">Earnings</span>
        </Link>
        <Link
          className="flex flex-col items-center gap-1 text-gray-400 hover:text-text-main dark:hover:text-white transition-colors w-16"
          to="/profile"
        >
          <User className="w-[26px] h-[26px]" />
          <span className="text-[10px] font-medium">Profile</span>
        </Link>
      </div>
    </nav>
  );
}
