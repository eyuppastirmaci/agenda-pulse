package com.agendapulse.notification.repo;

import com.agendapulse.notification.entity.Notification;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, UUID> {

    Page<Notification> findByUserIdOrderByCreatedAtDesc(UUID userId, Pageable pageable);

    Page<Notification> findByUserIdAndStatusOrderByCreatedAtDesc(
            UUID userId, Notification.NotificationStatus status, Pageable pageable);


    List<Notification> findByUserIdAndStatus(UUID userId, Notification.NotificationStatus status);

    /**
     * Finds a list of unread notifications for a given user.
     * @param userId The ID of the user.
     * @return A list of unread notifications.
     */
    @Query("SELECT n FROM Notification n WHERE n.userId = :userId AND n.readAt IS NULL")
    List<Notification> findUnreadByUserId(@Param("userId") UUID userId);

    /**
     * Counts the number of unread notifications for a given user.
     * @param userId The ID of the user.
     * @return The count of unread notifications.
     */
    @Query("SELECT COUNT(n) FROM Notification n WHERE n.userId = :userId AND n.readAt IS NULL")
    Long countUnreadByUserId(@Param("userId") UUID userId);

    /**
     * Updates the status and read timestamp of a specific notification.
     * @param id The ID of the notification to update.
     * @param status The new status of the notification.
     * @param readAt The timestamp when the notification was read.
     */
    @Modifying
    @Query("UPDATE Notification n SET n.status = :status, n.readAt = :readAt WHERE n.id = :id")
    void updateStatusAndReadAt(@Param("id") UUID id,
                               @Param("status") Notification.NotificationStatus status,
                               @Param("readAt") LocalDateTime readAt);

    /**
     * Marks all unread notifications for a given user as read.
     * @param userId The ID of the user.
     */
    @Modifying
    @Query("UPDATE Notification n SET n.readAt = CURRENT_TIMESTAMP WHERE n.userId = :userId AND n.readAt IS NULL")
    void markAllAsReadForUser(@Param("userId") UUID userId);

    /**
     * Finds a list of notifications by status, channel, and creation time before a specified time.
     * @param status The status of the notifications.
     * @param channel The channel of the notifications.
     * @param before The LocalDateTime before which the notifications were created.
     * @return A list of notifications matching the criteria.
     */
    List<Notification> findByStatusAndChannelAndCreatedAtBefore(
            Notification.NotificationStatus status,
            Notification.NotificationChannel channel,
            LocalDateTime before);
}