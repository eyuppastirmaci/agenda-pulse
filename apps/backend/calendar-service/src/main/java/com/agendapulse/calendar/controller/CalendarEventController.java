package com.agendapulse.calendar.controller;

import com.agendapulse.common.model.calendar.*;
import com.agendapulse.calendar.service.CalendarEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/calendar/events")
@RequiredArgsConstructor
public class CalendarEventController {

    private final CalendarEventService calendarEventService;

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CalendarEventResponse createCalendarEvent(
            @Valid @RequestBody CreateCalendarEventRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        return calendarEventService.createCalendarEvent(request, userId);
    }

    @GetMapping
    public Page<CalendarEventResponse> getCalendarEvents(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(required = false) CalendarEventStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        return calendarEventService.getCalendarEvents(userId, status, pageable);
    }

    @GetMapping("/{eventId}")
    public CalendarEventResponse getCalendarEvent(
            @PathVariable Long eventId,
            @RequestHeader("X-User-Id") Long userId) {
        return calendarEventService.getCalendarEvent(eventId, userId);
    }

    @PutMapping("/{eventId}")
    public CalendarEventResponse updateCalendarEvent(
            @PathVariable Long eventId,
            @Valid @RequestBody UpdateCalendarEventRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        return calendarEventService.updateCalendarEvent(eventId, request, userId);
    }

    @DeleteMapping("/{eventId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCalendarEvent(
            @PathVariable Long eventId,
            @RequestHeader("X-User-Id") Long userId) {
        calendarEventService.deleteCalendarEvent(eventId, userId);
    }

    @GetMapping("/range")
    public List<CalendarEventResponse> getEventsInRange(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime start,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime end) {
        return calendarEventService.getEventsBetween(userId, start, end);
    }
}