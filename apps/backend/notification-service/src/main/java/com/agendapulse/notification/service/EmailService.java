package com.agendapulse.notification.service;

import com.agendapulse.notification.entity.Notification;

public interface EmailService {

    /**
     * Sends a notification email to the user.
     * @param notification The notification object containing details for the email.
     */
    void sendNotificationEmail(Notification notification);

}