package com.agendapulse.notification.service.impl;

import com.agendapulse.notification.dto.NotificationPreferenceDTO;
import com.agendapulse.notification.entity.UserNotificationPreference;
import com.agendapulse.notification.repo.NotificationPreferenceRepository;
import com.agendapulse.notification.service.NotificationPreferenceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Transactional
public class NotificationPreferenceServiceImpl implements NotificationPreferenceService {

    private final NotificationPreferenceRepository repository;

    @Override
    public NotificationPreferenceDTO getPreferences(UUID userId) {
        return repository.findById(userId)
                .map(NotificationPreferenceDTO::from)
                .orElseGet(() -> createDefaultPreferences(userId));
    }

    @Override
    public NotificationPreferenceDTO updatePreferences(UUID userId, NotificationPreferenceDTO dto) {
        UserNotificationPreference preference = repository.findById(userId)
                .orElse(UserNotificationPreference.builder().userId(userId).build());

        if (dto.getEmailEnabled() != null) {
            preference.setEmailEnabled(dto.getEmailEnabled());
        }
        if (dto.getWebsocketEnabled() != null) {
            preference.setWebsocketEnabled(dto.getWebsocketEnabled());
        }
        if (dto.getTaskNotifications() != null) {
            preference.setTaskNotifications(dto.getTaskNotifications());
        }
        if (dto.getCalendarNotifications() != null) {
            preference.setCalendarNotifications(dto.getCalendarNotifications());
        }
        if (dto.getReminderMinutesBefore() != null) {
            preference.setReminderMinutesBefore(dto.getReminderMinutesBefore());
        }

        preference = repository.save(preference);
        return NotificationPreferenceDTO.from(preference);
    }

    private NotificationPreferenceDTO createDefaultPreferences(UUID userId) {
        UserNotificationPreference preference = UserNotificationPreference.builder()
                .userId(userId)
                .build();
        preference = repository.save(preference);
        return NotificationPreferenceDTO.from(preference);
    }
}