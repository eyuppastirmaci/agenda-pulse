import apiClient from "@/lib/api-client";

export interface CalendarEvent {
  id: number;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  reminderTime?: string;
  status: CalendarEventStatus;
  userId: number;
  createdAt: string;
  updatedAt: string;
}

export enum CalendarEventStatus {
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface CreateCalendarEventRequest {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  reminderTime?: string;
}

export interface UpdateCalendarEventRequest {
  title?: string;
  description?: string;
  startTime?: string;
  endTime?: string;
  reminderTime?: string;
  status?: CalendarEventStatus;
}

export interface CalendarEventsResponse {
  content: CalendarEvent[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

export async function createCalendarEvent(data: CreateCalendarEventRequest): Promise<CalendarEvent> {
  const response = await apiClient.post("/api/calendar/events", data);
  return response.data;
}

export async function getCalendarEvents(
  page = 0,
  size = 20,
  status?: CalendarEventStatus
): Promise<CalendarEventsResponse> {
  const params = new URLSearchParams({
    page: page.toString(),
    size: size.toString(),
  });

  if (status) {
    params.append("status", status);
  }

  const response = await apiClient.get(`/api/calendar/events?${params}`);
  return response.data;
}

export async function getCalendarEvent(eventId: number): Promise<CalendarEvent> {
  const response = await apiClient.get(`/api/calendar/events/${eventId}`);
  return response.data;
}

export async function updateCalendarEvent(
  eventId: number,
  data: UpdateCalendarEventRequest
): Promise<CalendarEvent> {
  const response = await apiClient.put(`/api/calendar/events/${eventId}`, data);
  return response.data;
}

export async function deleteCalendarEvent(eventId: number): Promise<void> {
  await apiClient.delete(`/api/calendar/events/${eventId}`);
}

export async function getEventsInRange(
  start: string,
  end: string
): Promise<CalendarEvent[]> {
  const params = new URLSearchParams({
    start,
    end,
  });

  const response = await apiClient.get(`/api/calendar/events/range?${params}`);
  return response.data;
}