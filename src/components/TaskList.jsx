import React from "react";
import TaskCard from "./TaskCard";

const TaskList = () => {
  return (
    <div className="grid grid-cols-3 gap-4">
      <TaskCard />
      <TaskCard />
      <TaskCard />
    </div>
  );
};

export default TaskList;
