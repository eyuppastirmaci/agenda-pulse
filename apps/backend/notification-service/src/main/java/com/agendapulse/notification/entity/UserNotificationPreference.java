package com.agendapulse.notification.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Entity
@Table(name = "user_notification_preferences")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserNotificationPreference {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "email_enabled")
    @Builder.Default
    private Boolean emailEnabled = true;

    @Column(name = "websocket_enabled")
    @Builder.Default
    private Boolean websocketEnabled = true;

    @Column(name = "task_notifications")
    @Builder.Default
    private Boolean taskNotifications = true;

    @Column(name = "calendar_notifications")
    @Builder.Default
    private Boolean calendarNotifications = true;

    @Column(name = "reminder_minutes_before")
    @Builder.Default
    private Integer reminderMinutesBefore = 15;
}