"use client";

import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import { useState } from "react";
import { createTask, Task } from "../api";
import { getErrorMessage } from "@/utils";

const createTaskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title is too long"),
  description: z
    .string()
    .max(1000, "Description is too long")
    .transform((val) => (val.trim() === "" ? undefined : val)),
  dueDate: z.string().transform((val) => (val.trim() === "" ? undefined : val)),
});

interface CreateTaskModalProps {
  onClose: () => void;
  onTaskCreated: (task: Task) => void;
}

export default function CreateTaskModal({
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
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
        <h2 className="text-xl font-bold mb-4">Create New Task</h2>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            e.stopPropagation();
            form.handleSubmit();
          }}
          className="space-y-4"
        >
          <div>
            <form.Field
              name="title"
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium mb-1"
                  >
                    Title *
                  </label>
                  <input
                    id={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter task title"
                  />
                  {getErrorMessage(field.state.meta.errors) && (
                    <p className="mt-1 text-sm text-red-600">
                      {getErrorMessage(field.state.meta.errors)}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <form.Field
              name="description"
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium mb-1"
                  >
                    Description
                  </label>
                  <textarea
                    id={field.name}
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Enter task description (optional)"
                  />
                  {getErrorMessage(field.state.meta.errors) && (
                    <p className="mt-1 text-sm text-red-600">
                      {getErrorMessage(field.state.meta.errors)}
                    </p>
                  )}
                </>
              )}
            />
          </div>

          <div>
            <form.Field
              name="dueDate"
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium mb-1"
                  >
                    Due Date
                  </label>
                  <input
                    id={field.name}
                    type="datetime-local"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </>
              )}
            />
          </div>

          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <form.Subscribe
              selector={(state) => [state.canSubmit, state.isSubmitting]}
              children={([canSubmit, isSubmitting]) => (
                <button
                  type="submit"
                  disabled={!canSubmit}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? "Creating..." : "Create Task"}
                </button>
              )}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
