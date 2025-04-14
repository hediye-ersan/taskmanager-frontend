import React, { useState } from "react";
import { DndContext } from "@dnd-kit/core"; // Drag and drop context
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"; // Sorting strategy
import TaskCard from "./TaskCard";
import { useCallback } from "react";

const TaskList = () => {
  const [tasks, setTasks] = useState([
    { id: "1", title: "Task 1", description: "Task 1 description", boardColumnId: 1 },
    { id: "2", title: "Task 2", description: "Task 2 description", boardColumnId: 1 },
    { id: "3", title: "Task 3", description: "Task 3 description", boardColumnId: 2 },
  ]);

  const handleDragEnd = useCallback((event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      // Yeni sıralama yapıldığında task listesinde sıralamayı güncelle
      const newTasks = Array.from(tasks);
      const oldIndex = tasks.findIndex((task) => task.id === active.id);
      const newIndex = tasks.findIndex((task) => task.id === over.id);

      // Görevleri yeni sıraya göre yer değiştir
      newTasks.splice(oldIndex, 1);
      newTasks.splice(newIndex, 0, tasks[oldIndex]);

      // Yeni sıralamayı state'e yansıt
      setTasks(newTasks);

      // Yeni sıralamayı backend'e gönderme işlemi
      // fetch('/api/update-tasks', { method: 'POST', body: JSON.stringify(newTasks) });
    }
  }, [tasks]);

  return (
    <div className="task-list-container">
      <DndContext onDragEnd={handleDragEnd}>
        <SortableContext
          items={tasks.map((task) => task.id)} // task IDs
          strategy={verticalListSortingStrategy}
        >
          <div className="grid grid-cols-3 gap-4">
            {tasks.map((task) => (
              <TaskCard key={task.id} task={task} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default TaskList;
