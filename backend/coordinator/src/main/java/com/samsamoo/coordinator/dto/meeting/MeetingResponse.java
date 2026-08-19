package com.samsamoo.coordinator.dto.meeting;

import com.samsamoo.coordinator.entity.enums.MeetingStatus;

import java.time.LocalDateTime;

public class MeetingResponse {
    private Long meetingId;
    private String title;
    private LocalDateTime scheduledAt;
    private MeetingStatus status;
    private boolean important;

    public MeetingResponse(Long meetingId,
                           String title,
                           LocalDateTime scheduledAt,
                           MeetingStatus status,
                           boolean important) {
        this.meetingId = meetingId;
        this.title = title;
        this.scheduledAt = scheduledAt;
        this.status = status;
        this.important = important;
    }

    public Long getMeetingId() {
        return meetingId;
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

    public boolean isImportant() {
        return important;
    }
}
