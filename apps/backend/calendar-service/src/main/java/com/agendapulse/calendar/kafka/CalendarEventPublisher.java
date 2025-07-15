package com.agendapulse.calendar.kafka;

import com.agendapulse.common.event.CalendarEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class CalendarEventPublisher {

    private final KafkaTemplate<String, CalendarEvent> kafkaTemplate;

    public void publishCalendarEventCreated(CalendarEvent event) {
        log.info("Publishing calendar event created: {}", event);
        kafkaTemplate.send("calendar.event.created", event);
    }

    public void publishCalendarEventUpdated(CalendarEvent event) {
        log.info("Publishing calendar event updated: {}", event);
        kafkaTemplate.send("calendar.event.update", event);
    }

    public void publishCalendarEventReminder(CalendarEvent event) {
        log.info("Publishing calendar event reminder: {}", event);
        kafkaTemplate.send("calender.event.reminder", event);
    }

    public void publishCalendarEventCompleted(CalendarEvent event) {
        log.info("Publishing calendar event completed: {}", event);
        kafkaTemplate.send("calendar.event.completed", event);
    }

}
