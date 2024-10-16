import React, { useEffect, useState } from "react";

const SettingsModal = ({ isOpen, onClose }) => {
  console.log("SettingsModal isOpen:", isOpen);
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
    if (isOpen) {
      const fetchUserData = async () => {
        try {
          const response = await fetch(
            `https://group-5-project-2.onrender.com/api/users/${userId}`,
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
    }
  }, [isOpen, userId, token]);

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
        `https://group-5-project-2.onrender.com/api/users/${userData._id}`,
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
        `https://group-5-project-2.onrender.com/api/users/${userData._id}/change-password`,
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto relative">
        <div className="overflow-y-auto pr-6 -mr-6 max-h-[calc(90vh-3rem)]">
          <div className="sticky top-2 right-2 flex justify-end z-10">
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 focus:outline-none"
            >
              <svg
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
          <div className="mt-3 text-center py-4">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Settings
            </h3>
            <div className="mt-2 px-7 py-3">
              <div className="w-32 h-32 bg-gray-200 rounded-lg overflow-hidden mx-auto mb-4">
                {userData.imageUrl || userData.imageFile ? (
                  <img
                    src={
                      userData.imageFile
                        ? URL.createObjectURL(userData.imageFile)
                        : `https://group-5-project-2.onrender.com/public/${userData.imageUrl}`
                    }
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <img
                    src="pp.jpg"
                    alt="Profile Placeholder"
                    className="w-full h-full object-cover"
                  />
                )}
              </div>

              <label
                htmlFor="profilePicture"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow-md transform transition duration-200 hover:translate-y-0.5 cursor-pointer inline-block text-center mt-4"
              >
                Change profile picture
              </label>

              <input
                id="profilePicture"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
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
                  className="mt-1 block w-full sm:text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                  className="mt-1 block w-full sm:text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                  className="mt-1 block w-full sm:text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                  className="mt-1 block w-full sm:text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                  className="mt-1 block w-full sm:text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                  className="mt-1 block w-full sm:text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow-md transform transition duration-200 hover:translate-y-0.5"
              >
                Update Profile
              </button>
            </form>

            {message && (
              <p className="mt-4 text-center text-sm text-green-600">
                {message}
              </p>
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
                    setPasswordData({
                      ...passwordData,
                      password: e.target.value,
                    })
                  }
                  className="mt-1 block w-full sm:text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                  className="mt-1 block w-full sm:text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
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
                  className="mt-1 block w-full sm:text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow-md transform transition duration-200 hover:translate-y-0.5"
              >
                Change Password
              </button>
            </form>
          </div>
          <div className="items-center px-4 py-3">
            <button
              id="ok-btn"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline shadow-md transform transition duration-200 hover:translate-y-0.5"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;
