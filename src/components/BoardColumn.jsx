// components/BoardColumn.jsx
import React from "react";

export default function BoardColumn({ title, children, onAddTask }) {
  return (
    <div className="flex flex-col bg-gray-50 rounded-lg">
      {/* Sütun Başlığı */}
      <div className="p-4 flex items-center justify-between">
        <h2 className="font-medium">{title}</h2>
        <div className="flex items-center gap-1">
          {/* + Butonu */}
          <button
            className="p-1 rounded hover:bg-gray-200"
            onClick={onAddTask} // Görev ekleme işlemini tetikler
          >
            <svg
              className="h-5 w-5 text-gray-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Kaydırılabilir Görev Alanı */}
      <div className="flex-1 p-2 space-y-3 overflow-y-auto max-h-[400px]">
        {children}
      </div>
    </div>
  );
}
