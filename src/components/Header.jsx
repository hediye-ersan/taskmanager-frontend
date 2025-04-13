import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center p-5 bg-gray-200">
      <h1 className="text-3xl font-semibold">Dashboard</h1>
      <div className="flex items-center">
        <button className="bg-blue-500 text-white py-2 px-4 rounded-md">Add Task</button>
      </div>
    </div>
  );
};

export default Header;
