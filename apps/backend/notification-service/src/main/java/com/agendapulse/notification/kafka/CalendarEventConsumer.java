package com.agendapulse.notification.kafka;

import com.agendapulse.notification.entity.Notification;
import com.agendapulse.notification.event.CalendarEvent;
import com.agendapulse.notification.event.NotificationEvent;
import com.agendapulse.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Component
@RequiredArgsConstructor
@Slf4j
public class CalendarEventConsumer {

    private final NotificationService notificationService;
    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' HH:mm");

    @KafkaListener(topics = "calendar-events", groupId = "notification-service-group")
    public void handleCalendarEvent(CalendarEvent event) {
        log.info("Received calendar event: {} for event: {}", event.getEventType(), event.getId());

        try {
            NotificationEvent notificationEvent = createNotificationEvent(event);
            if (notificationEvent != null) {
                notificationService.processNotification(notificationEvent);

                // Also notify attendees if applicable
                if (event.getAttendees() != null && !event.getAttendees().isEmpty()) {
                    notifyAttendees(event);
                }
            }
        } catch (Exception e) {
            log.error("Error processing calendar event: {}", e.getMessage(), e);
        }
    }

    private NotificationEvent createNotificationEvent(CalendarEvent event) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("eventId", event.getId());
        metadata.put("startTime", event.getStartTime());
        metadata.put("endTime", event.getEndTime());
        metadata.put("location", event.getLocation());
        metadata.put("isAllDay", event.getIsAllDay());

        String formattedTime = event.getStartTime() != null ?
                event.getStartTime().format(DATE_FORMATTER) : "";

        return switch (event.getEventType()) {
            case CREATED -> NotificationEvent.builder()
                    .userId(event.getUserId())
                    .type(Notification.NotificationType.CALENDAR_EVENT_CREATED)
                    .title("New Event Created")
                    .message(String.format("Event '%s' has been scheduled for %s.",
                            event.getTitle(), formattedTime))
                    .metadata(metadata)
                    .build();

            case UPDATED -> NotificationEvent.builder()
                    .userId(event.getUserId())
                    .type(Notification.NotificationType.CALENDAR_EVENT_UPDATED)
                    .title("Event Updated")
                    .message(String.format("Event '%s' has been updated.", event.getTitle()))
                    .metadata(metadata)
                    .build();

            case REMINDER -> NotificationEvent.builder()
                    .userId(event.getUserId())
                    .type(Notification.NotificationType.CALENDAR_EVENT_REMINDER)
                    .title("Event Reminder")
                    .message(String.format("Reminder: '%s' starts in %d minutes.",
                            event.getTitle(), event.getReminderMinutesBefore()))
                    .metadata(metadata)
                    .build();

            case CANCELLED -> NotificationEvent.builder()
                    .userId(event.getUserId())
                    .type(Notification.NotificationType.CALENDAR_EVENT_CANCELLED)
                    .title("Event Cancelled")
                    .message(String.format("Event '%s' has been cancelled.", event.getTitle()))
                    .metadata(metadata)
                    .build();

            case DELETED -> NotificationEvent.builder()
                    .userId(event.getUserId())
                    .type(Notification.NotificationType.CALENDAR_EVENT_CANCELLED)
                    .title("Event Deleted")
                    .message(String.format("Event '%s' has been deleted.", event.getTitle()))
                    .metadata(metadata)
                    .build();
        };
    }

    private void notifyAttendees(CalendarEvent event) {
        if (event.getAttendees() == null) return;

        event.getAttendees().stream()
                .filter(attendeeId -> !attendeeId.equals(event.getUserId()))
                .forEach(attendeeId -> {
                    NotificationEvent attendeeNotification = createAttendeeNotification(event, attendeeId);
                    if (attendeeNotification != null) {
                        notificationService.processNotification(attendeeNotification);
                    }
                });
    }

    private NotificationEvent createAttendeeNotification(CalendarEvent event, UUID attendeeId) {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("eventId", event.getId());
        metadata.put("organizerId", event.getUserId());
        metadata.put("startTime", event.getStartTime());
        metadata.put("location", event.getLocation());

        String formattedTime = event.getStartTime() != null ?
                event.getStartTime().format(DATE_FORMATTER) : "";

        return switch (event.getEventType()) {
            case CREATED -> NotificationEvent.builder()
                    .userId(attendeeId)
                    .type(Notification.NotificationType.CALENDAR_EVENT_CREATED)
                    .title("You've been invited to an event")
                    .message(String.format("You've been invited to '%s' on %s.",
                            event.getTitle(), formattedTime))
                    .metadata(metadata)
                    .build();

            case CANCELLED -> NotificationEvent.builder()
                    .userId(attendeeId)
                    .type(Notification.NotificationType.CALENDAR_EVENT_CANCELLED)
                    .title("Event Cancelled")
                    .message(String.format("The event '%s' you were invited to has been cancelled.",
                            event.getTitle()))
                    .metadata(metadata)
                    .build();

            default -> null;
        };
    }
}