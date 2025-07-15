package com.agendapulse.common.event;

import java.time.LocalDateTime;

import com.agendapulse.common.model.calendar.CalendarEventStatus;

public record CalendarEventData(
    String title,
    String description,
    LocalDateTime startTime,
    LocalDateTime endTime,
    LocalDateTime reminderTime,
    CalendarEventStatus status
) {}
