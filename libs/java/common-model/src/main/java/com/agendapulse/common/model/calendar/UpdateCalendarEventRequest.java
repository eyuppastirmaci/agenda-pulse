package com.agendapulse.common.model.calendar;

import java.time.LocalDateTime;

public record UpdateCalendarEventRequest(
    String title,
    String description,
    LocalDateTime startTime,
    LocalDateTime endTime,
    LocalDateTime reminderTime,
    CalendarEventStatus status
) {}
