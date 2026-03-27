import React, { useState, useEffect, useRef } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

interface NavbarProps {
  isLoggedIn?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn: propIsLoggedIn }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userInitials, setUserInitials] = useState("U");

  // Dropdown & logout confirmation state
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const syncFromStorage = () => {
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    setIsLoggedIn(!!token || propIsLoggedIn || false);
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      const fullName = parsedUser.fullName || "";
      const firstName = fullName.split(".").pop()?.trim().split(" ")[0] || "User";
      const initials = fullName
        ? fullName.split(" ").map((n: string) => n[0]).join("").toUpperCase().slice(0, 2)
        : "U";
      setUserName(firstName);
      setUserAvatar((parsedUser.profilePicture && parsedUser.profilePicture.trim() !== "") ? parsedUser.profilePicture : "");
      setUserInitials(initials);
    }
  };

  useEffect(() => {
    syncFromStorage();
    window.addEventListener("storage", syncFromStorage);
    return () => window.removeEventListener("storage", syncFromStorage);
  }, [propIsLoggedIn]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsDropdownOpen(false);
        setShowLogoutConfirm(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const handleLogoutConfirmed = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.dispatchEvent(new Event("storage"));
    setIsLoggedIn(false);
    setIsDropdownOpen(false);
    setShowLogoutConfirm(false);
    closeMobileMenu();
    navigate("/");
  };

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-medium transition-all duration-200 py-2 px-4 block no-underline rounded-lg
     hover:bg-green-100 hover:scale-105 hover:shadow-md
     ${isActive ? 'text-green-600 font-semibold bg-green-50' : 'text-gray-700'}`;

  // Reusable avatar element
  const AvatarEl = ({ size = "w-9 h-9" }: { size?: string }) =>
    userAvatar ? (
      <img src={userAvatar} alt="profile" className={`${size} rounded-full object-cover border-2 border-green-500 flex-shrink-0`} />
    ) : (
      <div className={`${size} rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold border-2 border-green-500 flex-shrink-0`}>
        {userInitials}
      </div>
    );

  return (
    <nav className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8">
      <div className="bg-white/60 backdrop-blur-md border border-green-100 shadow-lg rounded-2xl transition-all max-w-7xl mx-auto">
        <div className="px-4 sm:px-8 py-4">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <div className="flex items-center flex-shrink-0">
              <Link to="/" className="flex items-center gap-3 no-underline" onClick={closeMobileMenu}>
                <img src={logo} alt="Orato Logo" className="w-10 h-10 sm:w-14 sm:h-14 rounded-xl shadow-md object-cover flex-shrink-0" />
                <span className="text-xl sm:text-2xl lg:text-3xl font-bold text-green-600 whitespace-nowrap">Orato</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <ul className="hidden lg:flex lg:items-center lg:gap-4 xl:gap-6">
              <li><NavLink to="/" className={navLinkClass} onClick={closeMobileMenu}>Home</NavLink></li>
              <li><NavLink to="/dashboard" className={navLinkClass} onClick={closeMobileMenu}>Dashboard</NavLink></li>
              <li><NavLink to="/progress" className={navLinkClass} onClick={closeMobileMenu}>Progress</NavLink></li>
              <li><NavLink to="/setting" className={navLinkClass} onClick={closeMobileMenu}>Settings</NavLink></li>
              <li><NavLink to="/about" className={navLinkClass} onClick={closeMobileMenu}>About Us</NavLink></li>
            </ul>

            {/* Right Section */}
            <div className="flex items-center gap-3">

              {isLoggedIn ? (
                /* ── Account Dropdown ── */
                <div className="relative" ref={dropdownRef}>

                  {/* Trigger button */}
                  <button
                    onClick={() => { setIsDropdownOpen((p) => !p); setShowLogoutConfirm(false); }}
                    className="flex items-center gap-2 py-2 px-3 rounded-lg transition-all duration-200 hover:bg-green-100 hover:scale-105 hover:shadow-md focus:outline-none"
                    aria-label="Account menu"
                    aria-expanded={isDropdownOpen}
                  >
                    <AvatarEl />
                    <span className="font-semibold hidden lg:inline whitespace-nowrap text-gray-700">{userName}</span>
                    <svg
                      className={`w-4 h-4 text-gray-500 hidden lg:block transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`}
                      fill="none" stroke="currentColor" viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  {/* Dropdown panel */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-60 bg-white/95 backdrop-blur-md border border-green-100 rounded-2xl shadow-2xl overflow-hidden z-50">

                      {!showLogoutConfirm ? (
                        <div className="py-1">
                          {/* Visit Profile */}
                          <Link
                            to="/account"
                            onClick={() => { setIsDropdownOpen(false); setShowLogoutConfirm(false); }}
                            className="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-green-50 transition-colors no-underline"
                          >
                            <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                              </svg>
                            </div>
                            <span className="font-semibold">Visit Profile</span>
                          </Link>

                          <div className="border-t border-gray-100 mx-4" />

                          {/* Logout */}
                          <button
                            onClick={() => setShowLogoutConfirm(true)}
                            className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
                          >
                            <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                              <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                              </svg>
                            </div>
                            <span className="font-semibold">Logout</span>
                          </button>
                        </div>
                      ) : (
                        /* Logout confirmation */
                        <div className="px-4 py-4">
                          <div className="flex items-center gap-2 mb-2">
                            <svg className="w-5 h-5 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                            </svg>
                            <p className="text-sm font-bold text-gray-800">Log out of Orato?</p>
                          </div>
                          <p className="text-xs text-gray-500 mb-4 leading-relaxed">
                            You'll need to sign in again to continue your learning journey.
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setShowLogoutConfirm(false)}
                              className="flex-1 px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={handleLogoutConfirmed}
                              className="flex-1 px-3 py-2 text-xs font-bold rounded-xl bg-red-500 hover:bg-red-600 text-white transition-all shadow-sm hover:shadow-md"
                            >
                              Yes, Logout
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/signin"
                  className="bg-green-500 hover:bg-green-600 text-white px-6 py-2.5 rounded-xl font-bold text-sm lg:text-base transition shadow-md hover:shadow-lg no-underline hidden lg:block whitespace-nowrap"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              )}

              {/* Hamburger */}
              <div
                className="lg:hidden flex flex-col gap-1.5 cursor-pointer z-50 p-1"
                onClick={toggleMobileMenu}
                aria-label="Toggle menu"
              >
                <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 origin-center ${isMobileMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0 scale-x-0' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 origin-center ${isMobileMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile / Tablet Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-green-100 flex flex-col gap-2 p-6 bg-white/95 backdrop-blur-md rounded-b-2xl animate-fade-in-down">
            <NavLink to="/" className={navLinkClass} onClick={closeMobileMenu}>Home</NavLink>
            <NavLink to="/dashboard" className={navLinkClass} onClick={closeMobileMenu}>Dashboard</NavLink>
            <NavLink to="/progress" className={navLinkClass} onClick={closeMobileMenu}>Progress</NavLink>
            <NavLink to="/setting" className={navLinkClass} onClick={closeMobileMenu}>Settings</NavLink>
            <NavLink to="/about" className={navLinkClass} onClick={closeMobileMenu}>About Us</NavLink>

            {isLoggedIn ? (
              <div className="mt-2 border-t border-green-100 pt-3 flex flex-col gap-1">

                {/* Visit Profile */}
                <Link
                  to="/account"
                  onClick={closeMobileMenu}
                  className="flex items-center gap-3 py-2 px-4 rounded-lg text-gray-700 hover:bg-green-50 transition-colors no-underline"
                >
                  <AvatarEl />
                  <span className="font-semibold">{userName}</span>
                  <span className="ml-auto text-xs text-green-600 font-semibold bg-green-100 px-2 py-0.5 rounded-full">Profile</span>
                </Link>

                {/* Mobile logout */}
                {!showLogoutConfirm ? (
                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    className="flex items-center gap-3 py-2 px-4 rounded-lg text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                  >
                    <div className="w-9 h-9 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                      <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                      </svg>
                    </div>
                    <span className="font-semibold">Logout</span>
                  </button>
                ) : (
                  <div className="px-4 py-4 bg-red-50 rounded-2xl border border-red-100 mt-1">
                    <div className="flex items-center gap-2 mb-1">
                      <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                      </svg>
                      <p className="text-sm font-bold text-gray-800">Log out of Orato?</p>
                    </div>
                    <p className="text-xs text-gray-500 mb-3 leading-relaxed">
                      You'll need to sign in again to continue learning.
                    </p>
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className="flex-1 px-3 py-2 text-xs font-bold rounded-xl border border-gray-200 text-gray-600 hover:bg-white transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleLogoutConfirmed}
                        className="flex-1 px-3 py-2 text-xs font-bold rounded-xl bg-red-500 hover:bg-red-600 text-white transition-colors"
                      >
                        Yes, Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/signin"
                className="mt-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-bold text-base transition shadow-md text-center no-underline"
                onClick={closeMobileMenu}
              >
                Login
              </Link>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;