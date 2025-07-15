package com.agendapulse.common.model.calendar;

import java.time.LocalDateTime;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateCalendarEventRequest(
    @NotBlank(message = "Title is required")
    String title,

    String description,

    @NotNull(message = "Start time is required")
    LocalDateTime startTime,

    @NotNull(message = "End time is required")
    LocalDateTime endTime,
    
    LocalDateTime reminderTime
) {}
