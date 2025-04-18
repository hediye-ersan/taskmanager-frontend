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
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

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

  const handleSaveUpdatedTask = () => {
    if (!currentTask.title) return alert("Görev başlığı gerekli!");

    const updatedTaskData = {
      title: currentTask.title,
      description: currentTask.description,
      priority: currentTask.priority,
      boardColumnName: currentTask.boardColumnName, // Eğer kolon bilgisi de güncelleniyorsa
    };

    handleUpdateTask(currentTask.id, updatedTaskData);
  };

  const handleUpdateTask = async (taskId, updatedTaskData) => {
    console.log("Gönderilen taskId:", taskId);
    console.log("Gönderilen updatedTaskData:", updatedTaskData);

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedTaskData),
      });

      if (!res.ok) throw new Error("Görev güncellenemedi");

      const updatedTask = await res.json();

      setColumns((prevColumns) =>
        prevColumns.map((col) => ({
          ...col,
          tasks: col.tasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          ),
        }))
      );

      setIsUpdateModalOpen(false);
      setCurrentTask(null);
    } catch (err) {
      console.error(err);
      alert("Görev güncellenirken bir hata oluştu.");
    }
  };

  // Yeni görev ekleme
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

  // Görev silme
  const handleDeleteTask = async (taskId, columnId) => {
    // Uyarı mesajını yalnızca bir kez göster
    if (!window.confirm("Bu görevi silmek istediğinize emin misiniz?")) return;

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`http://localhost:8080/api/tasks/${taskId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) throw new Error("Görev silinemedi");

      // Görevi frontend'den kaldır
      setColumns((prevColumns) =>
        prevColumns.map((col) =>
          col.id === columnId
            ? { ...col, tasks: col.tasks.filter((task) => task.id !== taskId) }
            : col
        )
      );
    } catch (err) {
      console.error(err);
      alert("Görev silinirken bir hata oluştu.");
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Board ✨</h1>
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
                onDelete={() => handleDeleteTask(task.id, column.id)}
                onUpdate={() => {
                  setCurrentTask(task);
                  setIsUpdateModalOpen(true);
                }}
              // Güncelleme butonunu tetikler
              />
            ))}
          </BoardColumn>
        ))}
      </div>

      {/* Güncelleme Modalı */}
      {isUpdateModalOpen && currentTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Görevi Güncelle</h2>
            <input
              type="text"
              placeholder="Görev Başlığı"
              className="w-full p-2 border rounded mb-4"
              value={currentTask.title}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, title: e.target.value })
              }
            />
            <textarea
              placeholder="Görev Açıklaması"
              className="w-full p-2 border rounded mb-4"
              value={currentTask.description}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, description: e.target.value })
              }
            />
            <select
              className="w-full p-2 border rounded mb-4"
              value={currentTask.priority}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, priority: e.target.value })
              }
            >
              <option value="LOW">Düşük</option>
              <option value="MEDIUM">Orta</option>
              <option value="HIGH">Yüksek</option>
            </select>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 bg-gray-300 rounded"
                onClick={() => setIsUpdateModalOpen(false)}
              >
                İptal
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleSaveUpdatedTask}
              >
                Kaydet
              </button>
            </div>
          </div>
        </div>
      )}

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
