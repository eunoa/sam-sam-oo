package com.samsamoo.coordinator.dto.meeting;

import com.samsamoo.coordinator.entity.enums.TaskStatus;

public class AiTaskApproveResponse {

    private Long taskId;
    private Long suggestionId;
    private String title;
    private Long assigneeId;
    private TaskStatus status;

    public AiTaskApproveResponse(Long taskId,
                                 Long suggestionId,
                                 String title,
                                 Long assigneeId,
                                 TaskStatus status) {
        this.taskId = taskId;
        this.suggestionId = suggestionId;
        this.title = title;
        this.assigneeId = assigneeId;
        this.status = status;
    }

    public Long getTaskId() {
        return taskId;
    }

    public Long getSuggestionId() {
        return suggestionId;
    }

    public String getTitle() {
        return title;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public TaskStatus getStatus() {
        return status;
    }
}