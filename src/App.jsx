import React, { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./Components/Header";
import LandingPage from "./Components/LandingPage";
import SignupForm from "./Components/SignupForm";
import FreelancerDashboard from "./Components/FreelancerDashboard";
import ClientDashboard from "./Components/ClientDashboard";
import AdminDashboard from "./Components/AdminDashboard";
import SearchPage from "./Components/SearchPage";
import Messaging from "./Components/Messaging";
import LoginForm from "./Components/Login";
import AboutUs from "./Components/AboutUs";
import ContactUs from "./Components/ContactUs";
import Footer from "./Components/Footer";
import JobListing from "./Components/JobListing";
import Profile from "./Components/Profile";
import Settings from "./Components/Settings";

// Simple loading spinner component
function LoadingSpinner() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-10 z-50">
      <div className="w-12 h-12 border-4 border-blue-400 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );
}

function App() {
  const [loading, setLoading] = useState(false);

  // Example: Show spinner during navigation (optional, for demo)
  // You can use a router event or context for real-world apps

  return (
    <>
      <BrowserRouter>
        <div
          className="relative flex size-full min-h-screen flex-col bg-white dark:bg-gray-900 group/design-root overflow-x-hidden"
          style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}
        >
          <Header />
          {loading && <LoadingSpinner />}
          <div className="w-full max-w-7xl mx-auto flex flex-1 justify-center py-5 px-2 sm:px-4">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signup" element={<SignupForm />} />
              <Route
                path="/freelancer-dashboard"
                element={<FreelancerDashboard />}
              />
              <Route path="/client-dashboard" element={<ClientDashboard />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route path="/search" element={<SearchPage />} />
              <Route path="/messages" element={<Messaging />} />
              <Route path="/aboutus" element={<AboutUs />} />
              <Route path="/contactus" element={<ContactUs />} />
              <Route path="/login" element={<LoginForm />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/profile/:email" element={<Profile />} />
              <Route path="/jobs" element={<JobListing />} />
              <Route path="/settings" element={<Settings />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
