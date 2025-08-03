package com.agendapulse.notification.websocket;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import javax.crypto.SecretKey;
import java.io.IOException;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@Slf4j
public class NotificationWebSocketHandler extends TextWebSocketHandler {

    private final Map<String, WebSocketSession> userSessions = new ConcurrentHashMap<>();
    private final SecretKey key;

    public NotificationWebSocketHandler(@Value("${jwt.secret}") String jwtSecret) {
        this.key = Keys.hmacShaKeyFor(jwtSecret.getBytes(StandardCharsets.UTF_8));
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String userId = extractUserIdFromSession(session);
        if (userId != null) {
            userSessions.put(userId, session);
            log.info("WebSocket connection established for user: {}", userId);

            // Send welcome message
            session.sendMessage(new TextMessage("{\"type\":\"CONNECTION\",\"message\":\"Connected to notification service\"}"));
        } else {
            log.warn("Unauthorized WebSocket connection attempt");
            session.close();
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        String userId = extractUserIdFromSession(session);
        if (userId != null) {
            userSessions.remove(userId);
            log.info("WebSocket connection closed for user: {}", userId);
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        // Handle incoming messages if needed (e.g., heartbeat)
        String payload = message.getPayload();
        log.debug("Received message: {}", payload);

        // Echo back heartbeat
        if (payload.contains("PING")) {
            session.sendMessage(new TextMessage("{\"type\":\"PONG\"}"));
        }
    }

    public void sendToUser(String userId, String message) {
        WebSocketSession session = userSessions.get(userId);
        if (session != null && session.isOpen()) {
            try {
                session.sendMessage(new TextMessage(message));
                log.debug("Message sent to user {}: {}", userId, message);
            } catch (IOException e) {
                log.error("Failed to send message to user {}: {}", userId, e.getMessage());
                userSessions.remove(userId);
            }
        } else {
            log.debug("No active session for user: {}", userId);
        }
    }

    public void broadcast(String message) {
        userSessions.values().parallelStream()
                .filter(WebSocketSession::isOpen)
                .forEach(session -> {
                    try {
                        session.sendMessage(new TextMessage(message));
                    } catch (IOException e) {
                        log.error("Failed to broadcast message: {}", e.getMessage());
                    }
                });
    }

    private String extractUserIdFromSession(WebSocketSession session) {
        try {
            // Extract JWT token from query parameter or header
            String token = extractToken(session);
            if (token != null) {
                Claims claims = Jwts.parser()
                        .verifyWith(key)
                        .build()
                        .parseSignedClaims(token)
                        .getPayload();
                return claims.getSubject();
            }
        } catch (Exception e) {
            log.error("Failed to extract user ID from session: {}", e.getMessage());
        }
        return null;
    }

    private String extractToken(WebSocketSession session) {
        // Try to get token from query parameter
        String query = session.getUri().getQuery();
        if (query != null && query.contains("token=")) {
            String[] params = query.split("&");
            for (String param : params) {
                if (param.startsWith("token=")) {
                    return param.substring(6);
                }
            }
        }

        // Try to get token from header
        String authHeader = session.getHandshakeHeaders().getFirst("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            return authHeader.substring(7);
        }

        return null;
    }
}