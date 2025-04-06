import React, { useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";

function Header({ toggleAuthen, toggleAcc }) {
  const [isOpen, setIsOpen] = useState(false);
  const SmoothRef = useRef(null);
  const auth = localStorage.getItem("isAuthenticated") === "true";

  useEffect(() => {
    if (isOpen && SmoothRef.current) {
      SmoothRef.current.style.transform = "translateX(100%)";
      SmoothRef.current.style.transition = "transform 0.3s ease-in-out";
      requestAnimationFrame(() => {
        SmoothRef.current.style.transform = "translateX(0)";
      });
    } else if (SmoothRef.current) {
      SmoothRef.current.style.transition = "transform 0.3s ease-in-out";
      SmoothRef.current.style.transform = "translateX(100%)";
    }
  }, [isOpen]);

  const navLinks = [
    { to: "/", label: "Dashboard" },
    { to: "/workspace", label: "Workspace" },
    { to: "/builder", label: "Builder" },
    { to: "/collaboration", label: "Collaboration" },
    { to: "/analytics", label: "Analytics" },
  ];

  return (
    <header className="bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-800 text-white shadow-lg">
      <nav className="container mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="p-2 bg-white/10 rounded-lg backdrop-blur-sm">
            <svg
              className="w-6 h-6 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
              />
            </svg>
          </div>
          <span className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-200">
            Agent Dashboard
          </span>
        </div>

        <div className="lg:hidden">
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="text-white focus:outline-none"
          >
            <svg
              className="w-8 h-8"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"}
              />
            </svg>
          </button>
        </div>

        <ul className="hidden lg:flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full px-2 py-1">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `px-4 py-2 rounded-full text-sm font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-white text-indigo-700 shadow-md"
                      : "text-gray-100 hover:text-white hover:bg-white/20"
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {!auth && (
          <button
            className="lg:flex cursor-pointer hidden items-center justify-center relative overflow-hidden group px-6 py-3 rounded-lg"
            onClick={toggleAuthen}
          >
            <span className="relative z-10 flex items-center gap-2 font-medium text-n-8 group-hover:text-n-1 transition-colors duration-300">
              Sign in
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 group-hover:translate-x-1 group-hover:stroke-n-1"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
              </svg>
            </span>

            <span className="absolute inset-0 bg-gradient-to-r from-color-1 to-color-1/90 rounded-lg group-hover:from-color-1/90 group-hover:to-color-1 transition-all duration-500"></span>

            <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-color-1/20 to-transparent rounded-lg"></span>
            </span>

            <span className="absolute top-0 left-0 w-1/2 h-full bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 group-hover:opacity-100 group-hover:animate-shine transition-opacity duration-300"></span>

            <span className="absolute inset-0 border-2 border-color-1/50 rounded-lg group-hover:border-color-1 transition-all duration-500"></span>

            <span className="absolute inset-0 rounded-lg shadow-md group-hover:shadow-lg group-hover:shadow-color-1/30 transition-all duration-300"></span>
          </button>
        )}

        {auth && (
          <button
            className="lg:flex hidden items-center justify-center relative overflow-hidden group px-6 py-3 rounded-lg cursor-pointer"
            onClick={toggleAcc}
          >
            <span className="relative z-10 flex items-center gap-2 font-medium text-n-1 group-hover:text-color-1 transition-colors duration-300">
              Account
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="transition-all duration-300 group-hover:translate-x-1 group-hover:stroke-color-1"
              >
                <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </span>

            <span className="absolute inset-0 bg-n-6/50 rounded-lg transition-all duration-500 group-hover:bg-n-6/70"></span>

            <span className="absolute inset-0 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500">
              <span className="absolute top-0 left-0 w-full h-full bg-gradient-to-r from-color-1/10 to-transparent rounded-lg"></span>
            </span>

            <span className="absolute inset-0 border border-n-4/30 rounded-lg group-hover:border-color-1/50 transition-all duration-500"></span>

            <span className="absolute inset-0 rounded-lg scale-95 opacity-0 group-hover:scale-100 group-hover:opacity-100 transition-all duration-500">
              <span className="absolute top-0 left-0 w-full h-full border-2 border-color-1/20 rounded-lg animate-pulse"></span>
            </span>
          </button>
        )}
      </nav>

      <div
        className={`lg:hidden bg-indigo-700 px-6 py-3 transition-all duration-300 ${
          isOpen ? "block" : "hidden"
        }`}
        ref={SmoothRef}
        style={{ transform: "translateX(100%)" }}
      >
        <ul className="space-y-2">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  `block px-3 py-2 rounded-md text-base font-medium ${
                    isActive
                      ? "bg-white text-indigo-700"
                      : "text-white hover:bg-white/20"
                  }`
                }
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {auth ? (
          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={toggleAcc}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-300"
            >
              <span>My Account</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
            </button>
          </div>
        ) : (
          <div className="mt-auto pt-4 border-t border-gray-200">
            <button
              onClick={toggleAuthen}
              className="w-full flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium rounded-lg hover:from-blue-600 hover:to-indigo-600 transition-all duration-300"
            >
              <span>Sign In</span>
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                />
              </svg>
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

export default Header;
