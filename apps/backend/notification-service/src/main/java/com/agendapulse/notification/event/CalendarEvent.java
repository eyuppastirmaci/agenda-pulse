package com.agendapulse.notification.event;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CalendarEvent {
    private UUID id;
    private UUID userId;
    private String title;
    private String description;
    private CalendarEventType eventType;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private String location;
    private List<UUID> attendees;
    private Boolean isAllDay;
    private Integer reminderMinutesBefore;

    public enum CalendarEventType {
        CREATED,
        UPDATED,
        DELETED,
        REMINDER,
        CANCELLED
    }
}