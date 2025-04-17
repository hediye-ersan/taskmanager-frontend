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

        // Görevleri kolona göre grupla
        const grouped = {
          "To Do": [],
          "In Progress": [],
          "Done": [],
        };

        data.forEach((task) => {
          const colName = task.boardColumnName;
          if (grouped[colName]) {
            grouped[colName].push(task);
          }
        });

        // state'e set et
        setColumns([
          { id: "todo", title: "To Do", tasks: grouped["To Do"] },
          { id: "in-progress", title: "In Progress", tasks: grouped["In Progress"] },
          { id: "done", title: "Done", tasks: grouped["Done"] },
        ]);
      } catch (err) {
        console.error(err);
      }
    };

    fetchTasks();
  }, []);


  return (
    <div className="p-6">
      
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Board</h1>
        <div className="relative">
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium rounded-md border border-gray-300">
            This week
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
  {columns.map((column) => (
    <BoardColumn key={column.id} title={column.title}>
      {column.tasks.map((task, index) => (
        <TaskCard
          key={task.id || index} // Benzersiz bir key kullanın
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
    </div>
  );
}


