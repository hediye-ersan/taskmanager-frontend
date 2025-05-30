"use client";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useEffect, useState } from "react";
import BoardColumn from "../components/BoardColumn";
import { TaskCard } from "../components/TaskCard";
import TaskModal from "../components/TaskModal";

export default function BoardPage({ searchQuery }) {
  const [columns, setColumns] = useState([
    { id: "todo", title: "To Do", tasks: [] },
    { id: "in-progress", title: "In Progress", tasks: [] },
    { id: "done", title: "Done", tasks: [] },
  ]);
  const [filter, setFilter] = useState("all"); // Filtreleme seçeneği
  const [selectedTask, setSelectedTask] = useState(null); // Tıklanan görevi tutar
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentColumn, setCurrentColumn] = useState(null);
  const [newTask, setNewTask] = useState({ title: "", description: "", priority: "LOW", dueDate: "" });
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentTask, setCurrentTask] = useState(null);

  const handleTaskClick = (task) => {
    setSelectedTask(task); // Tıklanan görevi state'e set et
  };

  const closeTaskModal = () => {
    setSelectedTask(null); // Modalı kapat
  };

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

        // localStorage'a görevleri kaydet
        localStorage.setItem("tasks", JSON.stringify(data));

        // Görevleri boardColumnName'e göre grupla
        const grouped = {
          "To Do": [],
          "In Progress": [],
          "Done": [],
        };

        data.forEach((task) => {
          const boardColumnName = task.boardColumnName;
          if (grouped[boardColumnName]) {
            grouped[boardColumnName].push(task);
          }
        });
        console.log("LocalStorage Tasks:", JSON.parse(localStorage.getItem("tasks")));
        // Görevleri önem derecesine göre sıralayın
        const sortByPriority = (tasks) => {
          return tasks.sort((a, b) => {
            const priorityOrder = { HIGH: 1, MEDIUM: 2, LOW: 3 };
            return priorityOrder[a.priority] - priorityOrder[b.priority];
          });
        };

        // Kolonları ve görevleri state'e set et
        setColumns([
          { id: "todo", title: "To Do", tasks: sortByPriority(grouped["To Do"] || []) },
          { id: "in-progress", title: "In Progress", tasks: sortByPriority(grouped["In Progress"] || []) },
          { id: "done", title: "Done", tasks: sortByPriority(grouped["Done"] || []) },
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);


  const filterTasks = (tasks) => {
    const now = new Date();
    let filteredTasks = tasks;

    if (filter === "lastHour") {
      filteredTasks = filteredTasks.filter(
        (task) => now - new Date(task.createdAt) <= 60 * 60 * 1000
      );
    } else if (filter === "lastWeek") {
      filteredTasks = filteredTasks.filter(
        (task) => now - new Date(task.createdAt) <= 7 * 24 * 60 * 60 * 1000
      );
    } else if (filter === "lastMonth") {
      filteredTasks = filteredTasks.filter(
        (task) => now - new Date(task.createdAt) <= 30 * 24 * 60 * 60 * 1000
      );
    }

    // Arama kelimesine göre filtreleme
    if (searchQuery) {
      filteredTasks = filteredTasks.filter(
        (task) =>
          task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          task.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    return filteredTasks;
  };

  const filteredColumns = columns.map((column) => ({
    ...column,
    tasks: filterTasks(column.tasks),
  }));

  const handleSaveUpdatedTask = () => {
    if (!currentTask.title) return alert("Görev başlığı gerekli!");

    const updatedTaskData = {
      title: currentTask.title,
      description: currentTask.description,
      priority: currentTask.priority,
      boardColumnName: currentTask.boardColumnName, // Eğer kolon bilgisi de güncelleniyorsa
      dueDate: currentTask.dueDate, // Tahmini bitiş tarihi
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

      // Görevi eski kolondan kaldır ve yeni kolona ekle
      setColumns((prevColumns) => {
        const updatedColumns = prevColumns.map((col) => {
          // Eski kolondan görevi kaldır
          if (col.tasks.some((task) => task.id === updatedTask.id)) {
            return {
              ...col,
              tasks: col.tasks.filter((task) => task.id !== updatedTask.id),
            };
          }
          return col;
        });

        // Yeni kolona görevi ekle
        return updatedColumns.map((col) => {
          if (col.title === updatedTask.boardColumnName) {
            return {
              ...col,
              tasks: [...col.tasks, updatedTask],
            };
          }
          return col;
        });
      });

      setIsUpdateModalOpen(false);
      setCurrentTask(null);

      // Başarılı bildirim
      toast.success("Görev başarıyla güncellendi!");
    } catch (err) {
      console.error(err);
      // Hata bildirimi
      toast.error("Görev güncellenirken bir hata oluştu.");
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

      // localStorage'a görevleri kaydet
      const savedTasks = JSON.parse(localStorage.getItem("tasks")) || [];
      savedTasks.push(createdTask);
      localStorage.setItem("tasks", JSON.stringify(savedTasks));

      setIsModalOpen(false);
      setNewTask({ title: "", description: "", priority: "LOW", dueDate: "" });
      toast.success("Görev başarıyla eklendi!");
    } catch (err) {
      console.error(err);
      toast.error("Görev eklenirken bir hata oluştu.");
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
      // Başarılı bildirim
      toast.success("Görev başarıyla silindi!");
    } catch (err) {
      console.error(err);
      // Hata bildirimi
      toast.error("Görev silinirken bir hata oluştu.");
    }
  };

  return (
    <div className="p-4 dark:bg-gray-700 dark:text-white">
      <div className="flex items-center justify-between mb-6 ">
        <h1 className="text-3xl font-bold font-caveat">My Board ✨</h1>
        {/* Filtreleme Dropdown */}
        <select
          className="p-2 border rounded-md bg-gray-50 dark:bg-gray-600 font-caveat"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="all">Tüm Görevler</option>
          <option value="lastHour">Son 1 Saat</option>
          <option value="lastWeek">Son 1 Hafta</option>
          <option value="lastMonth">Son 1 Ay</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredColumns.map((column) => (
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
                dueDate={task.dueDate} // dueDate burada geçiliyor
                highlight={searchQuery}
                onClick={() => handleTaskClick(task)}
                onDelete={() => handleDeleteTask(task.id, column.id)}
                onUpdate={() => {
                  setCurrentTask(task);
                  setIsUpdateModalOpen(true);
                }}
              />
            ))}
          </BoardColumn>
        ))}
      </div>

      {/* Görev Detay Modalı */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg w-full max-w-md">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 dark:text-white ">{selectedTask.title}</h2>
            <p className="text-gray-600 dark:text-white  mb-4">{selectedTask.description}</p>
            <p className="text-sm text-gray-500 dark:text-white mb-4">
              <span className="font-semibold">Priority:</span> {selectedTask.priority}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              <span className="font-semibold">Created At:</span>{" "}
              {new Date(selectedTask.createdAt).toLocaleString()}
            </p>
            <p className="text-sm text-gray-500 mb-4">
              <span className="font-semibold">Due Date:</span>{" "}
              {new Date(selectedTask.dueDate).toLocaleString()}
            </p>
            <div className="flex justify-end">
              <button
                className="px-4 py-2 bg-sky-300 text-white rounded hover:bg-blue-600 transition"
                onClick={closeTaskModal}
              >
                Kapat
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Güncelleme Modalı */}
      {isUpdateModalOpen && currentTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded shadow-lg w-96">
            <h2 className="text-xl font-bold mb-4">Görevi Güncelle</h2>
            <input
              type="text"
              placeholder="Görev Başlığı"
              className="w-full p-2 border rounded mb-4 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              value={currentTask.title}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, title: e.target.value })
              }
            />
            <div>
              <textarea
                placeholder="Görev Açıklaması"
                className="w-full p-2 border rounded mb-4 dark:bg-gray-800 dark:text-white dark:border-gray-600"
                value={currentTask.description}
                onChange={(e) =>
                  setCurrentTask({ ...currentTask, description: e.target.value })
                }
                maxLength={255}
              />
              <p className="text-sm text-gray-500 dark:text-white">
                {255 - currentTask.description.length} karakter kaldı
              </p>
            </div>
            <select
              className="w-full p-2 border rounded mb-4 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              value={currentTask.priority}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, priority: e.target.value })
              }
            >
              <option value="LOW">Düşük</option>
              <option value="MEDIUM">Orta</option>
              <option value="HIGH">Yüksek</option>
            </select>
            {/* Kategori Seçimi */}
            <select
              className="w-full p-2 border rounded mb-4 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              value={currentTask.boardColumnName}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, boardColumnName: e.target.value })
              }
            >
              {columns.map((column) => (
                <option key={column.id} value={column.title}>
                  {column.title}
                </option>
              ))}
            </select>
            {/* Tahmini Bitiş Tarihi */}
            <input
              type="date"
              className="w-full p-2 border rounded mb-4 dark:bg-gray-800 dark:text-white dark:border-gray-600"
              value={currentTask.dueDate || ""}
              onChange={(e) =>
                setCurrentTask({ ...currentTask, dueDate: e.target.value })
              }
            />
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
      <TaskModal
        isOpen={isModalOpen}
        task={newTask}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onChange={setNewTask}
      />

      {/* Toastify Container */}
      <ToastContainer />
    </div>
  );
}
