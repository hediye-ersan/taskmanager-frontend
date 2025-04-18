import React, { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale"; // Türkçe tarih formatı için
import TaskModal from "../components/TaskModal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [taskCounts, setTaskCounts] = useState({
    todo: 0,
    inProgress: 0,
    done: 0,
  });
  const [recentActivities, setRecentActivities] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
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
        setTasks(data);

        // Görevleri durumlarına göre say
        const counts = {
          todo: data.filter((task) => task.boardColumnName === "To Do").length,
          inProgress: data.filter((task) => task.boardColumnName === "In Progress").length,
          done: data.filter((task) => task.boardColumnName === "Done").length,
        };
        setTaskCounts(counts);

        // Son 3 etkinliği al
        const sortedActivities = data
          .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
          .slice(0, 3);
        setRecentActivities(sortedActivities);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  const addActivity = (action, task) => {
    const activity = {
      title: task.title,
      action, // İşlem türü: eklendi, güncellendi, silindi
      timestamp: new Date(), // İşlem zamanı
    };

    setRecentActivities((prevActivities) => [activity, ...prevActivities].slice(0, 3));
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
        body: JSON.stringify(newTask),
      });

      if (!res.ok) throw new Error("Görev eklenemedi");

      const createdTask = await res.json();
      setTasks((prevTasks) => [...prevTasks, createdTask]);
      setIsModalOpen(false);
      setNewTask({ title: "", description: "", priority: "LOW" });

      // Başarılı bildirim
      toast.success("Görev başarıyla eklendi!");
    } catch (err) {
      console.error(err);
      toast.error("Görev eklenirken bir hata oluştu.");
    }
  };

  return (
    <div className="p-6 flex flex-col gap-6 font-caveat ">
      <h1 className="text-3xl font-bold"> My Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Görev Durumu */}
        <div className="bg-gray-100 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Görev Durumu</h2>
          <p className="text-gray-600">
            Yapılacak: <span className="font-bold">{taskCounts.todo}</span>
          </p>
          <p className="text-gray-600">
            Devam Eden: <span className="font-bold">{taskCounts.inProgress}</span>
          </p>
          <p className="text-gray-600">
            Tamamlanan: <span className="font-bold">{taskCounts.done}</span>
          </p>
        </div>

        {/* Son Etkinlikler */}
        <div className="bg-gray-200 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Son Etkinlikler</h2>
          <ul className="text-gray-600 space-y-2">
            {recentActivities.map((activity, index) => {
              // Tarih kontrolü
              const isValidDate =
                activity.updatedAt || activity.createdAt
                  ? !isNaN(new Date(activity.updatedAt || activity.createdAt).getTime())
                  : false;

              return (
                <li key={index}>
                  <span className="font-semibold">{activity.title || "Bir görev"}</span>{" "}
                  {activity.updatedAt ? "güncellendi" : "eklendi"}{" "}
                  {isValidDate && (
                    `(${formatDistanceToNow(new Date(activity.updatedAt || activity.createdAt), {
                      addSuffix: true,
                      locale: tr,
                    })})`
                  )}
                </li>
              );
            })}
          </ul>
        </div>

        {/* Hızlı Erişim */}
        <div className="bg-gray-300 p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Hızlı Erişim</h2>
          <button
            className="bg-gray-200  px-4 py-2 rounded-lg hover:bg-gray-400 transition"
            onClick={() => setIsModalOpen(true)}
          >
            Yeni Görev Ekle
          </button>
        </div>
      </div>
      <TaskModal
        isOpen={isModalOpen}
        task={newTask}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveTask}
        onChange={setNewTask}
      />
      <ToastContainer />
    </div>
  );
};

export default DashboardPage;