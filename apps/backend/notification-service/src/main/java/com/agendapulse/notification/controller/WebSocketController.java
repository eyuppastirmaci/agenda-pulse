package com.agendapulse.notification.controller;

import com.agendapulse.notification.websocket.NotificationWebSocketHandler;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/v1/websocket")
@RequiredArgsConstructor
public class WebSocketController {

    private final NotificationWebSocketHandler webSocketHandler;

    @PostMapping("/test/{userId}")
    public ResponseEntity<Map<String, String>> sendTestNotification(
            @PathVariable String userId,
            @RequestBody Map<String, String> message) {

        String notification = String.format(
                "{\"type\":\"TEST\",\"title\":\"%s\",\"message\":\"%s\",\"timestamp\":\"%s\"}",
                message.getOrDefault("title", "Test Notification"),
                message.getOrDefault("message", "This is a test notification"),
                System.currentTimeMillis()
        );

        webSocketHandler.sendToUser(userId, notification);

        return ResponseEntity.ok(Map.of(
                "status", "sent",
                "userId", userId,
                "message", notification
        ));
    }

    @PostMapping("/broadcast")
    public ResponseEntity<Map<String, String>> broadcast(@RequestBody Map<String, String> message) {
        String notification = String.format(
                "{\"type\":\"BROADCAST\",\"title\":\"%s\",\"message\":\"%s\",\"timestamp\":\"%s\"}",
                message.getOrDefault("title", "System Announcement"),
                message.getOrDefault("message", "This is a broadcast message"),
                System.currentTimeMillis()
        );

        webSocketHandler.broadcast(notification);

        return ResponseEntity.ok(Map.of(
                "status", "broadcast sent",
                "message", notification
        ));
    }
}