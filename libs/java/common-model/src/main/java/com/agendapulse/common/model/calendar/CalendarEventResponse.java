package com.agendapulse.common.model.calendar;

import java.time.LocalDateTime;

public record CalendarEventResponse (
    Long id,
    String title,
    String description,
    LocalDateTime startTime,
    LocalDateTime endTime,
    LocalDateTime reminderTime,
    CalendarEventStatus status,
    Long userId,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}
