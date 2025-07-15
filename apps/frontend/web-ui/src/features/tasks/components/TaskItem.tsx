"use client";

import { formatDate } from "@/utils";
import { Task, TaskStatus } from "../api";
import {
  Calendar,
  Clock,
  CheckCircle2,
  Circle,
  CircleDot,
  XCircle,
  Trash2,
  MoreVertical,
  Edit,
} from "lucide-react";
import { useState } from "react";

interface TaskItemProps {
  task: Task;
  onStatusChange: (taskId: number, status: TaskStatus) => void;
  onDelete: (taskId: number) => void;
}

export default function TaskItem({
  task,
  onStatusChange,
  onDelete,
}: TaskItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  const statusConfig = {
    [TaskStatus.TODO]: {
      icon: Circle,
      color: "text-gray-500",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      label: "To Do",
    },
    [TaskStatus.IN_PROGRESS]: {
      icon: CircleDot,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      label: "In Progress",
    },
    [TaskStatus.COMPLETED]: {
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      label: "Completed",
    },
    [TaskStatus.CANCELLED]: {
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      label: "Cancelled",
    },
  };

  const currentStatus = statusConfig[task.status];
  const StatusIcon = currentStatus.icon;

  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && 
    task.status !== TaskStatus.COMPLETED && task.status !== TaskStatus.CANCELLED;

  return (
    <div
      className={`group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-200 border ${
        isOverdue ? "border-red-300 bg-red-50/30" : "border-gray-200"
      }`}
    >
      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <div className="mt-0.5">
            <StatusIcon
              className={`w-6 h-6 ${currentStatus.color} transition-colors`}
            />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3
                  className={`text-lg font-semibold text-gray-900 ${
                    task.status === TaskStatus.COMPLETED
                      ? "line-through text-gray-500"
                      : ""
                  }`}
                >
                  {task.title}
                </h3>
                {task.description && (
                  <p className="mt-1 text-sm text-gray-600 line-clamp-2">
                    {task.description}
                  </p>
                )}

                {/* Meta Info */}
                <div className="mt-3 flex flex-wrap items-center gap-4 text-xs">
                  {task.dueDate && (
                    <div
                      className={`flex items-center gap-1.5 ${
                        isOverdue ? "text-red-600 font-medium" : "text-gray-500"
                      }`}
                    >
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Due {formatDate(task.dueDate)}</span>
                      {isOverdue && <span className="text-red-600">(Overdue)</span>}
                    </div>
                  )}
                  <div className="flex items-center gap-1.5 text-gray-500">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Created {formatDate(task.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Status Dropdown */}
                <select
                  value={task.status}
                  onChange={(e) =>
                    onStatusChange(task.id, e.target.value as TaskStatus)
                  }
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${
                    currentStatus.bgColor
                  } ${currentStatus.borderColor} ${
                    currentStatus.color
                  } focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer transition-colors`}
                >
                  {Object.values(TaskStatus).map((status) => (
                    <option key={status} value={status}>
                      {statusConfig[status].label}
                    </option>
                  ))}
                </select>

                {/* Menu Button */}
                <div className="relative">
                  <button
                    onClick={() => setShowMenu(!showMenu)}
                    className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>

                  {showMenu && (
                    <>
                      <div
                        className="fixed inset-0 z-10"
                        onClick={() => setShowMenu(false)}
                      />
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-20">
                        <button
                          onClick={() => {
                            // Add edit functionality here
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                        >
                          <Edit className="w-4 h-4" />
                          Edit Task
                        </button>
                        <button
                          onClick={() => {
                            onDelete(task.id);
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Task
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Indicator */}
      {task.status === TaskStatus.IN_PROGRESS && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100 rounded-b-xl overflow-hidden">
          <div className="h-full bg-blue-600 animate-pulse" style={{ width: "50%" }} />
        </div>
      )}
    </div>
  );
}