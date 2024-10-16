import React from "react";
import defaultProfilePic from "./PP.jpg";

function UserProfile({ userData }) {
  const token = localStorage.getItem("token");

  if (!token) {
    window.location.href = "/";
  }

  if (!userData) return <div className="text-center">Loading...</div>;

  return (
    <div className="w-full max-w-sm mx-auto bg-white shadow-lg rounded-lg overflow-hidden">
      <div className="p-4">
        <img
          src={
            `https://group-5-project-1.onrender.com/public/${userData.imageUrl}` ||
            defaultProfilePic
          }
          alt="Profile"
          className="w-full h-full object-cover"
        />
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-2">
          {userData.firstName} {userData.lastName}
        </h2>
        <div className="text-gray-600">
          <p className="mb-1">
            <span className="font-semibold">City:</span> {userData.city}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Street:</span> {userData.streetName}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Postal Code:</span>{" "}
            {userData.postalCode}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Email:</span> {userData.email}
          </p>
          <p className="mb-1">
            <span className="font-semibold">Phone:</span>{" "}
            {userData.phone || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
