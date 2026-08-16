package com.samsamoo.coordinator.controller;

import com.samsamoo.coordinator.dto.task.TaskCreateRequest;
import com.samsamoo.coordinator.dto.task.TaskResponse;
import com.samsamoo.coordinator.dto.task.TaskUpdateRequest;
import com.samsamoo.coordinator.service.TaskService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class TaskController {

    private final TaskService taskService;

    public TaskController(TaskService taskService) {
        this.taskService = taskService;
    }

    // Task 생성
    @PostMapping("/projects/{projectId}/tasks")
    public TaskResponse createTask(
            @PathVariable Long projectId,
            @RequestBody TaskCreateRequest request) {

        return taskService.createTask(projectId, request);
    }

    // 프로젝트의 Task 목록 조회
    @GetMapping("/projects/{projectId}/tasks")
    public List<TaskResponse> getTasks(
            @PathVariable Long projectId) {

        return taskService.getTasks(projectId);
    }

    // Task 상세 조회
    @GetMapping("/tasks/{taskId}")
    public TaskResponse getTask(
            @PathVariable Long taskId) {

        return taskService.getTask(taskId);
    }

    // Task 수정
    @PatchMapping("/tasks/{taskId}")
    public TaskResponse updateTask(
            @PathVariable Long taskId,
            @RequestBody TaskUpdateRequest request) {

        return taskService.updateTask(taskId, request);
    }

    // Task 삭제
    @DeleteMapping("/tasks/{taskId}")
    public void deleteTask(
            @PathVariable Long taskId) {

        taskService.deleteTask(taskId);
    }
}