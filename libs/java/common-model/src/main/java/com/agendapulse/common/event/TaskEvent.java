package com.agendapulse.common.event;

import java.time.LocalDateTime;

public record TaskEvent(
    Long taskId,
    Long userId,
    String eventType,
    LocalDateTime timestamp,
    TaskEventData data
) {
    public static TaskEvent created(Long taskId, Long userId, TaskEventData data) {
        return new TaskEvent(taskId, userId, "TASK_CREATED", LocalDateTime.now(), data);
    }
    
    public static TaskEvent updated(Long taskId, Long userId, TaskEventData data) {
        return new TaskEvent(taskId, userId, "TASK_UPDATED", LocalDateTime.now(), data);
    }
    
    public static TaskEvent completed(Long taskId, Long userId, TaskEventData data) {
        return new TaskEvent(taskId, userId, "TASK_COMPLETED", LocalDateTime.now(), data);
    }
}