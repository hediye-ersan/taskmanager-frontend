import React, { useEffect, useState } from "react";

const DashboardPage = () => {
  const [tasks, setTasks] = useState([]);
  const [taskCounts, setTaskCounts] = useState({
    todo: 0,
    inProgress: 0,
    done: 0,
  });

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
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);

  return (
    <div className="p-6 flex flex-col gap-6 ">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Görev Durumu */}
        <div className="bg-white p-4 rounded-lg shadow">
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
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Son Etkinlikler</h2>
          <ul className="text-gray-600 space-y-2">
            <li>VH bir görev tamamladı.</li>
            <li>AG yeni bir görev ekledi.</li>
            <li>ML bir görevi düzenledi.</li>
          </ul>
        </div>

        {/* Hızlı Erişim */}
        <div className="bg-white p-4 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Hızlı Erişim</h2>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition">
            Yeni Görev Ekle
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;