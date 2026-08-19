package com.samsamoo.coordinator.dto.meeting;

public class MeetingTimeRecommendationResponse {

    private String recommendedTime;
    private String reason;

    public MeetingTimeRecommendationResponse(
            String recommendedTime,
            String reason) {

        this.recommendedTime = recommendedTime;
        this.reason = reason;
    }

    public String getRecommendedTime() {
        return recommendedTime;
    }

    public String getReason() {
        return reason;
    }
}