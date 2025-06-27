import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({ username: '', profileImage: '' });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    const updateProfile = () => {
      const userData = JSON.parse(localStorage.getItem('userData') || '{}');
      setIsLoggedIn(!!userData.email);

      const profileData = JSON.parse(localStorage.getItem(`profile-${userData.email}`) || '{}');
      setProfile({
        username: profileData.username || '',
        profileImage: profileData.profileImage || '',
      });
    };

    updateProfile();
    window.addEventListener('loginUpdate', updateProfile);
    return () => window.removeEventListener('loginUpdate', updateProfile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userData');
    setIsLoggedIn(false);
    navigate('/');
  };

  const goToDashboard = () => {
    const userData = JSON.parse(localStorage.getItem('userData') || '{}');
    if (userData?.role) {
      navigate(`/${userData.role.toLowerCase()}-dashboard`);
    }
  };

  return (
    <header className="flex items-center justify-between border-b px-10 py-3 bg-white shadow z-50 relative">
      {/* Logo */}
      <div className="flex items-center gap-4 text-[#121416]">
        <div className="size-4">
          <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              d="M39.475 21.6262..."
              fill="currentColor"
            />
          </svg>
        </div>
        <h2 className="text-[#121416] text-lg font-bold tracking-tight">SkillMatch</h2>
      </div>

      {/* Navigation + Profile */}
      <div className="flex flex-1 justify-end gap-8 items-center relative">
        <nav className="flex gap-6 text-sm font-medium text-[#121416]">
          <Link to="/">Home</Link>
          <Link to="/AboutUs">About</Link>
          <Link to="/ContactUs">Contact</Link>
        </nav>

        {isLoggedIn ? (
          <div className="relative" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setDropdownOpen(!dropdownOpen)}
            >
              {profile.profileImage && (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                />
              )}
              {profile.username && (
                <span className="text-sm font-semibold text-[#121416]">{profile.username}</span>
              )}
              <svg
                className="w-4 h-4 text-[#121416]"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-md shadow-md z-50">
                <button
                  onClick={goToDashboard}
                  className="w-full text-left px-4 py-2 text-sm text-[#121416] hover:bg-[#f9f9f9]"
                >
                  Dashboard
                </button>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-[#121416] hover:bg-[#f9f9f9]"
                >
                  Edit Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-[#121416] hover:bg-[#f9f9f9]"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#f9f9f9]"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <>
            <Link
              to="/signup"
              className="rounded-full bg-[#c9daec] text-[#121416] text-sm font-bold px-4 h-10 flex items-center"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="rounded-full bg-[#f1f2f4] text-[#121416] text-sm font-bold px-4 h-10 flex items-center"
            >
              Log In
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
