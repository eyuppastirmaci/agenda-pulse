package com.agendapulse.notification.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class TaskEvent {
    private UUID id;
    private UUID userId;
    private String title;
    private String description;
    private TaskEventType eventType;
    private TaskPriority priority;
    private LocalDateTime dueDate;
    private UUID assignedTo;
    private String assignedToEmail;
    private String assignedToName;

    public enum TaskEventType {
        CREATED,
        UPDATED,
        DELETED,
        ASSIGNED,
        COMPLETED
    }

    public enum TaskPriority {
        LOW,
        MEDIUM,
        HIGH,
        URGENT
    }
}