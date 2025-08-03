package com.agendapulse.notification.service;

import com.agendapulse.notification.dto.NotificationDTO;
import com.agendapulse.notification.dto.NotificationRequest;
import com.agendapulse.notification.entity.Notification;
import com.agendapulse.notification.entity.UserNotificationPreference;
import com.agendapulse.notification.event.NotificationEvent;
import com.agendapulse.notification.repo.NotificationPreferenceRepository;
import com.agendapulse.notification.repo.NotificationRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
@Transactional
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final NotificationPreferenceRepository preferenceRepository;
    private final EmailService emailService;
    private final WebSocketService webSocketService;
    private final ObjectMapper objectMapper;

    @Async
    @Override
    public void processNotification(NotificationEvent event) {
        try {
            UserNotificationPreference preferences = preferenceRepository
                    .findById(event.getUserId())
                    .orElse(createDefaultPreferences(event.getUserId()));

            Notification notification = Notification.builder()
                    .userId(event.getUserId())
                    .type(event.getType())
                    .title(event.getTitle())
                    .message(event.getMessage())
                    .metadata(objectMapper.writeValueAsString(event.getMetadata()))
                    .build();

            notification = notificationRepository.save(notification);

            if (preferences.getEmailEnabled() && shouldSendEmail(event.getType(), preferences)) {
                sendEmailNotification(notification);
            }

            if (preferences.getWebsocketEnabled()) {
                sendWebSocketNotification(notification);
            }

            notification.setChannel(Notification.NotificationChannel.IN_APP);
            notificationRepository.save(notification);

        } catch (Exception e) {
            log.error("Error processing notification: {}", e.getMessage(), e);
        }
    }

    private void sendEmailNotification(Notification notification) {
        try {
            notification.setChannel(Notification.NotificationChannel.EMAIL);
            emailService.sendNotificationEmail(notification);
            notification.setStatus(Notification.NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
        } catch (Exception e) {
            log.error("Failed to send email notification: {}", e.getMessage());
            notification.setStatus(Notification.NotificationStatus.FAILED);
        }
        notificationRepository.save(notification);
    }

    private void sendWebSocketNotification(Notification notification) {
        try {
            notification.setChannel(Notification.NotificationChannel.WEBSOCKET);
            webSocketService.sendNotification(notification);
            notification.setStatus(Notification.NotificationStatus.SENT);
            notification.setSentAt(LocalDateTime.now());
        } catch (Exception e) {
            log.error("Failed to send websocket notification: {}", e.getMessage());
            notification.setStatus(Notification.NotificationStatus.FAILED);
        }
        notificationRepository.save(notification);
    }

    @Override
    public NotificationDTO createNotification(NotificationRequest request) {
        Notification notification = Notification.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .title(request.getTitle())
                .message(request.getMessage())
                .channel(Notification.NotificationChannel.IN_APP)
                .build();

        if (request.getMetadata() != null) {
            try {
                notification.setMetadata(objectMapper.writeValueAsString(request.getMetadata()));
            } catch (Exception e) {
                log.error("Error serializing metadata: {}", e.getMessage());
            }
        }

        notification = notificationRepository.save(notification);

        processNotification(NotificationEvent.builder()
                .userId(request.getUserId())
                .type(request.getType())
                .title(request.getTitle())
                .message(request.getMessage())
                .metadata(request.getMetadata())
                .build());

        return NotificationDTO.from(notification);
    }

    @Override
    public Page<NotificationDTO> getUserNotifications(UUID userId, Pageable pageable) {
        return notificationRepository.findByUserIdOrderByCreatedAtDesc(userId, pageable)
                .map(NotificationDTO::from);
    }

    @Override
    public List<NotificationDTO> getUnreadNotifications(UUID userId) {
        return notificationRepository.findUnreadByUserId(userId).stream()
                .map(NotificationDTO::from)
                .toList();
    }

    @Override
    public Long getUnreadCount(UUID userId) {
        return notificationRepository.countUnreadByUserId(userId);
    }

    @Override
    public void markAsRead(UUID notificationId) {
        notificationRepository.updateStatusAndReadAt(
                notificationId,
                Notification.NotificationStatus.READ,
                LocalDateTime.now()
        );
    }

    @Override
    public void markAllAsRead(UUID userId) {
        notificationRepository.markAllAsReadForUser(userId);
    }

    private boolean shouldSendEmail(Notification.NotificationType type, UserNotificationPreference preferences) {
        return switch (type) {
            case TASK_CREATED, TASK_UPDATED, TASK_DELETED, TASK_ASSIGNED, TASK_DUE_SOON ->
                    preferences.getTaskNotifications();
            case CALENDAR_EVENT_CREATED, CALENDAR_EVENT_UPDATED, CALENDAR_EVENT_REMINDER, CALENDAR_EVENT_CANCELLED ->
                    preferences.getCalendarNotifications();
        };
    }

    private UserNotificationPreference createDefaultPreferences(UUID userId) {
        UserNotificationPreference preferences = UserNotificationPreference.builder()
                .userId(userId)
                .build();
        return preferenceRepository.save(preferences);
    }
}