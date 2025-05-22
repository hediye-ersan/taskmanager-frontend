import React, { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Bell, HelpCircle, Search } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

const Header = ({ onSearch }) => {
  const [username, setUsername] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });
  const bellButtonRef = React.useRef(null);

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedProfileImage = localStorage.getItem("profileImage");

    if (storedUsername) setUsername(storedUsername);
    if (storedProfileImage) setProfileImage(storedProfileImage);

    calculateNotifications();
  }, []);

  useEffect(() => {
    calculateNotifications();
  }, [localStorage.getItem("tasks")]);

  useEffect(() => {
    const interval = setInterval(() => {
      calculateNotifications();
    }, 2000); // Her 2 saniyede bir kontrol et

    return () => clearInterval(interval);
  }, []);

  const READ_NOTIFICATIONS_KEY = "readNotifications";

  const getReadNotifications = () => {
    return JSON.parse(localStorage.getItem(READ_NOTIFICATIONS_KEY)) || [];
  };

  const addReadNotification = (notification) => {
    const read = getReadNotifications();
    // Benzersiz anahtar olarak dueDate ve title kullanıyoruz
    read.push({ dueDate: notification.dueDate, title: notification.title });
    localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify(read));
  };

  const clearReadNotifications = () => {
    localStorage.setItem(READ_NOTIFICATIONS_KEY, JSON.stringify([]));
  };

  const calculateNotifications = () => {
    const now = new Date();
    const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const read = getReadNotifications();

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
            type: "upcoming",
          };
        }

        if (diffInDays < 0) {
          return {
            title: task.title,
            dueDate: task.dueDate,
            message: `Görev "${task.title}" teslim tarihi geçti!`,
            type: "overdue",
          };
        }

        return null;
      })
      .filter(Boolean)
      // Okunan bildirimleri hariç tut
      .filter(
        (notif) =>
          !read.some(
            (r) => r.dueDate === notif.dueDate && r.title === notif.title
          )
      );

    setNotifications(newNotifications);
    setUnreadCount(newNotifications.length);
  };

  const getInitials = (name) =>
    name ? name.split(" ").map((n) => n[0]).join("").toUpperCase() : "U";

  const handleMarkAsRead = (index) => {
    const notification = notifications[index];
    addReadNotification(notification);
    const updatedNotifications = [...notifications];
    updatedNotifications.splice(index, 1);
    setNotifications(updatedNotifications);
    setUnreadCount(updatedNotifications.length);
  };

  const markAllAsRead = () => {
    notifications.forEach(addReadNotification);
    setNotifications([]);
    setUnreadCount(0);
  };

  const handleBellClick = () => {
    setIsNotificationDropdownOpen((prev) => !prev);
    if (bellButtonRef.current) {
      const rect = bellButtonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.right - 320 + window.scrollX,
        width: 320,
      });
    }
  };

  return (
    <header className="bg-gray-50 shadow-sm py-3 drop-shadow-sm dark:bg-gray-800 dark:text-white">
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
              ref={bellButtonRef}
              onClick={handleBellClick}
            >
              <Bell className="w-5 h-5 text-gray-700 dark:text-white" />
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-3 h-3 flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
            {isNotificationDropdownOpen &&
              createPortal(
                <div
                  className="absolute bg-white dark:bg-gray-700 shadow-lg rounded-lg overflow-y-auto max-h-96 z-50 notification-dropdown"
                  style={{
                    zIndex: 9999,
                    position: "absolute",
                    top: dropdownPosition.top,
                    left: dropdownPosition.left,
                    width: dropdownPosition.width,
                  }}
                >
                  <div className="p-4 border-b flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">Bildirimler</h2>
                    <button
                      className="text-blue-500 hover:underline text-sm"
                      onClick={markAllAsRead}
                    >
                      Tümünü Okundu Olarak İşaretle
                    </button>
                  </div>
                  <div className="p-4">
                    {notifications.length > 0 ? (
                      <ul className="space-y-4">
                        {notifications.map((notification, index) => (
                          <li
                            key={index}
                            className={`p-4 rounded-lg shadow flex flex-col ${
                              notification.type === "overdue"
                                ? "bg-red-200 "
                                : "bg-yellow-200 "
                            }`}
                          >
                            <p className="text-sm font-medium text-gray-800">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 mt-2">
                              Tahmini Bitiş Tarihi:{" "}
                              {formatDistanceToNow(new Date(notification.dueDate), {
                                addSuffix: true,
                              })}
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
                </div>,
                document.body
              )}
          </div>

          <HelpCircle className="w-5 h-5 text-gray-700 dark:text-white cursor-pointer" />
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
