import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/Home";
import PaymentsPage from "@/pages/Payments";
import ProfilePage from "@/pages/Profile";
import Header from "@/components/Shared/Header";
import BottomNav from "@/components/Shared/BottomNav";
import Loader from "@/components/Shared/Loader";
import PersonalBhaiyaPage from "@/pages/PersonalBhaiya";
import LandingPage from "@/pages/Landing";
import SearchResultsPage from "@/pages/SearchResults";
import HistoryPage from "@/pages/History";
import ScannerPage from "@/pages/Scanner";
import "./App.css";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      <Header />
      <div className="pb-24 mb-44">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/scan" element={<ScannerPage />} />
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
        </Routes>
      </div>
      <BottomNav />
    </>
  );
}

export default App;
