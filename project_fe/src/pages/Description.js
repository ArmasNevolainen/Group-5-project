import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

function Description() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tool, setTool] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasSharedTools, setHasSharedTools] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      const userId = localStorage.getItem("userId");
      setLoading(true);

      try {
        const userResponse = await fetch(
          `https://group-5-project-1.onrender.com/api/users/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (!userResponse.ok) {
          throw new Error("Failed to fetch user data");
        }
        const userData = await userResponse.json();
        const userHasSharedTools =
          userData.sharedTools && userData.sharedTools.length > 0;
        setHasSharedTools(userHasSharedTools);

        if (!userHasSharedTools) {
          navigate("/profile");
          return;
        }

        const toolResponse = await fetch(
          `https://group-5-project-1.onrender.com/api/tools/${id}?includeOwner=true`
        );
        if (!toolResponse.ok) {
          throw new Error("Tool not found");
        }
        const toolData = await toolResponse.json();
        setTool(toolData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate]);

  const handleBackClick = () => {
    navigate(-1);
  };

  if (!hasSharedTools) {
    return null;
  }

  if (loading) {
    return <div className="text-center py-8">Loading...</div>;
  }

  if (!tool) {
    return <div className="text-center py-8">Tool not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{tool.name}</h1>
      <div className="flex flex-wrap -mx-4">
        <div className="w-full md:w-1/2 px-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Tool Information</h2>
            <img
              src={`https://group-5-project-1.onrender.com/public/${tool.imageUrl}`}
              alt={tool.name}
              className="w-full h-auto object-cover mb-4 rounded-lg"
            />
            <p className="mb-4">
              <strong>Description:</strong> {tool.description}
            </p>
            <p>
              <strong>Details:</strong> {tool.details}
            </p>
          </div>
        </div>
        <div className="w-full md:w-1/2 px-4 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-semibold mb-4">Owner Information</h2>
            {tool.owner && (
              <div>
                <p className="mb-2">
                  <strong>Name:</strong> {tool.owner.firstName}{" "}
                  {tool.owner.lastName.charAt(0)}.
                </p>
                <p>
                  <strong>Phone:</strong> {tool.owner.phone}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <div className="text-center">
        <button
          onClick={handleBackClick}
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mt-3 focus:outline-none focus:shadow-outline shadow-md transform transition duration-200 hover:translate-y-0.5"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default Description;
