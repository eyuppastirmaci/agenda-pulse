"use client";

import { formatDate } from "@/utils";
import { Task, TaskStatus } from "../api";

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: number, status: TaskStatus) => void;
  onDelete: (taskId: number) => void;
  statusColors: Record<TaskStatus, string>;
}

export default function TaskItem({
  task,
  onStatusChange,
  onDelete,
  statusColors,
}: TaskItemProps) {
  return (
    <div className="bg-white p-4 rounded-lg shadow border border-gray-200">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900">{task.title}</h3>
          {task.description && (
            <p className="mt-1 text-sm text-gray-600">{task.description}</p>
          )}
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            {task.dueDate && <span>Due: {formatDate(task.dueDate)}</span>}
            <span>Created: {formatDate(task.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 ml-4">
          <select
            value={task.status}
            onChange={(e) =>
              onStatusChange(task.id, e.target.value as TaskStatus)
            }
            className={`px-3 py-1 rounded-md text-sm font-medium ${
              statusColors[task.status]
            }`}
          >
            {Object.values(TaskStatus).map((status) => (
              <option key={status} value={status}>
                {status.replace("_", " ")}
              </option>
            ))}
          </select>
          <button
            onClick={() => onDelete(task.id)}
            className="text-red-600 hover:text-red-800"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}
