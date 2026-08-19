package com.samsamoo.coordinator.dto.task;

import com.samsamoo.coordinator.entity.enums.TaskStatus;

import java.time.LocalDateTime;

public class TaskUpdateRequest {

    private Long assigneeId;
    private TaskStatus status;
    private LocalDateTime deadline;

    public TaskUpdateRequest() {
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }

    public void setStatus(TaskStatus status) {
        this.status = status;
    }

    public void setDeadline(LocalDateTime deadline) {
        this.deadline = deadline;
    }
}