package com.samsamoo.coordinator.dto.meeting;

import java.time.LocalDate;

public class MeetingTimeRecommendationRequest {

    private LocalDate startDate;
    private LocalDate endDate;
    private Integer durationMinutes;

    public MeetingTimeRecommendationRequest() {
    }

    public LocalDate getStartDate() {
        return startDate;
    }

    public LocalDate getEndDate() {
        return endDate;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public void setStartDate(LocalDate startDate) {
        this.startDate = startDate;
    }

    public void setEndDate(LocalDate endDate) {
        this.endDate = endDate;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }
}