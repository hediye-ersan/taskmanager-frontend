import React from "react";

const TaskCard = () => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md hover:shadow-xl">
      <h3 className="text-lg font-semibold">Task Title</h3>
      <p className="text-gray-600">Task description goes here...</p>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-green-500">Priority: High</span>
        <span className="text-sm text-gray-500">Due: 2025-04-20</span>
      </div>
    </div>
  );
};

export default TaskCard;
