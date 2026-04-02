import React, { useEffect, useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import LoginModal from "./LoginModal";
import NormalSearch from "./NormalSearch";
import { useAuth } from "../context/AuthContext";
import { useCompare } from "../context/CompareContext";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Products", path: "/products" },
  { name: "Contact", path: "/contact" },
  { name: "About", path: "/about" },
];

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoginOpen, setIsLoginOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchRef = useRef(null);
  const location = useLocation();
  const { user, logout } = useAuth();
  const { compareList } = useCompare();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchOpen(false);
      }
    };
    if (isSearchOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isSearchOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 bg-gray-950 w-full flex items-center justify-between px-4 md:px-16 lg:px-24 xl:px-32 transition-all duration-500 z-50 ${
          isScrolled ? "shadow-md py-3 md:py-4" : "py-4 md:py-6"
        }`}
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={"navlogo.png"} alt="logo" className="h-9 filter grayscale" />
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          {navLinks.map((link, i) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={i}
                to={link.path}
                className={`group flex flex-col gap-0.5 text-lg ${
                  isActive
                    ? "font-semibold bg-gradient-to-br from-cyan-400 via-violet-400 to-pink-500 bg-clip-text text-transparent"
                    : "text-white"
                } hover:bg-gradient-to-br hover:from-cyan-400 hover:via-violet-400 hover:to-pink-500 hover:bg-clip-text hover:text-transparent transition-all duration-300`}
              >
                {link.name}
                <div
                  className={`bg-white h-0.5 ${isActive ? "w-full" : "w-0 group-hover:w-full"} transition-all duration-300`}
                />
              </Link>
            );
          })}
        </div>

        {/* Desktop Search + Compare + Auth */}
        <div className="flex items-center gap-4">
          {/* Search Icon */}
          {!isSearchOpen && (
            <div className="hidden md:flex items-center mr-2">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2 rounded-full hover:bg-gray-800 transition"
              >
                <img
                  src="https://img.icons8.com/ios-glyphs/30/ffffff/search.png"
                  alt="search"
                  className="h-5 w-5"
                />
              </button>
            </div>
          )}

          {isSearchOpen && (
            <div ref={searchRef}>
              <NormalSearch />
            </div>
          )}

          {/* Compare Link */}
          <Link
            to="/compare"
            className="hidden md:flex items-center gap-1 text-white text-sm hover:text-violet-300 transition relative"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            Compare
            {compareList.length > 0 && (
              <span className="absolute -top-2 -right-3 bg-pink-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                {compareList.length}
              </span>
            )}
          </Link>

          {/* Auth Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-white text-sm">Hi, {user.name}</span>
                <button
                  onClick={logout}
                  className="cursor-pointer px-5 py-2 rounded-full active:scale-95 transition-all duration-500 border border-white/30 text-white text-sm hover:bg-white/10"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsLoginOpen(true)}
                className="cursor-pointer px-8 py-2.5 rounded-full active:scale-95 transition-all duration-500 bg-gradient-to-br from-cyan-200 via-violet-500 to-pink-500 text-white"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center gap-3 md:hidden">
          <svg
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="h-6 w-6 cursor-pointer"
            fill="none"
            stroke="white"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <line x1="4" y1="18" x2="20" y2="18" />
          </svg>
        </div>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 left-0 w-full h-screen bg-white text-base flex flex-col md:hidden items-center justify-center gap-6 font-medium text-gray-800 transition-all duration-500 ${
            isMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <button className="absolute top-4 right-4" onClick={() => setIsMenuOpen(false)}>
            <svg className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {navLinks.map((link, i) => (
            <Link
              key={i}
              to={link.path}
              onClick={() => setIsMenuOpen(false)}
              className="font-semibold bg-gradient-to-br from-cyan-400 via-violet-400 to-pink-500 bg-clip-text text-transparent"
            >
              {link.name}
            </Link>
          ))}

          <Link to="/compare" onClick={() => setIsMenuOpen(false)} className="font-semibold text-violet-500">
            Compare ({compareList.length})
          </Link>

          {user ? (
            <>
              <span className="text-gray-600">Hi, {user.name}</span>
              <button
                onClick={() => { logout(); setIsMenuOpen(false); }}
                className="px-8 py-2.5 rounded-full border border-gray-300 text-gray-800 cursor-pointer"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => { setIsLoginOpen(true); setIsMenuOpen(false); }}
              className="cursor-pointer px-8 py-2.5 rounded-full transition-all duration-500 bg-gradient-to-br from-cyan-200 via-violet-500 to-pink-500 text-white"
            >
              Login
            </button>
          )}
        </div>
      </nav>

      <LoginModal isOpen={isLoginOpen} onClose={() => setIsLoginOpen(false)} />
    </>
  );
};

export default Navbar;
