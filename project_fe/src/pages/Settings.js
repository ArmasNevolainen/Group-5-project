import React, { useEffect, useState } from "react";

const Settings = () => {
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    streetName: "",
    city: "",
    postalCode: "",
    email: "",
    imageUrl: null,
  });

  const [passwordData, setPasswordData] = useState({
    password: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [message, setMessage] = useState("");
  const token = localStorage.getItem("token");
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await fetch(
          `https://group-5-project-1.onrender.com/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching user data: ${response.statusText}`);
        }

        const userData = await response.json();
        setUserData(userData);
      } catch (error) {
        console.error("Error fetching user data", error);
        setMessage(`An error occurred: ${error.message}`);
      }
    };

    fetchUserData();
  }, [userId, token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();

    Object.keys(userData).forEach((key) => {
      if (key !== "imageFile" && key !== "sharedTools") {
        formData.append(key, userData[key]);
      }
    });

    if (userData.imageFile) {
      formData.append("image", userData.imageFile);
    }

    try {
      const response = await fetch(
        `https://group-5-project-1.onrender.com/api/users/${userData._id}`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${token}`,
          },
          body: formData,
        }
      );

      if (response.ok) {
        const updatedUser = await response.json();
        setUserData(updatedUser);
        setMessage("Profile updated successfully");
        setTimeout(() => setMessage(""), 6000);
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to update user data");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
      setMessage("An error occurred while updating user data");
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/") && file.size <= 5000000) {
      setUserData((prevData) => ({
        ...prevData,
        imageFile: file,
      }));
    } else {
      setMessage("Please select a valid image file (max 5MB).");
      setTimeout(() => setMessage(""), 6000);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage("New passwords do not match.");
      setTimeout(() => setMessage(""), 6000);
      return;
    }

    if (!userData._id) {
      setMessage("User data not loaded. Please refresh the page.");
      return;
    }

    try {
      const response = await fetch(
        `https://group-5-project-1.onrender.com/api/users/${userData._id}/change-password`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            oldPassword: passwordData.password,
            newPassword: passwordData.newPassword,
          }),
        }
      );

      if (response.ok) {
        setMessage("Password changed successfully.");
        setPasswordData({ password: "", newPassword: "", confirmPassword: "" });
      } else {
        const errorData = await response.json();
        setMessage(errorData.message || "Failed to change password.");
      }
    } catch (error) {
      console.error("Error changing password:", error);
      setMessage("An error occurred while changing the password.");
    }
    setTimeout(() => setMessage(""), 6000);
  };

  return (
    <div className="bg-gray-100 min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4">
        <div className="bg-white shadow-lg rounded-lg p-8 md:p-12">
          <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
            Settings
          </h1>

          <div className="mb-8 flex flex-col items-center">
            <div className="w-32 h-32 bg-gray-200 rounded-full overflow-hidden">
              {userData.imageUrl ? (
                <img
                  src={`https://group-5-project-1.onrender.com/public/${userData.imageUrl}`}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  150 × 150
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="mt-4 w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                value={userData.firstName}
                onChange={(e) =>
                  setUserData({ ...userData, firstName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                value={userData.lastName}
                onChange={(e) =>
                  setUserData({ ...userData, lastName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="streetName"
                className="block text-sm font-medium text-gray-700"
              >
                Address
              </label>
              <input
                type="text"
                id="streetName"
                value={userData.streetName}
                onChange={(e) =>
                  setUserData({ ...userData, streetName: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="city"
                className="block text-sm font-medium text-gray-700"
              >
                City
              </label>
              <input
                type="text"
                id="city"
                value={userData.city}
                onChange={(e) =>
                  setUserData({ ...userData, city: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="postalCode"
                className="block text-sm font-medium text-gray-700"
              >
                Postal Code
              </label>
              <input
                type="text"
                id="postalCode"
                value={userData.postalCode}
                onChange={(e) =>
                  setUserData({ ...userData, postalCode: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                value={userData.email}
                onChange={(e) =>
                  setUserData({ ...userData, email: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Update Profile
            </button>
          </form>

          {message && (
            <p className="mt-4 text-center text-sm text-green-600">{message}</p>
          )}

          <form onSubmit={handleChangePassword} className="mt-16 space-y-8">
            <h2 className="text-xl font-semibold text-gray-800">
              Change Password
            </h2>
            <div>
              <label
                htmlFor="currentPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Current Password
              </label>
              <input
                type="password"
                id="currentPassword"
                value={passwordData.password}
                onChange={(e) =>
                  setPasswordData({ ...passwordData, password: e.target.value })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="newPassword"
                className="block text-sm font-medium text-gray-700"
              >
                New Password
              </label>
              <input
                type="password"
                id="newPassword"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-medium text-gray-700"
              >
                Confirm New Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={passwordData.confirmPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    confirmPassword: e.target.value,
                  })
                }
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Change Password
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Settings;
