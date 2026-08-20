package com.samsamoo.coordinator.dto.meeting;

public class MeetingTimeRecommendationResponse {

    private String date;
    private String time;
    private String reason;

    public MeetingTimeRecommendationResponse(
            String date,
            String time,
            String reason
    ) {
        this.date = date;
        this.time = time;
        this.reason = reason;
    }

    public String getDate() {
        return date;
    }

    public String getTime() {
        return time;
    }

    public String getReason() {
        return reason;
    }
}