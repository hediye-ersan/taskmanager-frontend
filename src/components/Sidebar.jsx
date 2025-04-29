// src/components/Sidebar.jsx

import React, { useState, useEffect } from "react";
import { LayoutDashboard, Table, BarChart, Settings, LogOut } from "lucide-react";
import { useHistory } from "react-router-dom";

const Sidebar = ({ onLogout, onNavigate }) => {
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false); // Modal state

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedDarkMode = localStorage.getItem("darkMode") === "true";
    if (storedUsername) {
      setUsername(storedUsername);
    }
    setIsDarkMode(storedDarkMode);
    if (storedDarkMode) {
      document.documentElement.classList.add("dark");
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    if (onLogout) {
      onLogout();
    }
    history.push("/auth");
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <aside className="w-60 h-screen bg-gray-50 border-r flex flex-col py-6 px-4 font-caveat drop-shadow-lg min-h-screen">
        <div className="flex-1 overflow-y-auto">
          <h1 className="text-3xl font-bold mb-8 px-2">
            {username
              ? `${username.charAt(0).toUpperCase()}${username.slice(1).toLowerCase()}'s Manager 🚀`
              : "My Manager"}
          </h1>
          <nav className="flex flex-col gap-3">
            <NavItem
              icon={<LayoutDashboard size={25} />}
              text="Dashboard"
              onClick={() => onNavigate("Dashboard")}
            />
            <NavItem
              icon={<Table size={25} />}
              text="Board"
              onClick={() => onNavigate("Board")}
            />
            <NavItem
              icon={<BarChart size={25} />}
              text="Analytics"
              onClick={() => onNavigate("Analytics")}
            />
            <NavItem
              icon={<Settings size={25} />}
              text="Settings"
              onClick={openModal} // Modal aç
            />
          </nav>
        </div>

        <div className="mt-auto">
          <NavItem
            icon={<LogOut size={25} />}
            text="Log out"
            onClick={handleLogout}
          />
        </div>
      </aside>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4 dark:text-white">Settings</h2>
            <div className="flex items-center justify-between mb-4">
              <span className="text-gray-700 dark:text-gray-300">Dark Mode</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={isDarkMode}
                  onChange={toggleDarkMode}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-blue-300 dark:bg-gray-700 peer-checked:bg-blue-600 rounded-full peer peer-checked:after:translate-x-5 peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600"></div>
              </label>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

const NavItem = ({ icon, text, active, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors
    ${active ? "bg-blue-50 text-black font-medium" : "text-gray-600 hover:bg-gray-100"}`}
  >
    {icon}
    <span>{text}</span>
  </div>
);

export default Sidebar;
