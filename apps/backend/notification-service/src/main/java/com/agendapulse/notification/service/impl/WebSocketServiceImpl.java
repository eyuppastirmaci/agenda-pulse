package com.agendapulse.notification.service.impl;

import com.agendapulse.notification.dto.NotificationDTO;
import com.agendapulse.notification.entity.Notification;
import com.agendapulse.notification.service.WebSocketService;
import com.agendapulse.notification.websocket.NotificationWebSocketHandler;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
@Slf4j
public class WebSocketServiceImpl implements WebSocketService {

    private final NotificationWebSocketHandler webSocketHandler;
    private final ObjectMapper objectMapper;

    @Override
    public void sendNotification(Notification notification) {
        try {
            NotificationDTO dto = NotificationDTO.from(notification);
            String message = objectMapper.writeValueAsString(dto);
            webSocketHandler.sendToUser(notification.getUserId().toString(), message);
            log.debug("WebSocket notification sent to user: {}", notification.getUserId());
        } catch (Exception e) {
            log.error("Failed to send WebSocket notification: {}", e.getMessage(), e);
            throw new RuntimeException("WebSocket notification failed", e);
        }
    }
}