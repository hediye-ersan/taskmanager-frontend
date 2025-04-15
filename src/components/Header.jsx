// src/components/Header.jsx

import React, { useEffect, useState } from "react";
import { Bell, HelpCircle, Search } from "lucide-react";
import Avatar from "react-avatar";

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
          <Avatar
            name={username || "User"} // Kullanıcı adı yoksa "User" göster
            src={profileImage} // Profil fotoğrafı URL'si varsa göster
            size="40" // Avatar boyutu
            round={true} // Yuvarlak avatar
          />
        </div>
      </div>
    </header>
  );
};

export default Header;
