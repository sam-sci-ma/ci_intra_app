"use client";

import { CheckSquare, Square, Plus, Clock, AlertCircle, Trash2, Edit2 } from "lucide-react";

export type Todo = {
  id?: number;
  title: string;
  description?: string;
  dueDate?: string;
  priority?: string;
  completed?: boolean;
  owner_name?: string;
};

interface TodoTabProps {
  todos: Todo[];
  searchTerm: string;
  onSearchChange: (value: string) => void;
  onToggle: (id: number, completed: boolean) => void;
  onEdit: (todo: Todo) => void;
  onDelete: (id: number) => void;
  onAdd: () => void;
}

const priorityColor: Record<string, string> = {
  high: "bg-red-100 text-red-700",
  medium: "bg-amber-100 text-amber-700",
  low: "bg-emerald-100 text-emerald-700"
};

export default function TodoTab({
  todos,
  searchTerm,
  onSearchChange,
  onToggle,
  onEdit,
  onDelete,
  onAdd
}: TodoTabProps) {
  const filtered = todos.filter(t => {
    const term = searchTerm.toLowerCase();
    return (
      t.title?.toLowerCase().includes(term) ||
      t.description?.toLowerCase().includes(term) ||
      t.owner_name?.toLowerCase().includes(term)
    );
  });

  return (
    <div className="space-y-4">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search todos..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-3 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
          />
        </div>
        <button
          onClick={onAdd}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Todo
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        {filtered.length === 0 ? (
          <div className="p-6 text-center text-gray-600">No todos yet.</div>
        ) : (
          <ul className="divide-y divide-gray-200">
            {filtered.map(todo => {
              const badgeClass = priorityColor[todo.priority || ""] || "bg-gray-100 text-gray-700";
              return (
                <li key={todo.id} className="p-4 flex items-start gap-4">
                  <button
                    onClick={() => todo.id !== undefined && onToggle(todo.id, !todo.completed)}
                    className="mt-1 text-indigo-600 hover:text-indigo-700"
                    aria-label={todo.completed ? "Mark incomplete" : "Mark complete"}
                  >
                    {todo.completed ? <CheckSquare className="w-5 h-5" /> : <Square className="w-5 h-5" />}
                  </button>

                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <h3 className={`text-base font-semibold ${todo.completed ? "line-through text-gray-500" : "text-gray-900"}`}>
                        {todo.title}
                      </h3>
                      <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${badgeClass}`}>
                        {todo.priority ? todo.priority.toUpperCase() : "UNSET"}
                      </span>
                      {todo.owner_name && (
                        <span className="text-xs text-gray-500">Owner: {todo.owner_name}</span>
                      )}
                    </div>
                    {todo.description && (
                      <p className={`text-sm ${todo.completed ? "text-gray-500 line-through" : "text-gray-700"}`}>
                        {todo.description}
                      </p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      {todo.dueDate && (
                        <span className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          Due {todo.dueDate}
                        </span>
                      )}
                      {todo.completed && (
                        <span className="flex items-center gap-1 text-emerald-600">
                          <CheckSquare className="w-4 h-4" />
                          Completed
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onEdit(todo)}
                      className="p-2 text-gray-500 hover:text-indigo-600"
                      aria-label="Edit todo"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => todo.id !== undefined && onDelete(todo.id)}
                      className="p-2 text-gray-500 hover:text-red-600"
                      aria-label="Delete todo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}
