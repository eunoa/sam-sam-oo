package com.samsamoo.coordinator.dto.meeting;

public class AiTaskApproveRequest {
    private Long suggestionId;
    private Long assigneeId;

    public AiTaskApproveRequest() {
    }

    public Long getSuggestionId() {
        return suggestionId;
    }

    public void setSuggestionId(Long suggestionId) {
        this.suggestionId = suggestionId;
    }

    public Long getAssigneeId() {
        return assigneeId;
    }

    public void setAssigneeId(Long assigneeId) {
        this.assigneeId = assigneeId;
    }
}
