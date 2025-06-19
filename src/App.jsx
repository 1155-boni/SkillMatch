import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import LandingPage from './Components/LandingPage';
import SignupForm from './Components/SignupForm';
import FreelancerDashboard from './Components/FreelancerDashboard';
import ClientDashboard from './Components/ClientDashboard';
import AdminDashboard from './Components/AdminDashboard';
import SearchPage from './Components/SearchPage';
import Messaging from './Components/Messaging';
import LoginForm from './Components/Login';

function App() {
  return (
    <BrowserRouter>
      <div className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden" style={{ fontFamily: '"Work Sans", "Noto Sans", sans-serif' }}>
        <Header />
        <div className="px-40 flex flex-1 justify-center py-5">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/freelancer-dashboard" element={<FreelancerDashboard />} />
            <Route path="/client-dashboard" element={<ClientDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
            <Route path="/search" element={<SearchPage />} />
            <Route path="/messages" element={<Messaging />} />
            <Route path="/about" element={<div>About Us</div>} />
            <Route path="/contact" element={<div>Contact Us</div>} />
            <Route path="/login" element={<LoginForm />} />
            <Route path="/jobs" element={<div>Job Listings</div>} />
        </Routes>
      </div>
      </div>
    </BrowserRouter>
  );
}

export default App;
