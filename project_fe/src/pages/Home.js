import React from "react";
import { Link } from "react-router-dom";
import battery from "../images/battery.webp";

function Home() {
  const isLoggedIn = localStorage.getItem("token");

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-wrap items-center">
        <div className="w-full md:w-1/2 mb-8 md:mb-0">
          <h1 className="text-4xl md:text-5xl font-bold text-blue-900 mb-6">
            Find and Share Tools in Your Building
          </h1>
          <p className="text-xl text-gray-700 mb-8">
            Join our community and lend or borrow tools from your neighbors.
          </p>
          {!isLoggedIn && (
            <Link
              to="/join"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full text-lg transition duration-300 ease-in-out mb-4"
            >
              Join Now
            </Link>
          )}
          <div className="mt-4">
            <Link
              to="/available"
              className="inline-block bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded transition duration-300 ease-in-out"
            >
              Browse Available Tools
            </Link>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <div className="max-w-md mx-auto">
            <img
              src={battery}
              alt="Gearshare logo"
              className="w-full h-auto rounded-lg shadow-xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
