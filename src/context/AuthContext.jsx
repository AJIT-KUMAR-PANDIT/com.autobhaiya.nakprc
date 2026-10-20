import React, { createContext, useContext, useState, useEffect } from "react";
import {
  getStoredUser,
  setStoredUser,
  clearStoredUser,
  requestOtp,
  verifyOtp,
  loginAsDemo,
  updateUserProfile,
  DEMO_PROFILES
} from "../data/auth.js";

const AuthContext = createContext(null);

const HAS_CLERK = Boolean(
  typeof import.meta !== "undefined" &&
  import.meta.env?.VITE_CLERK_PUBLISHABLE_KEY &&
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY.trim().length > 0
);

/**
 * Primary Authentication Provider for Auto Bhaiya by NAKPRC.
 * Supports Phone/OTP, Quick Demo role profiles, and Clerk hybrid integration.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => getStoredUser());
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authModalInitialTab, setAuthModalInitialTab] = useState("phone"); // "phone" | "demo" | "clerk"

  // Sync state on load
  useEffect(() => {
    const existing = getStoredUser();
    if (existing) {
      setUser(existing);
    }
  }, []);

  const openAuthModal = (initialTab = "phone") => {
    setAuthModalInitialTab(initialTab);
    setIsAuthModalOpen(true);
  };

  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
  };

  const handleRequestOtp = (phone) => {
    return requestOtp(phone);
  };

  const handleVerifyOtp = (phone, otp) => {
    const res = verifyOtp(phone, otp);
    if (res.success && res.user) {
      setUser(res.user);
      closeAuthModal();
    }
    return res;
  };

  const handleLoginAsDemo = (roleKey) => {
    const loggedInUser = loginAsDemo(roleKey);
    setUser(loggedInUser);
    closeAuthModal();
    return loggedInUser;
  };

  const handleLogout = () => {
    clearStoredUser();
    setUser(null);
  };

  const handleUpdateProfile = (updates) => {
    const updated = updateUserProfile(updates);
    if (updated) {
      setUser(updated);
    }
    return updated;
  };

  const value = {
    user,
    isSignedIn: Boolean(user),
    isAuthModalOpen,
    authModalInitialTab,
    openAuthModal,
    closeAuthModal,
    requestOtp: handleRequestOtp,
    verifyOtp: handleVerifyOtp,
    loginAsDemo: handleLoginAsDemo,
    logout: handleLogout,
    updateProfile: handleUpdateProfile,
    hasClerk: HAS_CLERK,
    demoProfiles: DEMO_PROFILES
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export default AuthContext;
