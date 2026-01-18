import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import HomePage from "@/pages/Home";
import PaymentsPage from "@/pages/Payments";
import ProfilePage from "@/pages/Profile";
import Header from "@/components/Shared/Header";
import BottomNav from "@/components/Shared/BottomNav";
import Loader from "@/components/Shared/Loader";
import PersonalBhaiyaPage from "@/pages/PersonalBhaiya";
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
          <Route path="/" element={<PersonalBhaiyaPage />} />
          <Route path="/payments" element={<PaymentsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/personal-bhaiya" element={<HomePage />} />
        </Routes>
      </div>
      <BottomNav />
    </>
  );
}

export default App;
