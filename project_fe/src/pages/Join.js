import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Join = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    postalCode: "",
    phone: "",
    email: "",
    confirmEmail: "",
    password: "",
    confirmPassword: "",
  });
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const trimmedEmail = formData.email.trim().toLowerCase();
    const trimmedConfirmEmail = formData.confirmEmail.trim().toLowerCase();
    const trimmedPassword = formData.password.trim();
    const trimmedConfirmPassword = formData.confirmPassword.trim();

    if (trimmedEmail !== trimmedConfirmEmail) {
      setErrorMessage("Emails do not match");
      return;
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      setErrorMessage("Passwords do not match");
      return;
    }

    try {
      const response = await fetch(
        "https://group-5-project-2.onrender.com/api/users",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...formData,
            email: trimmedEmail,
            confirmEmail: trimmedConfirmEmail,
            password: trimmedPassword,
            confirmPassword: trimmedConfirmPassword,
          }),
        }
      );

      if (response.ok) {
        const result = await response.json();
        console.log("User created successfully:", result);
        setErrorMessage("");
        navigate("/profile");
      } else {
        const result = await response.json();
        setErrorMessage(result.message);
      }
    } catch (error) {
      console.error("Error:", error.message);
      setErrorMessage("Failed to create user");
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Join Now</h1>
      {errorMessage && (
        <p className="text-red-500 text-center mb-4">{errorMessage}</p>
      )}
      <form onSubmit={handleSubmit} className="max-w-lg mx-auto space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="firstName" className="block text-gray-700 mb-2">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="lastName" className="block text-gray-700 mb-2">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="address" className="block text-gray-700 mb-2">
            Address
          </label>
          <input
            type="text"
            id="address"
            value={formData.address}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="city" className="block text-gray-700 mb-2">
              City
            </label>
            <input
              type="text"
              id="city"
              value={formData.city}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <div>
            <label htmlFor="postalCode" className="block text-gray-700 mb-2">
              Postal Code
            </label>
            <input
              type="text"
              id="postalCode"
              value={formData.postalCode}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
        </div>
        <div>
          <label htmlFor="phone" className="block text-gray-700 mb-2">
            Phone
          </label>
          <input
            type="text"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-gray-700 mb-2">
            Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmEmail" className="block text-gray-700 mb-2">
            Confirm Email
          </label>
          <input
            type="email"
            id="confirmEmail"
            value={formData.confirmEmail}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="password" className="block text-gray-700 mb-2">
            Password
          </label>
          <input
            type="password"
            id="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="confirmPassword" className="block text-gray-700 mb-2">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md transition duration-300 ease-in-out"
        >
          Join Now
        </button>
      </form>
    </div>
  );
};

export default Join;
