import React from "react";

export function TaskCard({ id, title, description, priority, createdAt, onDelete, onUpdate, onClick,highlight }) {
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
            <img
              src="../public/images/pencil.svg"
              alt="Edit"
              className="h-5 w-5"
            />
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
            <img
              src="../public/images/trash.svg"
              alt="Delete"
              className="h-5 w-5"
            />
          </button>
        </div>
      </div>

      {/* Oluşturulma Tarihi */}
      <p className="text-xs text-gray-400 mt-2">
        Created At: {new Date(createdAt).toLocaleString()}
      </p>
    </div>
  );
}
