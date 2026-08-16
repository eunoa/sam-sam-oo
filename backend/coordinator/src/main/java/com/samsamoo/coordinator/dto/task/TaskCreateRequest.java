package com.samsamoo.coordinator.dto.task;

import java.time.LocalDateTime;

public class TaskCreateRequest {
    private String title;
    private String description;
    private Long assigneeId;
    private LocalDateTime deadline;

    public TaskCreateRequest() {
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

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }

}
