import React from "react";

const TaskCard = ({ task }) => {
  return (
    <div className="bg-white p-4 rounded-md shadow-md hover:shadow-xl mb-4">
      <h3 className="text-lg font-semibold">{task.title}</h3>
      <p className="text-gray-600">{task.description}</p>
      <div className="mt-2 flex justify-between items-center">
        <span className="text-sm text-green-500">Priority: {task.priority}</span>
        <span className="text-sm text-gray-500">Due: {task.dueDate?.split("T")[0]}</span>
      </div>
    </div>
  );
};

export default TaskCard;
