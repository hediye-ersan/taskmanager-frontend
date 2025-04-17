// src/components/Header.jsx

import React, { useEffect, useState } from "react";
import { Bell, HelpCircle, Search } from "lucide-react";

const Header = () => {
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedProfileImage = localStorage.getItem("profileImage");
    if (storedUsername) {
      setUsername(storedUsername); // Kullanıcı adını state'e kaydet
    }
    if (storedProfileImage) {
      setProfileImage(storedProfileImage); // Profil fotoğrafını state'e kaydet
    }
  }, []);

  const getInitials = (name) => {
    if (!name) return "U"; // Kullanıcı adı yoksa "U" (User) göster
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-white shadow-sm py-3">
      <div className="width-full px-6 mx-auto flex items-center justify-between">
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
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-white font-bold">
              {getInitials(username)}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
