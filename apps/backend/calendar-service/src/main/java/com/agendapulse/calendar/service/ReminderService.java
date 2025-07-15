package com.agendapulse.calendar.service;

import com.agendapulse.calendar.repo.CalendarEventRepository;
import com.agendapulse.common.event.CalendarEvent;
import com.agendapulse.common.event.CalendarEventData;
import com.agendapulse.calendar.domain.CalendarEventEntity;
import com.agendapulse.calendar.kafka.CalendarEventPublisher;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class ReminderService {

    private final CalendarEventRepository calendarEventRepository;
    private final CalendarEventPublisher eventPublisher;

    @Scheduled(fixedRate = 60000)
    @Transactional
    public void checkAndSendReminders() {
        LocalDateTime now = LocalDateTime.now();
        List<CalendarEventEntity> eventsNeedingReminder = calendarEventRepository.findEventsNeedingReminder(now);

        log.info("Found {} events needing reminders", eventsNeedingReminder.size());

        for (CalendarEventEntity event : eventsNeedingReminder) {
            sendReminder(event);
            event.setReminderSent(true);
            calendarEventRepository.save(event);
        }
    }

    private void sendReminder(CalendarEventEntity event) {
        log.info("Sending reminder for event: {} at {}", event.getTitle(), event.getReminderTime());

        CalendarEventData eventData = new CalendarEventData(
                event.getTitle(),
                event.getDescription(),
                event.getStartTime(),
                event.getEndTime(),
                event.getReminderTime(),
                com.agendapulse.common.model.calendar.CalendarEventStatus.valueOf(event.getStatus().name())
        );

        eventPublisher.publishCalendarEventReminder(CalendarEvent.reminder(event.getId(), event.getUserId(), eventData));
    }
}