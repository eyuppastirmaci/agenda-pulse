"use client";

import { useState } from "react";
import { useForm } from "@tanstack/react-form";
import { z } from "zod";
import {
  createCalendarEvent,
  CalendarEvent,
  CreateCalendarEventRequest,
} from "../api";
import Modal from "@/components/Modal";
import {
  Calendar,
  Type,
  FileText,
  Clock,
  Bell,
  X,
  Loader2,
  CalendarClock,
  CalendarCheck,
} from "lucide-react";
import { getErrorMessage } from "@/utils";

const createEventSchema = z
  .object({
    title: z.string().min(1, "Title is required").max(200, "Title is too long"),
    description: z
      .string()
      .max(1000, "Description is too long")
      .transform((val) => (val.trim() === "" ? undefined : val)),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
    reminderTime: z
      .string()
      .transform((val) => (val.trim() === "" ? undefined : val)),
  })
  .refine(
    (data) => {
      if (data.startTime && data.endTime) {
        return new Date(data.startTime) < new Date(data.endTime);
      }
      return true;
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

interface CreateCalendarEventModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEventCreated: (event: CalendarEvent) => void;
}

export default function CreateCalendarEventModal({
  isOpen,
  onClose,
  onEventCreated,
}: CreateCalendarEventModalProps) {
  const [error, setError] = useState<string | null>(null);

  const formatDateTimeLocal = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  };

  // Set default times
  const now = new Date();
  const defaultStart = new Date(now.getTime() + 60 * 60 * 1000); // 1 hour from now
  const defaultEnd = new Date(now.getTime() + 2 * 60 * 60 * 1000); // 2 hours from now
  const defaultReminder = new Date(now.getTime() + 45 * 60 * 1000); // 45 minutes from now

  const form = useForm({
    defaultValues: {
      title: "",
      description: "",
      startTime: formatDateTimeLocal(defaultStart),
      endTime: formatDateTimeLocal(defaultEnd),
      reminderTime: formatDateTimeLocal(defaultReminder),
    },
    onSubmit: async ({ value }) => {
      try {
        setError(null);
        const request: CreateCalendarEventRequest = {
          title: value.title,
          description: value.description || undefined,
          startTime: value.startTime,
          endTime: value.endTime,
          reminderTime: value.reminderTime || undefined,
        };

        const newEvent = await createCalendarEvent(request);
        onEventCreated(newEvent);
      } catch (err: any) {
        setError(
          err.response?.data?.error || "Failed to create calendar event"
        );
      }
    },
    validators: {
      onSubmit: createEventSchema,
    },
  });

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <div className="relative">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-100 rounded-xl">
              <Calendar className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">
              Schedule New Event
            </h2>
          </div>
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
                    Event Title
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    id={field.name}
                    type="text"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    placeholder="e.g., Team Meeting, Doctor Appointment"
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
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                    rows={3}
                    placeholder="Add event details, agenda, or notes..."
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

          {/* Date Time Fields in Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Start Time */}
            <div>
              <form.Field
                name="startTime"
                children={(field) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                    >
                      <CalendarClock className="w-4 h-4 text-gray-500" />
                      Start Time
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={field.name}
                      type="datetime-local"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      min={formatDateTimeLocal(new Date())}
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

            {/* End Time */}
            <div>
              <form.Field
                name="endTime"
                children={(field) => (
                  <>
                    <label
                      htmlFor={field.name}
                      className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                    >
                      <CalendarCheck className="w-4 h-4 text-gray-500" />
                      End Time
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={field.name}
                      type="datetime-local"
                      value={field.state.value}
                      onBlur={field.handleBlur}
                      onChange={(e) => field.handleChange(e.target.value)}
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                      min={formatDateTimeLocal(new Date())}
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
          </div>

          {/* Reminder Time */}
          <div>
            <form.Field
              name="reminderTime"
              children={(field) => (
                <>
                  <label
                    htmlFor={field.name}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2"
                  >
                    <Bell className="w-4 h-4 text-gray-500" />
                    Reminder
                    <span className="text-xs text-gray-400">(Optional)</span>
                  </label>
                  <input
                    id={field.name}
                    type="datetime-local"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                    min={formatDateTimeLocal(new Date())}
                  />
                  <p className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    Get notified before the event starts
                  </p>
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
                  className="px-5 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2 shadow-lg hover:shadow-xl disabled:shadow-none"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4" />
                      Schedule Event
                    </>
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
