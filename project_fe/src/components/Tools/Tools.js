import React, { useState, useEffect } from "react";

function ToolsCard({ tool, onDelete, onEdit, onShare }) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [timer, setTimer] = useState(null);

  const handleDeleteClick = () => {
    if (confirmDelete) {
      onDelete();
    } else {
      setConfirmDelete(true);
      const newTimer = setTimeout(() => {
        setConfirmDelete(false);
      }, 3000);
      setTimer(newTimer);
    }
  };

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
      }
    };
  }, [timer]);

  const token = localStorage.getItem("token");
  if (!token) {
    window.location.href = "/";
  }

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="h-48 flex items-center justify-center">
        <img
          src={`https://group-5-project-2.onrender.com/public/${tool.imageUrl}`}
          alt={tool.name}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <div className="p-4">
        <h2 className="text-xl font-semibold mb-2">{tool.name}</h2>
        <p className="text-gray-600 mb-2">{tool.description}</p>
        <p className="text-gray-600 mb-4">{tool.details}</p>
        <div className="flex flex-wrap gap-2">
          {onEdit && (
            <button
              onClick={onEdit}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex-grow focus:outline-none focus:shadow-outline shadow-md transform transition duration-200 hover:translate-y-0.5"
            >
              Edit
            </button>
          )}
          {onDelete && (
            <button
              onClick={handleDeleteClick}
              className={`${
                confirmDelete ? "bg-red-600" : "bg-red-500"
              } hover:bg-red-700 text-white font-bold py-2 px-4 rounded flex-grow focus:outline-none focus:shadow-outline shadow-md transform transition duration-200 hover:translate-y-0.5`}
            >
              {confirmDelete ? "I'm sure!" : "Delete"}
            </button>
          )}
          <button
            onClick={() => onShare(tool._id)}
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex-grow focus:outline-none focus:shadow-outline shadow-md transform transition duration-200 hover:translate-y-0.5"
          >
            {tool.available ? "Mark as Lent" : "Mark as Returned"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ToolsCard;
