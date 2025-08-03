package com.agendapulse.notification.service;

import com.agendapulse.notification.dto.NotificationDTO;
import com.agendapulse.notification.dto.NotificationRequest;
import com.agendapulse.notification.event.NotificationEvent;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;
import java.util.UUID;

public interface NotificationService {

    /**
     * Processes a notification event, saves the notification, and sends it via email and/or WebSocket based on user preferences.
     * @param event The notification event to process.
     */
    void processNotification(NotificationEvent event);

    /**
     * Creates a new notification based on the provided request and processes it.
     * @param request The NotificationRequest containing details for the new notification.
     * @return The created NotificationDTO.
     */
    NotificationDTO createNotification(NotificationRequest request);

    /**
     * Retrieves a paginated list of notifications for a specific user.
     * @param userId The unique identifier of the user.
     * @param pageable Pagination information.
     * @return A Page of NotificationDTOs for the specified user.
     */
    Page<NotificationDTO> getUserNotifications(UUID userId, Pageable pageable);

    /**
     * Retrieves a list of unread notifications for a specific user.
     * @param userId The unique identifier of the user.
     * @return A list of unread NotificationDTOs.
     */
    List<NotificationDTO> getUnreadNotifications(UUID userId);

    /**
     * Retrieves the count of unread notifications for a specific user.
     * @param userId The unique identifier of the user.
     * @return The number of unread notifications.
     */
    Long getUnreadCount(UUID userId);

    /**
     * Marks a specific notification as read.
     * @param notificationId The unique identifier of the notification to mark as read.
     */
    void markAsRead(UUID notificationId);

    /**
     * Marks all unread notifications for a specific user as read.
     * @param userId The unique identifier of the user.
     */
    void markAllAsRead(UUID userId);
}