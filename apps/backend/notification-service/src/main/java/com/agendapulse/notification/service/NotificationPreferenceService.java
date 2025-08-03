package com.agendapulse.notification.service;

import com.agendapulse.notification.dto.NotificationPreferenceDTO;

import java.util.UUID;

public interface NotificationPreferenceService {

    /**
     * Retrieves the notification preferences for a given user.
     * If no preferences are found, default preferences are created and returned.
     * @param userId The unique identifier of the user.
     * @return The NotificationPreferenceDTO object containing the user's preferences.
     */
    NotificationPreferenceDTO getPreferences(UUID userId);

    /**
     * Updates the notification preferences for a specific user.
     * @param userId The unique identifier of the user whose preferences are to be updated.
     * @param dto The NotificationPreferenceDTO containing the updated preference values.
     * @return The updated NotificationPreferenceDTO object.
     */
    NotificationPreferenceDTO updatePreferences(UUID userId, NotificationPreferenceDTO dto);
}