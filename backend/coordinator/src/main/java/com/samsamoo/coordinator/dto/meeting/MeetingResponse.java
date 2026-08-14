package com.samsamoo.coordinator.dto.meeting;

import com.samsamoo.coordinator.entity.enums.MeetingStatus;

import java.time.LocalDateTime;

public class MeetingResponse {
    private Long meetingId;
    private String title;
    private LocalDateTime scheduledAt;
    private MeetingStatus status;

    public MeetingResponse(Long meetingId,
                           String title,
                           LocalDateTime scheduledAt,
                           MeetingStatus status) {
        this.meetingId = meetingId;
        this.title = title;
        this.scheduledAt = scheduledAt;
        this.status = status;
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
}
