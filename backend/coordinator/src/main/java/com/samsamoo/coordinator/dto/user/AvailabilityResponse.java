package com.samsamoo.coordinator.dto.user;

import java.time.DayOfWeek;
import java.time.LocalTime;

public class AvailabilityResponse {

    private Long availabilityId;
    private DayOfWeek dayOfWeek;
    private LocalTime startTime;
    private LocalTime endTime;

    protected AvailabilityResponse() {
    }

    public AvailabilityResponse(Long availabilityId, DayOfWeek dayOfWeek, LocalTime startTime, LocalTime endTime) {
        this.availabilityId = availabilityId;
        this.dayOfWeek = dayOfWeek;
        this.startTime = startTime;
        this.endTime = endTime;
    }

    public Long getAvailabilityId() {
        return availabilityId;
    }

    public DayOfWeek getDayOfWeek() {
        return dayOfWeek;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }
}
