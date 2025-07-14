package com.agendapulse.common.event;

import com.agendapulse.common.model.task.TaskStatus;
import java.time.LocalDateTime;

public record TaskEventData(
    String title,
    String description,
    LocalDateTime dueDate,
    TaskStatus status
) {}