import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Pagination from "../components/Pagination";

const Available = () => {
  const [tools, setTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const toolsPerPage = 20;

  useEffect(() => {
    const fetchTools = async () => {
      try {
        setLoading(true);
        const response = await fetch(
          "https://group-5-project-1.onrender.com/api/tools"
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        setTools(json);
      } catch (error) {
        console.error("Error fetching tools:", error);
        setError("Failed to load tools. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    fetchTools();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading tools...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div>;
  }

  const indexOfLastTool = currentPage * toolsPerPage;
  const indexOfFirstTool = indexOfLastTool - toolsPerPage;
  const currentTools = tools.slice(indexOfFirstTool, indexOfLastTool);
  const totalPages = Math.ceil(tools.length / toolsPerPage);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Available Tools</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {currentTools
          .filter((tool) => tool.available)
          .map((tool) => (
            <Link
              key={tool._id}
              to={`/description/${tool._id}`}
              className="bg-white rounded-lg shadow-md overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl no-underline"
            >
              <div className="h-48 bg-gray-200 flex items-center justify-center">
                {tool.name && (
                  <img
                    src={`https://group-5-project-1.onrender.com/public/${tool.imageUrl}`}
                    alt={tool.name}
                    className="max-h-full max-w-full object-cover"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 text-center">
                  {tool.name || "Unnamed Tool"}
                </h3>
              </div>
            </Link>
          ))}
      </div>
      <div className="mt-8 flex justify-center">
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      </div>
    </div>
  );
};

export default Available;
