package com.samsamoo.coordinator.dto.meeting;

import java.time.LocalDateTime;

public class MeetingSummaryResponse {
    private Long summaryId;
    private Long meetingId;
    private String summary;
    private LocalDateTime createdAt;

    public MeetingSummaryResponse(Long summaryId,
                                  Long meetingId,
                                  String summary,
                                  LocalDateTime createdAt) {
        this.summaryId = summaryId;
        this.meetingId = meetingId;
        this.summary = summary;
        this.createdAt = createdAt;
    }

    public Long getSummaryId() {
        return summaryId;
    }

    public Long getMeetingId() {
        return meetingId;
    }

    public String getSummary() {
        return summary;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
