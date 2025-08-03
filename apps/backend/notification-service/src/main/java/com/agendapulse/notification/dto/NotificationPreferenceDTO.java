package com.agendapulse.notification.dto;

import com.agendapulse.notification.entity.UserNotificationPreference;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class NotificationPreferenceDTO {
    private UUID userId;
    private Boolean emailEnabled;
    private Boolean websocketEnabled;
    private Boolean taskNotifications;
    private Boolean calendarNotifications;
    private Integer reminderMinutesBefore;

    public static NotificationPreferenceDTO from(UserNotificationPreference preference) {
        return NotificationPreferenceDTO.builder()
                .userId(preference.getUserId())
                .emailEnabled(preference.getEmailEnabled())
                .websocketEnabled(preference.getWebsocketEnabled())
                .taskNotifications(preference.getTaskNotifications())
                .calendarNotifications(preference.getCalendarNotifications())
                .reminderMinutesBefore(preference.getReminderMinutesBefore())
                .build();
    }
}