package com.agendapulse.notification.service.impl;

import com.agendapulse.notification.entity.Notification;
import com.agendapulse.notification.service.EmailService;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.thymeleaf.context.Context;
import org.thymeleaf.spring6.SpringTemplateEngine;

import java.util.UUID;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailServiceImpl implements EmailService {

    private final JavaMailSender mailSender;
    private final SpringTemplateEngine templateEngine;

    @Value("${notification.email.from}")
    private String fromEmail;

    @Value("${notification.email.from-name}")
    private String fromName;

    @Override
    @Async
    public void sendNotificationEmail(Notification notification) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            String userEmail = getUserEmail(notification.getUserId());

            helper.setTo(userEmail);
            helper.setFrom(fromEmail, fromName);
            helper.setSubject(notification.getTitle());

            Context context = new Context();
            context.setVariable("title", notification.getTitle());
            context.setVariable("message", notification.getMessage());
            context.setVariable("type", notification.getType());

            String template = getEmailTemplate(notification.getType());
            String htmlContent = templateEngine.process(template, context);

            helper.setText(htmlContent, true);

            mailSender.send(message);
            log.info("Email sent successfully to user: {}", notification.getUserId());

        } catch (Exception e) {
            log.error("Failed to send email: {}", e.getMessage(), e);
            throw new RuntimeException("Email sending failed", e);
        }
    }

    private String getEmailTemplate(Notification.NotificationType type) {
        return switch (type) {
            case TASK_CREATED, TASK_UPDATED, TASK_DELETED, TASK_ASSIGNED, TASK_DUE_SOON ->
                    "email/task-notification";
            case CALENDAR_EVENT_CREATED, CALENDAR_EVENT_UPDATED, CALENDAR_EVENT_REMINDER, CALENDAR_EVENT_CANCELLED ->
                    "email/calendar-notification";
        };
    }

    private String getUserEmail(UUID userId) {
        return "user@example.com";
    }
}