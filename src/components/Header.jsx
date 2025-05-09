// src/components/Header.jsx

import React, { useEffect, useState } from "react";
import { Bell, HelpCircle, Search } from "lucide-react";

const Header = ({ onSearch, columns }) => {
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationModalOpen, setIsNotificationModalOpen] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedProfileImage = localStorage.getItem("profileImage");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedProfileImage) {
      setProfileImage(storedProfileImage);
    }

    calculateNotifications();
  }, []);



  const calculateNotifications = () => {
    const now = new Date();
    const upcomingNotifications = [];

    // localStorage'daki görevleri al
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    console.log("Saved Tasks:", savedTasks); // Test için ekledik

    savedTasks.forEach((task) => {
      if (task.dueDate) {
        const dueDate = new Date(task.dueDate);
        const diffInDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

        console.log(`Task: ${task.title}, DueDate: ${task.dueDate}, DiffInDays: ${diffInDays}`); // Test için ekledik

        if ([7, 2, 1].includes(diffInDays)) {
          upcomingNotifications.push({
            title: task.title,
            dueDate: task.dueDate,
            message: `Görev "${task.title}" ${diffInDays} gün içinde tamamlanmalı.`,
          });
        }

        if (diffInDays < 0) {
          upcomingNotifications.push({
            title: task.title,
            dueDate: task.dueDate,
            message: `Görev "${task.title}" teslim tarihi geçti!`,
          });
        }
      }
    });

    console.log("Upcoming Notifications:", upcomingNotifications); // Test için ekledik
    setNotifications(upcomingNotifications);
    setUnreadCount(upcomingNotifications.length);
  };

  const getInitials = (name) => {
    if (!name) return "U";
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <header className="bg-gray-50 shadow-sm py-3 drop-shadow-sm">
      <div className="width-full px-4 mx-auto flex items-center justify-between">
        <div className="flex items-center px-3 py-2 border rounded-full bg-white text-gray-500 flex-grow max-w-lg mr-4">
          <Search className="w-4 h-4 mr-2" />
          <input
            type="text"
            placeholder="Görevlerde ara..."
            className="w-full bg-transparent outline-none text-sm"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center space-x-6">
          <div className="relative">
            <Bell
              className="w-5 h-5 text-gray-700 cursor-pointer"
              onClick={() => setIsNotificationModalOpen(true)}
            />
            {unreadCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </div>
          <HelpCircle className="w-5 h-5 text-gray-700 cursor-pointer" />
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center text-white font-bold">
              {getInitials(username)}
            </div>
          )}
        </div>
      </div>

      {isNotificationModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[90vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Bildirimler</h2>
            {notifications.length > 0 ? (
              <ul className="space-y-4">
                {notifications.map((notification, index) => (
                  <li key={index} className="p-4 bg-gray-100 rounded shadow">
                    <p className="text-sm font-medium">{notification.message}</p>
                    <p className="text-xs text-gray-500">
                      Tahmini Bitiş Tarihi: {notification.dueDate}
                    </p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Hiç bildirim yok.</p>
            )}
            <button
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded w-full"
              onClick={() => {
                setIsNotificationModalOpen(false);
                setUnreadCount(0);
              }}
            >
              Kapat
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
