import React from "react";

export function TaskCard({ id, title, description, priority, createdAt }) {
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
    <div className="p-4 bg-white rounded shadow">
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
      <p className={`text-xs font-medium ${getColorForPriority(priority)}`}>
        Priority: {priority}
      </p>
      <p className="text-xs text-gray-400">
        Created At: {new Date(createdAt).toLocaleString()}
      </p>
    </div>
  );
}
