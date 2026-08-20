package com.samsamoo.coordinator.dto.meeting;

public class AiTaskSuggestionResponse {
    private Long suggestionId;
    private Long meetingId;
    private String content;
    private boolean approved;

    public AiTaskSuggestionResponse(Long suggestionId,
                                    Long meetingId,
                                    String content,
                                    Boolean approved){
        this.suggestionId = suggestionId;
        this.meetingId = meetingId;
        this.content = content;
        this.approved = approved;
    }

    public Long getSuggestionId() {
        return suggestionId;
    }

    public Long getMeetingId() {
        return meetingId;
    }

    public String getContent() {
        return content;
    }

    public boolean isApproved() {
        return approved;
    }
}
