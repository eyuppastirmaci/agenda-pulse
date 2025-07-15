package com.agendapulse.calendar.repo;

import com.agendapulse.calendar.domain.CalendarEventEntity;
import com.agendapulse.calendar.domain.CalendarEventStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface CalendarEventRepository extends JpaRepository<CalendarEventEntity, Long> {
    Page<CalendarEventEntity> findByUserId(Long userId, Pageable pageable);

    Page<CalendarEventEntity> findByUserIdAndStatus(Long userId, CalendarEventStatus status, Pageable pageable);

    Optional<CalendarEventEntity> findByIdAndUserId(Long id, Long userId);

    @Query("SELECT e FROM CalendarEventEntity e WHERE e.reminderTime <= :now AND e.reminderSent = false AND e.status = 'SCHEDULED'")
    List<CalendarEventEntity> findEventsNeedingReminder(@Param("now") LocalDateTime now);

    @Query("SELECT e FROM CalendarEventEntity e WHERE e.userId = :userId AND e.startTime BETWEEN :start AND :end")
    List<CalendarEventEntity> findEventsBetween(@Param("userId") Long userId, @Param("start") LocalDateTime start, @Param("end") LocalDateTime end);
}
