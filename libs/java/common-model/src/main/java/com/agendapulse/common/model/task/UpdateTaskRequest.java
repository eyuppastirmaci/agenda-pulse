package com.agendapulse.common.model.task;

import jakarta.validation.constraints.Size;
import java.time.LocalDateTime;

public record UpdateTaskRequest(
    @Size(min = 1, max = 200, message = "Title must be between 1 and 200 characters")
    String title,
    
    @Size(max = 1000, message = "Description must not exceed 1000 characters")
    String description,
    
    LocalDateTime dueDate,
    
    TaskStatus status
) {}
