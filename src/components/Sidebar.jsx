// src/components/Sidebar.jsx

import { LayoutGrid, Table, BarChart, Settings, LogOut } from "lucide-react";

const Sidebar = () => {
  return (
    <aside className="w-60 h-screen bg-white border-r flex flex-col py-6 px-4">
      <div className="flex-1 overflow-y-auto">
        <h1 className="text-xl font-bold mb-8 px-2">Pro Manage</h1>
        <nav className="flex flex-col gap-3">
          <NavItem icon={<LayoutGrid size={20} />} text="Dashboard" />
          <NavItem icon={<Table size={20} />} text="Board" active />
          <NavItem icon={<BarChart size={20} />} text="Analytics" />
          <NavItem icon={<Settings size={20} />} text="Settings" />
        </nav>
      </div>

      <div className="mt-auto">
        <NavItem icon={<LogOut size={20} />} text="Log out" />
      </div>
    </aside>
  );
};

const NavItem = ({ icon, text, active }) => (
  <div
    className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer transition-colors
    ${active ? "bg-blue-50 text-black font-medium" : "text-gray-600 hover:bg-gray-100"}`}
  >
    {icon}
    <span>{text}</span>
  </div>
);

export default Sidebar;
