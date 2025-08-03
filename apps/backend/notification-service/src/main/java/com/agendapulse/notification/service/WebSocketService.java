package com.agendapulse.notification.service;

import com.agendapulse.notification.entity.Notification;

public interface WebSocketService {

    /**
     * Sends a notification to a user via WebSocket.
     * @param notification The notification object to send.
     */
    void sendNotification(Notification notification);

}