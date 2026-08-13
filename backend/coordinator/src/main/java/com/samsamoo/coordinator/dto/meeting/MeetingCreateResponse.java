package com.samsamoo.coordinator.dto.meeting;

import java.time.LocalDateTime;

public class MeetingCreateResponse {
    private Long meetingId;
    private Long projectId;
    private String title;
    private LocalDateTime scheduledAt;

    public MeetingCreateResponse(Long meetingId, Long projectId, String title, LocalDateTime scheduledAt){
        this.meetingId = meetingId;
        this.projectId = projectId;
        this.title = title;
        this.scheduledAt = scheduledAt;
    }

    //Getter
    public Long getMeetingId() {
        return meetingId;
    }

    public Long getProjectId() {
        return projectId;
    }

    public String getTitle() {
        return title;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }
}
