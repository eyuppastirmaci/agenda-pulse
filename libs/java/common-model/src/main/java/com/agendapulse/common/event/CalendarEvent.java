package com.agendapulse.common.event;

import java.time.LocalDateTime;

public record CalendarEvent(
    Long eventId,
    Long userId,
    String eventType,
    LocalDateTime timestamp,
    CalendarEventData data
) {
    public static CalendarEvent created(Long eventId, Long userId, CalendarEventData data) {
        return new CalendarEvent(eventId, userId, "CALENDAR_EVENT_CREATED", LocalDateTime.now(), data);
    }

    public static CalendarEvent updated(Long eventId, Long userId, CalendarEventData data) {
        return new CalendarEvent(eventId, userId, "CALENDAR_EVENT_UPDATED", LocalDateTime.now(), data);
    }

    public static CalendarEvent reminder(Long eventId, Long userId, CalendarEventData data) {
        return new CalendarEvent(eventId, userId, "CALENDAR_EVENT_REMINDER", LocalDateTime.now(), data);
    }

    public static CalendarEvent completed(Long eventId, Long userId, CalendarEventData data) {
        return new CalendarEvent(eventId, userId, "CALENDAR_EVENT_COMPLETED", LocalDateTime.now(), data);
    }
}
