import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white p-5">
      <h2 className="text-2xl font-bold mb-6">Task Manager</h2>
      <ul>
        <li>
          <Link to="/" className="block py-2 hover:bg-gray-700 rounded">Dashboard</Link>
        </li>
        <li>
          <Link to="/tasks" className="block py-2 hover:bg-gray-700 rounded">Tasks</Link>
        </li>
        <li>
          <Link to="/projects" className="block py-2 hover:bg-gray-700 rounded">Projects</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
