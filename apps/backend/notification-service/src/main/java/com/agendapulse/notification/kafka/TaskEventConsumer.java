package com.agendapulse.notification.kafka;

import com.agendapulse.notification.entity.Notification;
import com.agendapulse.notification.event.NotificationEvent;
import com.agendapulse.notification.event.TaskEvent;
import com.agendapulse.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.Map;

@Component
@RequiredArgsConstructor
@Slf4j
public class TaskEventConsumer {

    private final NotificationService notificationService;

    @KafkaListener(topics = "task-events", groupId = "notification-service-group")
    public void handleTaskEvent(TaskEvent event) {
        log.info("Received task event: {} for task: {}", event.getEventType(), event.getId());

        try {
            NotificationEvent notificationEvent = createNotificationEvent(event);
            if (notificationEvent != null) {
                notificationService.processNotification(notificationEvent);
            }
        } catch (Exception e) {
            log.error("Error processing task event: {}", e.getMessage(), e);
        }
    }

    private NotificationEvent createNotificationEvent(TaskEvent event) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("taskId", event.getId());
        metadata.put("priority", event.getPriority());
        metadata.put("dueDate", event.getDueDate());

        return switch (event.getEventType()) {
            case CREATED -> NotificationEvent.builder()
                    .userId(event.getUserId())
                    .type(Notification.NotificationType.TASK_CREATED)
                    .title("New Task Created")
                    .message(String.format("A new task '%s' has been created.", event.getTitle()))
                    .metadata(metadata)
                    .build();

            case UPDATED -> NotificationEvent.builder()
                    .userId(event.getUserId())
                    .type(Notification.NotificationType.TASK_UPDATED)
                    .title("Task Updated")
                    .message(String.format("Task '%s' has been updated.", event.getTitle()))
                    .metadata(metadata)
                    .build();

            case ASSIGNED -> {
                if (event.getAssignedTo() != null) {
                    metadata.put("assignedBy", event.getUserId());
                    yield NotificationEvent.builder()
                            .userId(event.getAssignedTo())
                            .type(Notification.NotificationType.TASK_ASSIGNED)
                            .title("Task Assigned to You")
                            .message(String.format("You have been assigned to task '%s'.", event.getTitle()))
                            .metadata(metadata)
                            .build();
                }
                yield null;
            }

            case DELETED -> NotificationEvent.builder()
                    .userId(event.getUserId())
                    .type(Notification.NotificationType.TASK_DELETED)
                    .title("Task Deleted")
                    .message(String.format("Task '%s' has been deleted.", event.getTitle()))
                    .metadata(metadata)
                    .build();

            case COMPLETED -> NotificationEvent.builder()
                    .userId(event.getUserId())
                    .type(Notification.NotificationType.TASK_UPDATED)
                    .title("Task Completed")
                    .message(String.format("Task '%s' has been marked as completed.", event.getTitle()))
                    .metadata(metadata)
                    .build();
        };
    }
}