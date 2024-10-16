import React, { useEffect, useState } from "react";
import UserProfile from "../components/Profile/UserProfile";
import ToolsCard from "../components/Tools/Tools";
import AddItemModal from "../components/Profile/AddItemModal";
import EditItemModal from "../components/Profile/EditItemModal";
import SettingsModal from "../components/Profile/SettingsModal";

function Profile() {
  const [userData, setUserData] = useState(null);
  const [sharedTools, setSharedTools] = useState([]);
  const [borrowedTools, setBorrowedTools] = useState([]);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentTool, setCurrentTool] = useState(null);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const userId = localStorage.getItem("userId");

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

        const userJson = await response.json();
        setUserData(userJson);
      } catch (error) {
        console.error("Error fetching user data", error);
        setError(error.message);
      }
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    if (!userData) return;

    const fetchTools = async () => {
      try {
        const token = localStorage.getItem("token");

        const response = await fetch(
          `https://group-5-project-1.onrender.com/api/tools/user-tools?userId=${userData._id}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error fetching user tools: ${response.statusText}`);
        }

        const { availableTools, borrowedTools } = await response.json();
        setSharedTools(availableTools);
        setBorrowedTools(borrowedTools);
      } catch (error) {
        console.error("Error fetching tools", error);
        setError(error.message);
      }
    };

    fetchTools();
  }, [userData]);

  const handleShare = async (toolId) => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(
        `https://group-5-project-1.onrender.com/api/tools/${toolId}/availability`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to update tool availability: ${response.statusText}`
        );
      }

      const updatedTool = await response.json();

      if (updatedTool.tool.available) {
        setBorrowedTools((prevTools) =>
          prevTools.filter((tool) => tool._id !== updatedTool.tool._id)
        );
        setSharedTools((prevTools) => [...prevTools, updatedTool.tool]);
      } else {
        setSharedTools((prevTools) =>
          prevTools.filter((tool) => tool._id !== updatedTool.tool._id)
        );
        setBorrowedTools((prevTools) => [...prevTools, updatedTool.tool]);
      }
    } catch (error) {
      console.error("Error updating tool availability:", error);
    }
  };

  const handleDelete = async (toolId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `https://group-5-project-1.onrender.com/api/tools/${toolId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response.ok) {
        setSharedTools(sharedTools.filter((tool) => tool._id !== toolId));
      } else {
        throw new Error("Failed to delete tool");
      }
    } catch (error) {
      console.error("Error deleting tool:", error);
    }
  };

  const handleToolAdded = (newTool) => {
    setSharedTools((prevTools) => [...prevTools, newTool]);
  };

  const handleEditClick = (tool) => {
    setCurrentTool(tool);
    setShowEditModal(true);
  };

  const handleToolUpdated = (updatedTool) => {
    setSharedTools((prevTools) =>
      prevTools.map((tool) =>
        tool._id === updatedTool._id ? updatedTool : tool
      )
    );
  };

  return (
    <div className="container mx-auto px-4">
      {error && <p className="text-red-500 mb-4">{error}</p>}
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/3 px-4 my-3 mb-4 ">
          {userData ? (
            <div className="flex flex-col items-center">
              <UserProfile userData={userData} className="mb-3" />
              <button
                onClick={() => setShowModal(true)}
                className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mt-3 mb-4 focus:outline-none focus:shadow-outline shadow-md transform transition duration-200 hover:translate-y-0.5"
              >
                Add Item
              </button>
              <button
                onClick={() => setIsSettingsModalOpen(true)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 focus:outline-none focus:shadow-outline shadow-md transform transition duration-200 hover:translate-y-0.5"
              >
                Settings
              </button>
            </div>
          ) : (
            <div className="text-center">Loading user data...</div>
          )}
        </div>

        <div className="w-full md:w-2/3 px-4">
          {sharedTools.length === 0 && borrowedTools.length === 0 ? (
            <div className="text-center">
              <h1 className="text-2xl mb-4">
                Welcome to GearShare! You haven't shared any items yet.
              </h1>
              <p>
                You can borrow items from others when you're ready to lend out
                your own. Add an item to get started!
              </p>
            </div>
          ) : (
            <>
              <h1 className="text-2xl mb-4">Available for Sharing:</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sharedTools.map((tool) => (
                  <ToolsCard
                    key={tool._id}
                    tool={tool}
                    onDelete={() => handleDelete(tool._id)}
                    onEdit={() => handleEditClick(tool)}
                    onShare={() => handleShare(tool._id)}
                  />
                ))}
              </div>
              <h1 className="text-2xl my-4">Currently Lent:</h1>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {borrowedTools.map((tool) => (
                  <ToolsCard
                    key={tool._id}
                    tool={tool}
                    onShare={() => handleShare(tool._id)}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
      <AddItemModal
        show={showModal}
        onHide={() => setShowModal(false)}
        userId={userData?._id}
        onToolAdded={handleToolAdded}
      />
      <EditItemModal
        show={showEditModal}
        onHide={() => setShowEditModal(false)}
        tool={currentTool}
        onToolUpdated={handleToolUpdated}
      />
      <SettingsModal
        isOpen={isSettingsModalOpen}
        onClose={() => setIsSettingsModalOpen(false)}
      />
    </div>
  );
}

export default Profile;
