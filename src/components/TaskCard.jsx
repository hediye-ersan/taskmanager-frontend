export function TaskCard({ title, description, category, assignees }) {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <div className="flex justify-between items-start mb-3">
        <div className="flex items-center gap-1.5">
          <span className={`h-2.5 w-2.5 rounded-full bg-${category.color}`}></span>
          <span className="text-xs uppercase text-gray-500">{category.name}</span>
        </div>
        <button className="p-1 rounded hover:bg-gray-100">
          <svg
            className="h-4 w-4 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
            />
          </svg>
        </button>
      </div>
      <h3 className="font-medium mb-2">{title}</h3>
      <p className="text-sm text-gray-600 mb-4">{description}</p>
      <div className="flex -space-x-2">
        {assignees.map((assignee, index) => (
          <div
            key={index}
            className={`h-8 w-8 rounded-full bg-${assignee.color} flex items-center justify-center text-white text-xs border-2 border-white`}
          >
            {assignee.initials}
          </div>
        ))}
      </div>
    </div>
  );
}
