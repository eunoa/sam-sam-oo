package com.samsamoo.coordinator.dto.meeting;

import com.samsamoo.coordinator.entity.enums.MeetingStatus;

import java.time.LocalDateTime;

public class MeetingDetailResponse {

    private Long meetingId;
    private Long projectId;
    private String title;
    private LocalDateTime scheduledAt;
    private MeetingStatus status;
    private String manualContent;
    private boolean important;

    public MeetingDetailResponse(
            Long meetingId,
            Long projectId,
            String title,
            LocalDateTime scheduledAt,
            MeetingStatus status,
            String manualContent,
            boolean important) {

        this.meetingId = meetingId;
        this.projectId = projectId;
        this.title = title;
        this.scheduledAt = scheduledAt;
        this.status = status;
        this.manualContent = manualContent;
        this.important = important;
    }

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

    public MeetingStatus getStatus() {
        return status;
    }

    public String getManualContent() {
        return manualContent;
    }

    public boolean isImportant() {
        return important;
    }
}