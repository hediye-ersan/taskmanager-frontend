import React from "react";

export function TaskCard({ id, title, description, priority, createdAt, onDelete, onUpdate }) {
  const getColorForPriority = (priority) => {
    switch (priority.toUpperCase()) {
      case "HIGH":
        return "text-red-500";
      case "MEDIUM":
        return "text-blue-400";
      case "LOW":
        return "text-green-500";
      default:
        return "text-gray-400";
    }
  };

  return (
    <div className="p-4 bg-white rounded shadow relative">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <p className={`text-xs font-medium ${getColorForPriority(priority)}`}>
        Priority: {priority}
      </p>
      <p className="text-xs text-gray-400">
        Created At: {new Date(createdAt).toLocaleString()}
      </p>

      {/* Silme Butonu */}
      <button
        className="absolute top-2 right-2 text-red-500 hover:text-red-700"
        onClick={() => {
          if (window.confirm("Bu görevi silmek istediğinize emin misiniz?")) {
            onDelete(id); // Silme işlemini tetikler
          }
        }}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M6 8a1 1 0 011-1h6a1 1 0 011 1v8a1 1 0 01-1 1H7a1 1 0 01-1-1V8zm5-5a1 1 0 00-1 1v1H6a2 2 0 00-2 2v1h12V6a2 2 0 00-2-2h-4V4a1 1 0 00-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </button>

      {/* Güncelle Butonu */}
      <button
        className="absolute top-2 right-10 text-blue-500 hover:text-blue-700"
        onClick={() => onUpdate(id)} // Güncelleme işlemini tetikler
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828zM6 12v2h2l6.586-6.586-2-2L6 12z" />
          <path
            fillRule="evenodd"
            d="M4 16a2 2 0 012-2h8a2 2 0 012 2v2H4v-2z"
            clipRule="evenodd"
          />
        </svg>
      </button>
    </div>
  );
}
