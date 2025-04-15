// src/components/Header.jsx

import React from 'react';
import { Bell, HelpCircle, Search } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-white shadow-sm py-3">
      <div className="width-auto px-6 mx-auto  flex items-center justify-between">
        {/* Arama alanı */}
        <div className="flex items-center px-3 py-2 border rounded-full bg-gray-100 text-gray-500 flex-grow max-w-lg mr-4">
          <Search className="w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="Search"
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>

        {/* Sağdaki ikonlar */}
        <div className="flex items-center space-x-6">
          <Bell className="w-5 h-5 text-gray-700 cursor-pointer" />
          <HelpCircle className="w-5 h-5 text-gray-700 cursor-pointer" />
          <img
            src="https://randomuser.me/api/portraits/women/75.jpg"
            alt="profile"
            className="w-8 h-8 rounded-full object-cover"
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
