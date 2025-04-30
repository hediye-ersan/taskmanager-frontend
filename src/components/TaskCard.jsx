import React from "react";
import { PencilRuler, Trash2 } from 'lucide-react';

export function TaskCard({ id, title, description, priority, createdAt, onDelete,dueDate, onUpdate, onClick, highlight }) {
  const getColorForPriority = (priority) => {
    switch (priority.toUpperCase()) {
      case "HIGH":
        return "bg-red-500 text-white";
      case "MEDIUM":
        return "bg-yellow-500 text-white";
      case "LOW":
        return "bg-green-500 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  const calculateRemainingTime = (dueDate) => {
    if (!dueDate) return "No deadline";
  
    // Tarih formatını manuel olarak parçala
    const [year, month, day] = dueDate.split("-").map(Number); // YYYY-MM-DD formatını parçala
    const deadline = new Date(year, month - 1, day); // Aylar 0 tabanlı olduğu için -1 yapıyoruz
  
    const now = new Date();
  
    if (isNaN(deadline)) return "Invalid date"; // Tarih formatı hatası kontrolü
  
    const diff = deadline - now;
  
    if (diff <= 0) return "Deadline passed";
  
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    return `${days} day(s) remaining`;
  };
  
  const highlightText = (text, query) => {
    if (!query) return text;

    const parts = text.split(new RegExp(`(${query})`, "gi"));
    return parts.map((part, index) =>
      part.toLowerCase() === query.toLowerCase() ? (
        <span key={index} className="bg-yellow-200">{part}</span>
      ) : (
        part
      )
    );
  };

  return (
    <div
      className="p-4 bg-white rounded-xl shadow relative flex flex-col gap-2 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer"
      onClick={onClick} // Tıklama olayını ekledik
    >
      {/* Başlık ve Açıklama */}
      <div className="flex flex-col font-caveat gap-1">
        <h3 className="text-lg font-bold text-gray-800">{highlightText(title, highlight)}</h3>
        <p className="text-sm text-gray-600">{highlightText(description, highlight)}</p>
      </div>

      {/* Öncelik ve İkonlar */}
      <div className="flex items-center justify-between mt-2">
        <p
          className={`text-xs font-medium px-3 py-2 rounded-full ${getColorForPriority(priority)}`}
        >
          {priority}
        </p>
        <div className="flex items-center gap-2">
          {/* Güncelle Butonu */}
          <button
            className="hover:bg-gray-200 rounded-full p-1"
            onClick={(e) => {
              e.stopPropagation(); // Tıklama olayını durdur
              onUpdate(id);
            }}
          >
            <PencilRuler
              alt="Delete"
              className="h-5 w-5" />
          </button>

          {/* Silme Butonu */}
          <button
            className="hover:bg-gray-200 rounded-full p-1"
            onClick={(e) => {
              e.stopPropagation(); // Tıklama olayını durdur
              if (window.confirm("Bu görevi silmek istediğinize emin misiniz?")) {
                onDelete(id);
              }
            }}
          >
            <Trash2
              alt="Delete"
              className="h-5 w-5" />

          </button>
        </div>
      </div>

      {/* Oluşturulma Tarihi */}
      <p className="text-xs text-gray-400 mt-2">
        Created At: {new Date(createdAt).toLocaleString()}
      </p>
      <p className="text-xs text-gray-500">
        {calculateRemainingTime(dueDate)}
      </p>
    </div>
  );
}
