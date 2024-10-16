import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function Navigation() {
  const [token, setToken] = useState(localStorage.getItem("token"));

  useEffect(() => {
    const checkAuthStatus = () => {
      const currentToken = localStorage.getItem("token");
      setToken(currentToken);
    };

    window.addEventListener("storage", checkAuthStatus);
    return () => window.removeEventListener("storage", checkAuthStatus);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken(null);
    window.location.href = "/";
  };

  const buttonClass =
    "bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mx-2 my-3  focus:outline-none focus:shadow-outline shadow-md transform transition duration-200 hover:translate-y-0.5 no-underline";

  return (
    <nav className="bg-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <Link to="/" className={buttonClass}>
            Home
          </Link>
          <Link to="/available" className={buttonClass}>
            Available Tools
          </Link>
          <Link to="/profile" className={buttonClass}>
            Profile
          </Link>
        </div>

        <div>
          <Link
            to="/"
            className="text-2xl font-bold text-blue-600 no-underline"
          >
            GearShare
          </Link>
        </div>

        <div className="flex items-center space-x-4">
          {!token && (
            <>
              <Link to="/login" className={buttonClass}>
                Login
              </Link>
              <Link to="/register" className={buttonClass}>
                Join Us
              </Link>
            </>
          )}
          {token && (
            <button onClick={handleLogout} className={buttonClass}>
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
