package com.samsamoo.coordinator.dto.task;

import com.samsamoo.coordinator.entity.enums.TaskStatus;

import java.time.LocalDateTime;

public class TaskResponse {

    private Long taskId;
    private Long projectId;
    private String title;
    private String description;
    private Long assigneeId;
    private String assigneeName;
    private TaskStatus status;
    private LocalDateTime deadline;
    private LocalDateTime createdAt;

    public TaskResponse(
            Long taskId,
            Long projectId,
            String title,
            String description,
            Long assigneeId,
            String assigneeName,
            TaskStatus status,
            LocalDateTime deadline,
            LocalDateTime createdAt) {

        this.taskId = taskId;
        this.projectId = projectId;
        this.title = title;
        this.description = description;
        this.assigneeId = assigneeId;
        this.assigneeName = assigneeName;
        this.status = status;
        this.deadline = deadline;
        this.createdAt = createdAt;
    }

    public Long getTaskId() {
        return taskId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public String getAssigneeName() {
        return assigneeName;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}