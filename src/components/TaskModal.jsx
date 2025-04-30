import React from "react";

const TaskModal = ({ isOpen, task, onClose, onSave,dueDate, onChange }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded shadow-lg w-96">
        <h2 className="text-xl font-bold mb-4">
          {task.id ? "Görevi Güncelle" : "Yeni Görev Ekle"}
        </h2>
        <input
          type="text"
          placeholder="Görev Başlığı"
          className="w-full p-2 border rounded mb-4"
          value={task.title}
          onChange={(e) => onChange({ ...task, title: e.target.value })}
        />
        <textarea
          placeholder="Görev Açıklaması"
          className="w-full p-2 border rounded mb-4"
          value={task.description}
          onChange={(e) => onChange({ ...task, description: e.target.value })}
        />
        <select
          className="w-full p-2 border rounded mb-4"
          value={task.priority}
          onChange={(e) => onChange({ ...task, priority: e.target.value })}
        >
          <option value="LOW">Düşük</option>
          <option value="MEDIUM">Orta</option>
          <option value="HIGH">Yüksek</option>
        </select>

        <input
          type="date"
          className="w-full p-2 border rounded mb-4"
          value={task.dueDate || ""}
          onChange={(e) => onChange({ ...task, dueDate: e.target.value })}
        />

        <div className="flex justify-end gap-2">
          <button
            className="px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            İptal
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={onSave}
          >
            Kaydet
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskModal;