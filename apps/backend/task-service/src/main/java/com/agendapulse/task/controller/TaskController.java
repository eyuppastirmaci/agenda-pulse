package com.agendapulse.task.controller;

import com.agendapulse.common.model.task.*;
import com.agendapulse.task.domain.TaskStatus;
import com.agendapulse.task.service.TaskService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {
    
    private final TaskService taskService;
    
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TaskResponse createTask(
            @Valid @RequestBody CreateTaskRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        return taskService.createTask(request, userId);
    }
    
    @GetMapping
    public Page<TaskResponse> getTasks(
            @RequestHeader("X-User-Id") Long userId,
            @RequestParam(required = false) TaskStatus status,
            @PageableDefault(size = 20) Pageable pageable) {
        return taskService.getTasks(userId, status, pageable);
    }
    
    @GetMapping("/{taskId}")
    public TaskResponse getTask(
            @PathVariable Long taskId,
            @RequestHeader("X-User-Id") Long userId) {
        return taskService.getTask(taskId, userId);
    }
    
    @PutMapping("/{taskId}")
    public TaskResponse updateTask(
            @PathVariable Long taskId,
            @Valid @RequestBody UpdateTaskRequest request,
            @RequestHeader("X-User-Id") Long userId) {
        return taskService.updateTask(taskId, request, userId);
    }
    
    @DeleteMapping("/{taskId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTask(
            @PathVariable Long taskId,
            @RequestHeader("X-User-Id") Long userId) {
        taskService.deleteTask(taskId, userId);
    }
}