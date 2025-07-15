"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useState } from "react";
import { createTask, Task } from "../api";
import { getErrorMessage } from "@/utils";
import Modal from "@/components/Modal";
import { Calendar, FileText, Type, X, Loader2 } from "lucide-react";

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z
    .string()
    .max(1000, "Description is too long")
    .transform((val) => (val.trim() === "" ? undefined : val)),
  dueDate: z.string().transform((val) => (val.trim() === "" ? undefined : val)),
});

interface CreateTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
}

export default function CreateTaskModal({
  isOpen,
  onClose,
  onTaskCreated,
}: CreateTaskModalProps) {
  const [error, setError] = useState<string | null>(null);

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      dueDate: "",
    },
    onSubmit: async ({ value }) => {
      try {
        setError(null);
        const taskData = {
          title: value.title,
          description: value.description || undefined,
          dueDate: value.dueDate || undefined,
        };
        const newTask = await createTask(taskData);
        onTaskCreated(newTask);
      } catch (err: any) {
        setError(err.response?.data?.error || "Failed to create task");
      }
    },
    validators: {
      onSubmit: createTaskSchema,
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create New Task</h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-5"
        >
          {/* Title Field */}
          <div>
            <form.Field
              name="title"
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                  >
                    <Type className="w-4 h-4 text-gray-500" />
                    Title
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="Enter task title"
                  />
                  {getErrorMessage(field.state.meta.errors) && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
                      {getErrorMessage(field.state.meta.errors)}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* Description Field */}
          <div>
            <form.Field
              name="description"
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                  >
                    <FileText className="w-4 h-4 text-gray-500" />
                    Description
                    <span className="text-xs text-gray-400">(Optional)</span>
                  </label>
                  <textarea
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                    rows={4}
                    placeholder="Add a detailed description..."
                  />
                  {getErrorMessage(field.state.meta.errors) && (
                    <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                      <span className="inline-block w-1 h-1 bg-red-600 rounded-full" />
                      {getErrorMessage(field.state.meta.errors)}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          {/* Due Date Field */}
          <div>
            <form.Field
              name="dueDate"
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                  >
                    <Calendar className="w-4 h-4 text-gray-500" />
                    Due Date
                    <span className="text-xs text-gray-400">(Optional)</span>
                  </label>
                  <input
                    id={field.name}
                    type="datetime-local"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    min={new Date().toISOString().slice(0, 16)}
                  />
                </>
              )}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 text-sm text-red-600 bg-red-50 rounded-lg border border-red-200 flex items-start gap-2">
              <div className="mt-0.5">
                <div className="w-4 h-4 bg-red-600 rounded-full flex items-center justify-center">
                  <X className="w-2.5 h-2.5 text-white" />
                </div>
              </div>
              <span>{error}</span>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors"
            >
              Cancel
            </button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg font-medium hover:from-blue-700 hover:to-blue-800 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    "Create Task"
                  )}
                </button>
              )}
            />
          </div>
        </form>
      </div>
    </Modal>
  );
}