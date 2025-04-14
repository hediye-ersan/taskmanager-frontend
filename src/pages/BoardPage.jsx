"use client";

import { useState } from "react";
import BoardColumn from "../components/BoardColumn";
import { TaskCard } from "../components/TaskCard";

export default function BoardPage() {
  const [columns, setColumns] = useState([
    {
      id: "todo",
      title: "To do",
      tasks: [
        {
          id: "task-1",
          title: "Hero section",
          description:
            "Create a design system for a hero section in 2 different variants. Create a simple presentation with these components.",
          category: {
            name: "DESIGN SYSTEM",
            color: "green-500",
          },
          assignees: [
            { initials: "VH", color: "blue-600" },
            { initials: "JG", color: "orange-400" },
          ],
        },
        {
          id: "task-2",
          title: "Typography change",
          description:
            "Modify typography and styling of text placed on 6 screens of the website design. Prepare a documentation.",
          category: {
            name: "TYPOGRAPHY",
            color: "blue-400",
          },
          assignees: [{ initials: "ML", color: "pink-500" }],
        },
      ],
    },
    {
      id: "in-progress",
      title: "In progress",
      tasks: [
        {
          id: "task-3",
          title: "Implement design screens",
          description:
            "Our designers created 6 screens for a website that needs to be implemented by our dev team.",
          category: {
            name: "DEVELOPMENT",
            color: "pink-500",
          },
          assignees: [
            { initials: "VH", color: "blue-600" },
            { initials: "LK", color: "green-500" },
          ],
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      tasks: [
        {
          id: "task-4",
          title: "Fix bugs in the CSS code",
          description:
            "Fix small bugs that are essential to prepare for the next release that will happen this quarter.",
          category: {
            name: "DEVELOPMENT",
            color: "pink-500",
          },
          assignees: [
            { initials: "HU", color: "pink-500" },
            { initials: "NL", color: "orange-400" },
          ],
        },
        {
          id: "task-5",
          title: "Proofread final text",
          description:
            "The text provided by marketing department needs to be proofread so that we make sure that it fits into our design.",
          category: {
            name: "TYPOGRAPHY",
            color: "blue-400",
          },
          assignees: [{ initials: "AG", color: "orange-400" }],
        },
        {
          id: "task-6",
          title: "Responsive design",
          description:
            "All designs need to be responsive. The requirement is that it fits all web and mobile screens.",
          category: {
            name: "DESIGN SYSTEM",
            color: "green-500",
          },
          assignees: [
            { initials: "VH", color: "blue-600" },
            { initials: "AG", color: "orange-400" },
          ],
        },
      ],
    },
  ]);

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
            {column.tasks.map((task) => (
              <TaskCard
                key={task.id}
                title={task.title}
                description={task.description}
                category={task.category}
                assignees={task.assignees}
              />
            ))}
          </BoardColumn>
        ))}
      </div>
    </div>
  );
}
