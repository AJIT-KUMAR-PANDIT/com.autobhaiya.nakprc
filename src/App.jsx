import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "@/pages/Home";
import SearchResultsPage from "@/pages/SearchResults";
import VerifyPage from "@/pages/Verify";
import AutoDetails from "@/pages/AutoDetails";
import BookingPage from "@/pages/Booking";
import TrackingPage from "@/pages/Tracking";
import PaymentPage from "@/pages/Payment";
import BookingsListPage from "@/pages/BookingsList";
import ScannerPage from "@/pages/Scanner";
import ChatPage from "@/pages/ChatPage";
import WebLanding from "@/pages/WebLanding";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import NotFound from "@/pages/NotFound";
import Header from "@/components/Shared/Header";
import BottomNav from "@/components/Shared/BottomNav";
import Loader from "@/components/Shared/Loader";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 600); // quick smooth loader
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Hide top/bottom chrome on standalone marketing or legal pages
  const hideNavigation = [
    "/web",
    "/privacy-policy",
    "/terms-of-service"
  ].includes(location.pathname);

  // Full-bleed scanner
  const isScanner = location.pathname === "/scan";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans selection:bg-amber-400 selection:text-black">
      {!hideNavigation && !isScanner && <Header />}

      <main className="flex-1">
        <Routes>
          {/* Main App Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/app" element={<HomePage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/verify" element={<VerifyPage />} />

          {/* Auto Details */}
          <Route path="/auto/:id" element={<AutoDetails />} />
          <Route path="/auto-bhaiya/:id" element={<AutoDetails />} />

          {/* Booking & Tracking & Payment Journey */}
          <Route path="/booking/:id" element={<BookingPage />} />
          <Route path="/tracking/:id" element={<TrackingPage />} />
          <Route path="/payment/:id" element={<PaymentPage />} />

          {/* Bookings & History */}
          <Route path="/bookings" element={<BookingsListPage />} />
          <Route path="/history" element={<BookingsListPage />} />

          {/* QR Scanner */}
          <Route path="/scan" element={<ScannerPage />} />

          {/* Chat & Support */}
          <Route path="/chat" element={<ChatPage />} />

          {/* Marketing & Legal */}
          <Route path="/web" element={<WebLanding />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />

          {/* 404 Fallback */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!hideNavigation && !isScanner && <BottomNav />}
    </div>
  );
}

export default App;
