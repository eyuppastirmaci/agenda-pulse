"use client";

import { CalendarEvent, CalendarEventStatus } from "../api";
import {
  Calendar,
  Clock,
  Bell,
  Trash2,
  MoreVertical,
  CheckCircle2,
  XCircle,
  Play,
  Edit,
} from "lucide-react";
import { formatDateTime, formatDuration } from "@/utils/dateUtils";
import { useState } from "react";

interface CalendarEventItemProps {
  event: CalendarEvent;
  onStatusChange: (eventId: number, status: CalendarEventStatus) => void;
  onDelete: (eventId: number) => void;
}

export default function CalendarEventItem({
  event,
  onStatusChange,
  onDelete,
}: CalendarEventItemProps) {
  const [showMenu, setShowMenu] = useState(false);

  const statusConfig = {
    [CalendarEventStatus.SCHEDULED]: {
      icon: Clock,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      label: "Scheduled",
      gradient: "from-blue-50 to-blue-100",
    },
    [CalendarEventStatus.IN_PROGRESS]: {
      icon: Play,
      color: "text-amber-600",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      label: "In Progress",
      gradient: "from-amber-50 to-amber-100",
    },
    [CalendarEventStatus.COMPLETED]: {
      icon: CheckCircle2,
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      label: "Completed",
      gradient: "from-green-50 to-green-100",
    },
    [CalendarEventStatus.CANCELLED]: {
      icon: XCircle,
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      label: "Cancelled",
      gradient: "from-red-50 to-red-100",
    },
  };

  const currentStatus = statusConfig[event.status];
  const StatusIcon = currentStatus.icon;

  const isUpcoming =
    event.status === CalendarEventStatus.SCHEDULED &&
    new Date(event.startTime) > new Date();
  const isPast =
    new Date(event.endTime) < new Date() &&
    event.status !== CalendarEventStatus.COMPLETED &&
    event.status !== CalendarEventStatus.CANCELLED;

  return (
    <div
      className={`group relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 border overflow-hidden ${
        isPast ? "border-orange-200 bg-orange-50/30" : "border-gray-200"
      }`}
    >
      {/* Status Indicator Bar */}
      <div
        className={`absolute top-0 left-0 w-1 h-full ${currentStatus.bgColor}`}
      />

      <div className="p-5 pl-6">
        <div className="flex items-start gap-4">
          {/* Status Icon */}
          <div
            className={`p-2.5 rounded-xl bg-gradient-to-br ${currentStatus.gradient} ${currentStatus.borderColor} border`}
          >
            <StatusIcon className={`w-5 h-5 ${currentStatus.color}`} />
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                {/* Title and Status Badge */}
                <div className="flex items-start gap-3 mb-2">
                  <h3
                    className={`text-lg font-semibold text-gray-900 ${
                      event.status === CalendarEventStatus.CANCELLED
                        ? "line-through text-gray-500"
                        : ""
                    }`}
                  >
                    {event.title}
                  </h3>
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${currentStatus.bgColor} ${currentStatus.color} ${currentStatus.borderColor} border`}
                  >
                    {currentStatus.label}
                  </span>
                </div>

                {/* Description */}
                {event.description && (
                  <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                    {event.description}
                  </p>
                )}

                {/* Event Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Start Time */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-1.5 bg-blue-100 rounded-lg">
                      <Calendar className="w-3.5 h-3.5 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Starts</p>
                      <p className="text-gray-900 font-medium">
                        {formatDateTime(event.startTime)}
                      </p>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-center gap-2 text-sm">
                    <div className="p-1.5 bg-green-100 rounded-lg">
                      <Clock className="w-3.5 h-3.5 text-green-600" />
                    </div>
                    <div>
                      <p className="text-gray-500 text-xs">Duration</p>
                      <p className="text-gray-900 font-medium">
                        {formatDuration(event.startTime, event.endTime)}
                      </p>
                    </div>
                  </div>

                  {/* Reminder */}
                  {event.reminderTime && (
                    <div className="flex items-center gap-2 text-sm">
                      <div className="p-1.5 bg-amber-100 rounded-lg">
                        <Bell className="w-3.5 h-3.5 text-amber-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-xs">Reminder</p>
                        <p className="text-gray-900 font-medium">
                          {formatDateTime(event.reminderTime)}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tags */}
                {(isUpcoming || isPast) && (
                  <div className="mt-3 flex gap-2">
                    {isUpcoming && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                        <Clock className="w-3 h-3" />
                        Upcoming
                      </span>
                    )}
                    {isPast && (
                      <span className="inline-flex items-center gap-1 px-2 py-1 bg-orange-100 text-orange-700 text-xs font-medium rounded-full">
                        <Clock className="w-3 h-3" />
                        Past Event
                      </span>
                    )}
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                {/* Status Dropdown */}
                <select
                  value={event.status}
                  onChange={(e) =>
                    onStatusChange(
                      event.id,
                      e.target.value as CalendarEventStatus
                    )
                  }
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg border ${currentStatus.bgColor} ${currentStatus.borderColor} ${currentStatus.color} focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer transition-colors`}
                >
                  {Object.values(CalendarEventStatus).map((status) => (
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
                          Edit Event
                        </button>
                        <button
                          onClick={() => {
                            onDelete(event.id);
                            setShowMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete Event
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

      {/* Progress Indicator for In Progress Events */}
      {event.status === CalendarEventStatus.IN_PROGRESS && (
        <div className="absolute bottom-0 left-0 w-full h-1 bg-gray-100 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-amber-400 to-amber-600 animate-pulse"
            style={{ width: "60%" }}
          />
        </div>
      )}
    </div>
  );
}
