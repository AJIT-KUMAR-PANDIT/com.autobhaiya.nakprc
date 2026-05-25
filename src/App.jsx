import { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import HomePage from "@/pages/Home";
import PaymentsPage from "@/pages/Payments";
import ProfilePage from "@/pages/Profile";
import Header from "@/components/Shared/Header";
import BottomNav from "@/components/Shared/BottomNav";
import Loader from "@/components/Shared/Loader";
import PersonalBhaiyaPage from "@/pages/PersonalBhaiya";
import LandingPage from "@/pages/Landing";
import WebLanding from "@/pages/WebLanding";
import SearchResultsPage from "@/pages/SearchResults";
import HistoryPage from "@/pages/History";
import ScannerPage from "@/pages/Scanner";
import ChatPage from "@/pages/ChatPage";
import NotFound from "@/pages/NotFound";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import TermsOfService from "@/pages/TermsOfService";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  // Do not show Header/BottomNav on these pages
  const hideNavigation = [
    "/",
    "/privacy-policy",
    "/terms-of-service"
  ].includes(location.pathname);

  return (
    <>
      {!hideNavigation && <Header />}
      <div className={!hideNavigation ? "pb-24 mb-44 pt-[10px]" : "pb-0 mb-0"}>
        <Routes>
          <Route path="/" element={<WebLanding />} />
          <Route path="/app" element={<LandingPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/scan" element={<ScannerPage />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          {/* <Route path="/payments" element={<PaymentsPage />} /> */}
          {/* <Route path="/profile" element={<ProfilePage />} /> */}
          {/* <Route path="/auto-bhaiya" element={<PersonalBhaiyaPage />} /> */}
          <Route
            path="/auto-bhaiya/:vNumber"
            element={<PersonalBhaiyaPage />}
          />
          <Route
            path="/auto-bhaiya/:vNumber/payments"
            element={<PaymentsPage />}
          />
          <Route
            path="/auto-bhaiya/:vNumber/profile"
            element={<ProfilePage />}
          />
          <Route path="/chat" element={<ChatPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </div>
      {!hideNavigation && <BottomNav />}
    </>
  );
}

export default App;
