"use client";

import { useState, useEffect } from "react";
import {
  CalendarEvent,
  CalendarEventStatus,
  getCalendarEvents,
  updateCalendarEvent,
  deleteCalendarEvent,
} from "../api";
import CalendarEventItem from "./CalendarEventItem";
import CreateCalendarEventModal from "./CreateCalendarEventModal";
import { 
  Calendar, 
  Plus, 
  Filter, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Play,
  ChevronLeft,
  ChevronRight,
  CalendarDays
} from "lucide-react";

export default function CalendarEventList() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<CalendarEventStatus | undefined>(undefined);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [showCreateModal, setShowCreateModal] = useState(false);

  useEffect(() => {
    loadEvents();
  }, [page, filter]);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const response = await getCalendarEvents(page, 20, filter);
      setEvents(response.content);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error("Failed to load calendar events:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (
    eventId: number,
    status: CalendarEventStatus
  ) => {
    try {
      const updated = await updateCalendarEvent(eventId, { status });
      setEvents(events.map((e) => (e.id === eventId ? updated : e)));
    } catch (error) {
      console.error("Failed to update calendar event:", error);
    }
  };

  const handleDelete = async (eventId: number) => {
    if (!confirm("Are you sure you want to delete this calendar event?")) return;

    try {
      await deleteCalendarEvent(eventId);
      setEvents(events.filter((e) => e.id !== eventId));
    } catch (error) {
      console.error("Failed to delete calendar event:", error);
    }
  };

  const handleEventCreated = (newEvent: CalendarEvent) => {
    setEvents([newEvent, ...events]);
    setShowCreateModal(false);
  };

  const filterButtons = [
    { label: "All Events", value: undefined, icon: CalendarDays },
    { label: "Scheduled", value: CalendarEventStatus.SCHEDULED, icon: Clock },
    { label: "In Progress", value: CalendarEventStatus.IN_PROGRESS, icon: Play },
    { label: "Completed", value: CalendarEventStatus.COMPLETED, icon: CheckCircle2 },
    { label: "Cancelled", value: CalendarEventStatus.CANCELLED, icon: XCircle },
  ];

  return (
    <div className="w-full">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Calendar className="w-7 h-7 text-indigo-600" />
            Calendar Events
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Schedule and manage your upcoming events
          </p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
        >
          <Plus className="w-5 h-5" />
          New Event
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
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                filter === btn.value
                  ? "bg-indigo-600 text-white shadow-md transform scale-105"
                  : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-200"
              }`}
            >
              <btn.icon className="w-4 h-4" />
              {btn.label}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-indigo-200 rounded-full"></div>
            <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin absolute inset-0"></div>
          </div>
          <p className="mt-4 text-gray-500">Loading calendar events...</p>
        </div>
      ) : events.length === 0 ? (
        <div className="text-center py-16 bg-gradient-to-br from-gray-50 to-indigo-50 rounded-xl border-2 border-dashed border-gray-200">
          <CalendarDays className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No events scheduled</h3>
          <p className="text-gray-500 mb-6">
            {filter ? "No events match the selected filter." : "Start planning by creating your first event!"}
          </p>
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Schedule Event
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {events.map((event, index) => (
            <div
              key={event.id}
              className="transform transition-all duration-300 animate-fadeInUp"
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              <CalendarEventItem
                event={event}
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
                      ? "bg-indigo-600 text-white"
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

      <CreateCalendarEventModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onEventCreated={handleEventCreated}
      />


    </div>
  );
}