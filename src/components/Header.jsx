import React, { useEffect, useState } from "react";
import { Bell, HelpCircle, Search } from "lucide-react";

const Header = ({ onSearch }) => {
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedProfileImage = localStorage.getItem("profileImage");

    if (storedUsername) setUsername(storedUsername);
    if (storedProfileImage) setProfileImage(storedProfileImage);

    calculateNotifications();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      calculateNotifications();
    }, 10000); // 10 saniyede bir kontrol etmek istersen

    return () => clearInterval(interval);
  }, []);

  const calculateNotifications = () => {
    const now = new Date();
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];

    const newNotifications = savedTasks
      .filter((task) => task.dueDate)
      .map((task) => {
        const dueDate = new Date(task.dueDate);
        const diffInDays = Math.ceil((dueDate - now) / (1000 * 60 * 60 * 24));

        if ([7, 2, 1].includes(diffInDays)) {
          return {
            title: task.title,
            dueDate: task.dueDate,
            message: `Görev "${task.title}" ${diffInDays} gün içinde tamamlanmalı.`,
          };
        }

        if (diffInDays < 0) {
          return {
            title: task.title,
            dueDate: task.dueDate,
            message: `Görev "${task.title}" teslim tarihi geçti!`,
          };
        }

        return null;
      })
      .filter(Boolean);

    setNotifications(newNotifications);
    setUnreadCount(newNotifications.length);
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "U";

  const handleMarkAsRead = (index) => {
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.length);
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
            <button
              className="relative"
              onClick={() => setIsNotificationDropdownOpen(!isNotificationDropdownOpen)}
            >
              <Bell className="w-5 h-5 text-gray-700" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {isNotificationDropdownOpen && (
              <div className="absolute right-0 mt-2 w-80 bg-white shadow-lg rounded-lg overflow-y-auto max-h-96 z-50">
                <div className="p-4 border-b">
                  <h2 className="text-lg font-bold text-gray-800">Bildirimler</h2>
                </div>
                <div className="p-4">
                  {notifications.length > 0 ? (
                    <ul className="space-y-4">
                      {notifications.map((notification, index) => (
                        <li
                          key={index}
                          className="p-4 bg-gray-100 rounded-lg shadow flex flex-col"
                        >
                          <p className="text-sm font-medium text-gray-800">
                            {notification.message}
                          </p>
                          <p className="text-xs text-gray-500 mt-2">
                            Tahmini Bitiş Tarihi: {notification.dueDate}
                          </p>
                          <div className="mt-2 flex justify-end">
                            <button
                              type="button"
                              className="text-blue-500 hover:underline text-sm"
                              onClick={() => handleMarkAsRead(index)}
                            >
                              Okundu Olarak İşaretle
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-gray-500">Hiç bildirim yok.</p>
                  )}
                </div>
              </div>
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
    </header>
  );
};

export default Header;
