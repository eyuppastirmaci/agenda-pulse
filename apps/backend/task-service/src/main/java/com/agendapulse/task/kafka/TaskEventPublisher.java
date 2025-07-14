package com.agendapulse.task.kafka;

import com.agendapulse.common.event.TaskEvent;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class TaskEventPublisher {
    
    private final KafkaTemplate<String, TaskEvent> kafkaTemplate;
    
    public void publishTaskCreated(TaskEvent event) {
        log.info("Publishing task created event: {}", event);
        kafkaTemplate.send("task.created", event);
    }
    
    public void publishTaskUpdated(TaskEvent event) {
        log.info("Publishing task updated event: {}", event);
        kafkaTemplate.send("task.updated", event);
    }
    
    public void publishTaskCompleted(TaskEvent event) {
        log.info("Publishing task completed event: {}", event);
        kafkaTemplate.send("task.completed", event);
    }
}
