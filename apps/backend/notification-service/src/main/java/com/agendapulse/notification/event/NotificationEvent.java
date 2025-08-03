package com.agendapulse.notification.event;

import com.agendapulse.notification.entity.Notification;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationEvent {
    private UUID userId;
    private String title;
    private String message;
    private Notification.NotificationType type;
    private Object metadata;
}