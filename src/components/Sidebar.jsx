// src/components/Sidebar.jsx

import { LayoutDashboard, Table, BarChart, Settings, LogOut } from "lucide-react";
import { useHistory } from "react-router-dom";
import { useEffect, useState } from "react";

const Sidebar = ({ onLogout, onNavigate }) => {
  const history = useHistory();
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    if (storedUsername) {
      setUsername(storedUsername); // Kullanıcı adını state'e kaydet
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token"); // Token'ı sil
    localStorage.removeItem("username"); // Kullanıcı adını sil
    if (onLogout) {
      onLogout(); // App.js'deki isAuthenticated durumunu günceller
    }
    history.push("/auth"); // Kullanıcıyı giriş sayfasına yönlendir
  };

  return (
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
            onClick={() => onNavigate("Analytics")} // Analytics sayfasına yönlendir
          />
          <NavItem icon={<Settings size={25} />} text="Settings" />
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
