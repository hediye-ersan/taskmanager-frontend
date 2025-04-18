import React from "react";

export function TaskCard({ id, title, description, priority, createdAt, onDelete, onUpdate, onClick }) {
  const getColorForPriority = (priority) => {
    switch (priority.toUpperCase()) {
      case "HIGH":
        return "bg-rose-500 text-white";
      case "MEDIUM":
        return "bg-sky-300 text-white";
      case "LOW":
        return "bg-lime-400 text-white";
      default:
        return "bg-gray-400 text-white";
    }
  };

  return (
    <div
      className="p-4 bg-white rounded-xl shadow relative flex flex-col gap-2 transition-transform transform hover:scale-105 hover:shadow-lg cursor-pointer"
      onClick={onClick} // Tıklama olayını ekledik
    >
      {/* Başlık ve Açıklama */}
      <div className="flex flex-col font-caveat gap-1">
        <h3 className="text-lg font-bold text-gray-800">{title}</h3>
        <p className="text-sm text-gray-600">{description}</p>
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
