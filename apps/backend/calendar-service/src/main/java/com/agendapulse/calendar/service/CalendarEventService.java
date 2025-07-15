package com.agendapulse.calendar.service;

import com.agendapulse.calendar.kafka.CalendarEventPublisher;
import com.agendapulse.calendar.repo.CalendarEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import com.agendapulse.common.event.CalendarEvent;
import com.agendapulse.common.event.CalendarEventData;
import com.agendapulse.common.model.calendar.*;
import com.agendapulse.calendar.domain.CalendarEventEntity;
import com.agendapulse.calendar.domain.CalendarEventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CalendarEventService {

    private final CalendarEventRepository calendarEventRepository;
    private final CalendarEventPublisher eventPublisher;

    @Transactional
    public CalendarEventResponse createCalendarEvent(CreateCalendarEventRequest request, Long userId) {
        // Validation
        if (request.endTime().isBefore(request.startTime())) {
            throw new IllegalArgumentException("End time cannot be before start time");
        }

        CalendarEventEntity calendarEvent = CalendarEventEntity.builder()
                .title(request.title())
                .description(request.description())
                .startTime(request.startTime())
                .endTime(request.endTime())
                .reminderTime(request.reminderTime())
                .status(CalendarEventStatus.SCHEDULED)
                .userId(userId)
                .reminderSent(false)
                .build();

        CalendarEventEntity savedEvent = calendarEventRepository.save(calendarEvent);

        // Publish event
        CalendarEventData eventData = new CalendarEventData(
                savedEvent.getTitle(),
                savedEvent.getDescription(),
                savedEvent.getStartTime(),
                savedEvent.getEndTime(),
                savedEvent.getReminderTime(),
                com.agendapulse.common.model.calendar.CalendarEventStatus.SCHEDULED
        );
        eventPublisher.publishCalendarEventCreated(CalendarEvent.created(savedEvent.getId(), userId, eventData));

        return toResponse(savedEvent);
    }

    @Transactional
    public CalendarEventResponse updateCalendarEvent(Long eventId, UpdateCalendarEventRequest request, Long userId) {
        CalendarEventEntity calendarEvent = calendarEventRepository.findByIdAndUserId(eventId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Calendar event not found"));

        if (request.title() != null) {
            calendarEvent.setTitle(request.title());
        }
        if (request.description() != null) {
            calendarEvent.setDescription(request.description());
        }
        if (request.startTime() != null) {
            calendarEvent.setStartTime(request.startTime());
        }
        if (request.endTime() != null) {
            calendarEvent.setEndTime(request.endTime());
        }
        if (request.reminderTime() != null) {
            calendarEvent.setReminderTime(request.reminderTime());
        }
        if (request.status() != null) {
            calendarEvent.setStatus(CalendarEventStatus.valueOf(request.status().name()));

            // Publish completed event if status changed to COMPLETED
            if (request.status() == com.agendapulse.common.model.calendar.CalendarEventStatus.COMPLETED) {
                CalendarEventData eventData = new CalendarEventData(
                        calendarEvent.getTitle(),
                        calendarEvent.getDescription(),
                        calendarEvent.getStartTime(),
                        calendarEvent.getEndTime(),
                        calendarEvent.getReminderTime(),
                        com.agendapulse.common.model.calendar.CalendarEventStatus.COMPLETED
                );
                eventPublisher.publishCalendarEventCompleted(CalendarEvent.completed(calendarEvent.getId(), userId, eventData));
            }
        }

        // Validation after update
        if (calendarEvent.getEndTime().isBefore(calendarEvent.getStartTime())) {
            throw new IllegalArgumentException("End time cannot be before start time");
        }

        CalendarEventEntity updatedEvent = calendarEventRepository.save(calendarEvent);

        // Publish update event
        CalendarEventData eventData = new CalendarEventData(
                updatedEvent.getTitle(),
                updatedEvent.getDescription(),
                updatedEvent.getStartTime(),
                updatedEvent.getEndTime(),
                updatedEvent.getReminderTime(),
                com.agendapulse.common.model.calendar.CalendarEventStatus.valueOf(updatedEvent.getStatus().name())
        );
        eventPublisher.publishCalendarEventUpdated(CalendarEvent.updated(updatedEvent.getId(), userId, eventData));

        return toResponse(updatedEvent);
    }

    @Transactional(readOnly = true)
    public Page<CalendarEventResponse> getCalendarEvents(Long userId, com.agendapulse.common.model.calendar.CalendarEventStatus status, Pageable pageable) {
        Page<CalendarEventEntity> events = status != null
                ? calendarEventRepository.findByUserIdAndStatus(userId, CalendarEventStatus.valueOf(status.name()), pageable)
                : calendarEventRepository.findByUserId(userId, pageable);

        return events.map(this::toResponse);
    }

    @Transactional(readOnly = true)
    public CalendarEventResponse getCalendarEvent(Long eventId, Long userId) {
        CalendarEventEntity calendarEvent = calendarEventRepository.findByIdAndUserId(eventId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Calendar event not found"));
        return toResponse(calendarEvent);
    }

    @Transactional
    public void deleteCalendarEvent(Long eventId, Long userId) {
        CalendarEventEntity calendarEvent = calendarEventRepository.findByIdAndUserId(eventId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Calendar event not found"));
        calendarEventRepository.delete(calendarEvent);
    }

    @Transactional(readOnly = true)
    public List<CalendarEventResponse> getEventsBetween(Long userId, LocalDateTime start, LocalDateTime end) {
        List<CalendarEventEntity> events = calendarEventRepository.findEventsBetween(userId, start, end);
        return events.stream().map(this::toResponse).toList();
    }

    private CalendarEventResponse toResponse(CalendarEventEntity calendarEvent) {
        return new CalendarEventResponse(
                calendarEvent.getId(),
                calendarEvent.getTitle(),
                calendarEvent.getDescription(),
                calendarEvent.getStartTime(),
                calendarEvent.getEndTime(),
                calendarEvent.getReminderTime(),
                com.agendapulse.common.model.calendar.CalendarEventStatus.valueOf(calendarEvent.getStatus().name()),
                calendarEvent.getUserId(),
                calendarEvent.getCreatedAt(),
                calendarEvent.getUpdatedAt()
        );
    }

}
