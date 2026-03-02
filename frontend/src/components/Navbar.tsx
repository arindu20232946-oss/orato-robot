import React, { useState } from 'react';
import { Link, NavLink } from 'react-router-dom';
import logo from '../assets/logo.png';

interface NavbarProps {
  isLoggedIn?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ isLoggedIn = false }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  // Active link styling
  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    `font-medium transition-all py-2 px-4 block no-underline rounded-lg
     hover:bg-green-100 hover:scale-105 hover:shadow-md
     ${isActive ? 'text-green-600 font-semibold bg-green-50' : 'text-gray-700'}`;

  return (
    <nav className="sticky top-4 z-50 w-full px-4 sm:px-6 lg:px-8">
      <div className="bg-white/80 backdrop-blur-md border border-green-100 shadow-lg rounded-2xl transition-all max-w-7xl mx-auto">
        <div className="px-8 py-4">
          <div className="flex justify-between items-center">

            {/* Logo - LARGER SIZE */}
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

            {/* Navigation Links */}
            <ul
              className={`
                hidden md:flex md:items-center md:gap-6
                absolute md:static left-1/2 -translate-x-1/2 md:translate-x-0 top-[80px]
                ${isMobileMenuOpen ? 'flex flex-col bg-white w-full left-0 top-[80px] p-6 shadow-md rounded-b-2xl' : ''}
              `}
            >
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
       ${isActive
                      ? "text-green-600 font-semibold bg-green-50"
                      : "text-gray-700"
                    }`
                  }
                  onClick={closeMobileMenu}
                >
                  <svg
                    width="20"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <span className="font-medium hidden md:inline">Account</span>
                </NavLink>
              ) : (
                <Link
                  to="/signin"
                  className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-xl font-bold text-base transition shadow-md hover:shadow-lg"
                >
                  Login
                </Link>
              )}

              {/* Hamburger Menu */}
              <div
                className="md:hidden flex flex-col gap-1 cursor-pointer z-50"
                onClick={toggleMobileMenu}
              >
                <span className={`w-6 h-0.5 bg-gray-700 transition-all ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-gray-700 transition-all ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-6 h-0.5 bg-gray-700 transition-all ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>

            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;