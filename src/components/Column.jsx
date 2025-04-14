import React from "react";
import TaskCard from "./TaskCard";

const Column = ({ column }) => {
  return (
    <div className="bg-gray-100 rounded-lg p-4 w-full max-w-sm min-h-[80vh]">
      <h2 className="text-xl font-semibold mb-4">{column.name}</h2>
      {column.tasks?.map((task) => (
        <TaskCard key={task.id} task={task} />
      ))}
    </div>
  );
};

export default Column;
