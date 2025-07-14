package com.agendapulse.task.service;

import com.agendapulse.common.event.TaskEvent;
import com.agendapulse.common.event.TaskEventData;
import com.agendapulse.common.model.task.*;
import com.agendapulse.task.domain.Task;
import com.agendapulse.task.domain.TaskStatus;
import com.agendapulse.task.kafka.TaskEventPublisher;
import com.agendapulse.task.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class TaskService {
    
    private final TaskRepository taskRepository;
    private final TaskEventPublisher eventPublisher;
    
    @Transactional
    public TaskResponse createTask(CreateTaskRequest request, Long userId) {
        Task task = Task.builder()
                .title(request.title())
                .description(request.description())
                .dueDate(request.dueDate())
                .status(TaskStatus.TODO)
                .userId(userId)
                .build();
        
        Task savedTask = taskRepository.save(task);
        
        // Publish event
        TaskEventData eventData = new TaskEventData(
                savedTask.getTitle(),
                savedTask.getDescription(),
                savedTask.getDueDate(),
                com.agendapulse.common.model.task.TaskStatus.TODO
        );
        eventPublisher.publishTaskCreated(TaskEvent.created(savedTask.getId(), userId, eventData));
        
        return toResponse(savedTask);
    }
    
    @Transactional
    public TaskResponse updateTask(Long taskId, UpdateTaskRequest request, Long userId) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        
        if (request.title() != null) {
            task.setTitle(request.title());
        }
        if (request.description() != null) {
            task.setDescription(request.description());
        }
        if (request.dueDate() != null) {
            task.setDueDate(request.dueDate());
        }
        if (request.status() != null) {
            task.setStatus(TaskStatus.valueOf(request.status().name()));
            
            // Publish completed event if status changed to COMPLETED
            if (request.status() == com.agendapulse.common.model.task.TaskStatus.COMPLETED) {
                TaskEventData eventData = new TaskEventData(
                        task.getTitle(),
                        task.getDescription(),
                        task.getDueDate(),
                        com.agendapulse.common.model.task.TaskStatus.COMPLETED
                );
                eventPublisher.publishTaskCompleted(TaskEvent.completed(task.getId(), userId, eventData));
            }
        }
        
        Task updatedTask = taskRepository.save(task);
        
        // Publish update event
        TaskEventData eventData = new TaskEventData(
                updatedTask.getTitle(),
                updatedTask.getDescription(),
                updatedTask.getDueDate(),
                com.agendapulse.common.model.task.TaskStatus.valueOf(updatedTask.getStatus().name())
        );
        eventPublisher.publishTaskUpdated(TaskEvent.updated(updatedTask.getId(), userId, eventData));
        
        return toResponse(updatedTask);
    }
    
    @Transactional(readOnly = true)
    public Page<TaskResponse> getTasks(Long userId, TaskStatus status, Pageable pageable) {
        Page<Task> tasks = status != null 
                ? taskRepository.findByUserIdAndStatus(userId, status, pageable)
                : taskRepository.findByUserId(userId, pageable);
        
        return tasks.map(this::toResponse);
    }
    
    @Transactional(readOnly = true)
    public TaskResponse getTask(Long taskId, Long userId) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        return toResponse(task);
    }
    
    @Transactional
    public void deleteTask(Long taskId, Long userId) {
        Task task = taskRepository.findByIdAndUserId(taskId, userId)
                .orElseThrow(() -> new IllegalArgumentException("Task not found"));
        taskRepository.delete(task);
    }
    
    private TaskResponse toResponse(Task task) {
        return new TaskResponse(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                com.agendapulse.common.model.task.TaskStatus.valueOf(task.getStatus().name()),
                task.getUserId(),
                task.getCreatedAt(),
                task.getUpdatedAt()
        );
    }
}