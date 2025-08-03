package com.agendapulse.notification.repo;

import com.agendapulse.notification.entity.UserNotificationPreference;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface NotificationPreferenceRepository extends JpaRepository<UserNotificationPreference, UUID> {
}