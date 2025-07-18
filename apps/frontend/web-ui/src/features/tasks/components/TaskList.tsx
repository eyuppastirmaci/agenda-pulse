"use client";

import { useState, useEffect } from "react";
import { Task, TaskStatus, getTasks, updateTask, deleteTask } from "../api";
import TaskItem from "./TaskItem";
import CreateTaskModal from "./CreateTaskModal";
import { Plus, Filter, ChevronLeft, ChevronRight, ListTodo } from "lucide-react";

export default function TaskList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<TaskStatus | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadTasks();
  }, [page, filter]);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const response = await getTasks(page, 20, filter);
      setTasks(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to load tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (taskId: number, status: TaskStatus) => {
    try {
      const updated = await updateTask(taskId, { status });
      setTasks(tasks.map((t) => (t.id === taskId ? updated : t)));
    } catch (error) {
      console.error("Failed to update task:", error);
    }
  };

  const handleDelete = async (taskId: number) => {
    if (!confirm("Are you sure you want to delete this task?")) return;

    try {
      await deleteTask(taskId);
      setTasks(tasks.filter((t) => t.id !== taskId));
    } catch (error) {
      console.error("Failed to delete task:", error);
    }
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks([newTask, ...tasks]);
    setShowCreateModal(false);
  };

  const filterButtons = [
    { label: "All Tasks", value: undefined, icon: ListTodo },
    { label: "To Do", value: TaskStatus.TODO },
    { label: "In Progress", value: TaskStatus.IN_PROGRESS },
    { label: "Completed", value: TaskStatus.COMPLETED },
    { label: "Cancelled", value: TaskStatus.CANCELLED },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <ListTodo className="w-7 h-7 text-blue-600" />
            My Tasks
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track your tasks efficiently
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          New Task
        </button>
      </div>

      {/* Filter Pills */}
      <div className="mb-6 bg-gray-50 p-3 rounded-xl">
        <div className="flex items-center gap-2 mb-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <span className="text-sm font-medium text-gray-700">Filter by status</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {filterButtons.map((btn) => (
            <button
              key={btn.label}
              onClick={() => setFilter(btn.value)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                filter === btn.value
                  ? "bg-blue-600 text-white shadow-md transform scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              {btn.icon && <btn.icon className="w-4 h-4 inline mr-1.5" />}
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Task List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          <p className="mt-4 text-gray-500">Loading tasks...</p>
        </div>
      ) : tasks.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-xl">
          <ListTodo className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No tasks found</h3>
          <p className="text-gray-500 mb-6">
            {filter ? "No tasks match the selected filter." : "Get started by creating your first task!"}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Task
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {tasks.map((task, index) => (
            <div
              key={task.id}
              className="transform transition-all duration-300 animate-fadeInUp"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <TaskItem
                task={task}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <button
            onClick={() => setPage(Math.max(0, page - 1))}
            disabled={page === 0}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          
          <div className="flex gap-1">
            {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
              let pageNum;
              if (totalPages <= 5) {
                pageNum = i;
              } else if (page < 3) {
                pageNum = i;
              } else if (page > totalPages - 4) {
                pageNum = totalPages - 5 + i;
              } else {
                pageNum = page - 2 + i;
              }
              
              return (
                <button
                  key={i}
                  onClick={() => setPage(pageNum)}
                  className={`w-10 h-10 rounded-lg font-medium transition-all ${
                    pageNum === page
                      ? "bg-blue-600 text-white"
                      : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
                  }`}
                >
                  {pageNum + 1}
                </button>
              );
            })}
          </div>
          
          <button
            onClick={() => setPage(Math.min(totalPages - 1, page + 1))}
            disabled={page === totalPages - 1}
            className="p-2 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      )}

      <CreateTaskModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onTaskCreated={handleTaskCreated}
      />


    </div>
  );
}