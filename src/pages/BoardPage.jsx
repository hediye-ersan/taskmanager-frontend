"use client";

import { useEffect, useState } from "react";
import BoardColumn from "../components/BoardColumn";
import { TaskCard } from "../components/TaskCard";

export default function BoardPage() {
  const [columns, setColumns] = useState([
    { id: "todo", title: "To Do", tasks: [] },
    { id: "in-progress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ]);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "LOW" });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:8080/api/tasks/tasks", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error("Görevler alınamadı");

        const data = await res.json();

        // Görevleri boardColumnName'e göre grupla
        const grouped = {
          "To Do": [],
          "In Progress": [],
          "Done": [],
        };

        data.forEach((task) => {
          const boardColumnName = task.boardColumnName; // backend'den gelen kolon adı
          if (grouped[boardColumnName]) {
            grouped[boardColumnName].push(task);
          }
        });

        // Kolonları ve görevleri state'e set et
        setColumns([
          { id: "todo", title: "To Do", tasks: grouped["To Do"] || [] },
          { id: "in-progress", title: "In Progress", tasks: grouped["In Progress"] || [] },
          { id: "done", title: "Done", tasks: grouped["Done"] || [] },
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  const handleAddTask = (columnId) => {
    setCurrentColumn(columnId);
    setIsModalOpen(true);
  };

  const handleSaveTask = async () => {
    if (!newTask.title) return alert("Görev başlığı gerekli!");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...newTask,
          boardColumnName: columns.find((col) => col.id === currentColumn).title,
        }),
      });

      if (!res.ok) throw new Error("Görev eklenemedi");

      const createdTask = await res.json();

      // Yeni görevi ilgili kolona ekle
      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.id === currentColumn
            ? { ...col, tasks: [...col.tasks, createdTask] }
            : col
        )
      );

      setIsModalOpen(false);
      setNewTask({ title: "", description: "", priority: "LOW" });
    } catch (err) {
      console.error(err);
      alert("Görev eklenirken bir hata oluştu.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Board</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {columns.map((column) => (
          <BoardColumn
            key={column.id}
            title={column.title}
            onAddTask={() => handleAddTask(column.id)}
          >
            {column.tasks.map((task, index) => (
              <TaskCard
                key={task.id || index}
                id={task.id}
                title={task.title}
                description={task.description}
                priority={task.priority}
                createdAt={task.createdAt}
              />
            ))}
          </BoardColumn>
        ))}
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Yeni Görev Ekle</h2>
            <input
              type="text"
              placeholder="Görev Başlığı"
              className="w-full p-2 border rounded mb-4"
              value={newTask.title}
              onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
            />
            <textarea
              placeholder="Görev Açıklaması"
              className="w-full p-2 border rounded mb-4"
              value={newTask.description}
              onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
            />
            <select
              className="w-full p-2 border rounded mb-4"
              value={newTask.priority}
              onChange={(e) => setNewTask({ ...newTask, priority: e.target.value })}
            >
              <option value="LOW">Düşük</option>
              <option value="MEDIUM">Orta</option>
              <option value="HIGH">Yüksek</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setIsModalOpen(false)}
              >
                İptal
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleSaveTask}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
