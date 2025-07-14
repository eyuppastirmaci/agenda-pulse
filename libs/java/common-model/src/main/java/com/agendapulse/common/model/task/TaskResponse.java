package com.agendapulse.common.model.task;

import java.time.LocalDateTime;

public record TaskResponse(
    Long id,
    String title,
    String description,
    LocalDateTime dueDate,
    TaskStatus status,
    Long userId,
    LocalDateTime createdAt,
    LocalDateTime updatedAt
) {}