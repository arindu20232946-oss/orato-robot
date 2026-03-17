import React, { useState, useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
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

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-medium transition-all duration-200 py-2 px-4 block no-underline rounded-lg
     hover:bg-green-100 hover:scale-105 hover:shadow-md
     ${isActive ? 'text-green-600 font-semibold bg-green-50' : 'text-gray-700'}`;

  return (
    <nav className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8">
      <div className="bg-white/60 backdrop-blur-md border border-green-100 shadow-lg rounded-2xl transition-all max-w-7xl mx-auto">
        <div className="px-8 py-4">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <div className="flex items-center">
              <Link
                to="/"
                className="flex items-center gap-3 no-underline"
                onClick={closeMobileMenu}
              >
                <img
                  src={logo}
                  alt="Orato Logo"
                  className="w-14 h-14 rounded-xl shadow-md object-cover"
                />
                <span className="text-3xl font-bold text-green-600">Orato</span>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <ul className="hidden md:flex md:items-center md:gap-6">
              <li>
                <NavLink to="/" className={navLinkClass} onClick={closeMobileMenu}>
                  Home
                </NavLink>
              </li>
              <li>
                <NavLink to="/dashboard" className={navLinkClass} onClick={closeMobileMenu}>
                  Dashboard
                </NavLink>
              </li>
              <li>
                <NavLink to="/progress" className={navLinkClass} onClick={closeMobileMenu}>
                  Progress
                </NavLink>
              </li>
              <li>
                <NavLink to="/setting" className={navLinkClass} onClick={closeMobileMenu}>
                  Settings
                </NavLink>
              </li>
              <li>
                <NavLink to="/about" className={navLinkClass} onClick={closeMobileMenu}>
                  About Us
                </NavLink>
              </li>
            </ul>

            {/* Right Section */}
            <div className="flex items-center gap-4">
              {isLoggedIn ? (
                <NavLink
                  to="/account"
                  className={({ isActive }) =>
                    `flex items-center gap-2 py-2 px-4 rounded-lg transition-all duration-200 no-underline
                     hover:bg-green-100 hover:scale-105 hover:shadow-md
                     ${isActive ? "text-green-600 font-semibold bg-green-50" : "text-gray-700"}`
                  }
                  onClick={closeMobileMenu}
                >
                  {userAvatar ? (
                    <img
                      src={userAvatar}
                      alt="profile"
                      className="w-9 h-9 rounded-full object-cover border-2 border-green-500"
                    />
                  ) : (
                    <div className="w-9 h-9 rounded-full bg-green-500 flex items-center justify-center text-white text-sm font-semibold border-2 border-green-500 shrink-0">
                      {userInitials}
                    </div>
                  )}
                  <span className="font-semibold hidden md:inline">
                    {userName}
                  </span>
                </NavLink>
              ) : (
                <Link
                  to="/signin"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-base transition shadow-md hover:shadow-lg no-underline hidden md:block"
                  onClick={closeMobileMenu}
                >
                  Login
                </Link>
              )}

              {/* Hamburger Menu */}
              <div
                className="md:hidden flex flex-col gap-1 cursor-pointer z-50"
                onClick={toggleMobileMenu}
              >
                <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </div>
          </div>
        </div>

        {/*  Mobile Menu - FIXED */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-green-100 flex flex-col gap-2 p-6 bg-white/95 backdrop-blur-md rounded-b-2xl animate-fade-in-down">
            <NavLink to="/" className={navLinkClass} onClick={closeMobileMenu}>
              Home
            </NavLink>
            <NavLink to="/dashboard" className={navLinkClass} onClick={closeMobileMenu}>
              Dashboard
            </NavLink>
            <NavLink to="/progress" className={navLinkClass} onClick={closeMobileMenu}>
              Progress
            </NavLink>
            <NavLink to="/setting" className={navLinkClass} onClick={closeMobileMenu}>
              Settings
            </NavLink>
            <NavLink to="/about" className={navLinkClass} onClick={closeMobileMenu}>
              About Us
            </NavLink>

            {/* Login button in mobile menu */}
            {!isLoggedIn && (
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