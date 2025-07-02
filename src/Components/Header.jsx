import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { db } from "../firebase";
import { doc, getDoc } from "firebase/firestore";

function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [profile, setProfile] = useState({ username: "", profileImage: "" });
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [dark, setDark] = useState(
    localStorage.getItem("theme") === "dark"
  );
  const [menuOpen, setMenuOpen] = useState(false);
  const dropdownRef = useRef();
  const navigate = useNavigate();

  // Fetch profile from Firestore
  useEffect(() => {
    const updateProfile = async () => {
      const userData = JSON.parse(localStorage.getItem("userData") || "{}");
      setIsLoggedIn(!!userData.email);

      if (userData.email) {
        try {
          const docRef = doc(db, "users", userData.email);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            const data = docSnap.data();
            setProfile({
              username: data.username || "",
              profileImage: data.profileImage || "",
            });
          } else {
            setProfile({ username: "", profileImage: "" });
          }
        } catch {
          setProfile({ username: "", profileImage: "" });
        }
      } else {
        setProfile({ username: "", profileImage: "" });
      }
    };

    updateProfile();
    window.addEventListener("loginUpdate", updateProfile);
    return () => window.removeEventListener("loginUpdate", updateProfile);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [dark]);

  const handleLogout = () => {
    localStorage.removeItem("userData");
    setIsLoggedIn(false);
    setProfile({ username: "", profileImage: "" });
    navigate("/");
  };

  const goToDashboard = () => {
    const userData = JSON.parse(localStorage.getItem("userData") || "{}");
    if (userData?.role) {
      navigate(`/${userData.role.toLowerCase()}-dashboard`);
    }
  };

  // Close menu on route change or click outside
  useEffect(() => {
    const closeMenu = () => setMenuOpen(false);
    window.addEventListener("resize", closeMenu);
    return () => window.removeEventListener("resize", closeMenu);
  }, []);

  return (
    <div className="bg-white dark:bg-gray-900 text-[#121416] dark:text-gray-100">
      <header className="flex items-center justify-between border-b px-4 sm:px-10 py-3 bg-white dark:bg-gray-900 shadow z-50 relative">
        {/* Logo */}
        <div className="flex items-center gap-4 text-[#121416]">
          <div className="size-4">
            <svg
              viewBox="0 0 48 48"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M39.475 21.6262..."
                fill="currentColor"
              />
            </svg>
          </div>
          <h2 className="text-[#121416] text-lg font-bold tracking-tight">
            SkillMatch
          </h2>
        </div>

        {/* Hamburger for mobile */}
        <button
          className="sm:hidden flex flex-col justify-center items-center w-8 h-8"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label="Toggle menu"
        >
          <span
            className={`block h-1 w-6 bg-gray-800 dark:bg-gray-100 mb-1 rounded transition-all ${
              menuOpen ? "rotate-45 translate-y-2" : ""
            }`}
          ></span>
          <span
            className={`block h-1 w-6 bg-gray-800 dark:bg-gray-100 mb-1 rounded transition-all ${
              menuOpen ? "opacity-0" : ""
            }`}
          ></span>
          <span
            className={`block h-1 w-6 bg-gray-800 dark:bg-gray-100 rounded transition-all ${
              menuOpen ? "-rotate-45 -translate-y-2" : ""
            }`}
          ></span>
        </button>

        {/* Navigation */}
        <nav
          className={`${
            menuOpen
              ? "flex flex-col absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-md z-40"
              : "hidden"
          } sm:flex sm:static sm:flex-row sm:items-center sm:bg-transparent sm:shadow-none`}
        >
          <Link to="/" className="block px-4 py-2 sm:py-0">
            Home
          </Link>
          <Link to="/aboutus" className="block px-4 py-2 sm:py-0">
            About
          </Link>
          <Link to="/contactus" className="block px-4 py-2 sm:py-0">
            Contact
          </Link>
          <Link to="/jobs" className="block px-4 py-2 sm:py-0">
            Jobs
          </Link>
          {/* Add more links as needed */}
        </nav>

        {/* Profile and settings dropdown or Auth buttons */}
        {isLoggedIn ? (
          <div className="relative ml-4" ref={dropdownRef}>
            <button
              className="flex items-center gap-2 focus:outline-none"
              onClick={() => setDropdownOpen((open) => !open)}
            >
              {profile.profileImage && (
                <img
                  src={profile.profileImage}
                  alt="Profile"
                  className="w-8 h-8 rounded-full object-cover border border-gray-300"
                />
              )}
              {profile.username && (
                <span className="text-sm font-semibold text-[#121416] dark:text-gray-100">
                  {profile.username}
                </span>
              )}
              <svg
                className="w-4 h-4 text-[#121416] dark:text-gray-100"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-md shadow-md z-50">
                <button
                  onClick={goToDashboard}
                  className="w-full text-left px-4 py-2 text-sm text-[#121416] dark:text-gray-100 hover:bg-[#f9f9f9] dark:hover:bg-gray-800"
                >
                  Dashboard
                </button>
                <Link
                  to="/profile"
                  className="block px-4 py-2 text-sm text-[#121416] dark:text-gray-100 hover:bg-[#f9f9f9] dark:hover:bg-gray-800"
                >
                  Edit Profile
                </Link>
                <Link
                  to="/settings"
                  className="block px-4 py-2 text-sm text-[#121416] dark:text-gray-100 hover:bg-[#f9f9f9] dark:hover:bg-gray-800"
                >
                  Settings
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-[#f9f9f9] dark:hover:bg-gray-800"
                >
                  Log Out
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex gap-3 ml-4">
            <Link
              to="/signup"
              className="flex min-w-[84px] items-center justify-center rounded-full h-10 px-4 bg-[#c9daec] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#a3c6e0] transition"
            >
              Sign Up
            </Link>
            <Link
              to="/login"
              className="flex min-w-[84px] items-center justify-center rounded-full h-10 px-4 bg-[#f1f2f4] text-[#121416] text-sm font-bold leading-normal tracking-[0.015em] hover:bg-[#e4e6e8] transition"
            >
              Log In
            </Link>
          </div>
        )}
      </header>
    </div>
  );
}

export default Header;
