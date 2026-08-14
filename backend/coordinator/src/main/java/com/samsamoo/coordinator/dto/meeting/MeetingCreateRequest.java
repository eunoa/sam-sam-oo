package com.samsamoo.coordinator.dto.meeting;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public class MeetingCreateRequest {
    @NotBlank
    private String title;

    @NotNull
    private LocalDateTime scheduledAt;

    public MeetingCreateRequest(){

    }

    //Getter
    public String getTitle() {
        return title;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    //setter
    public void setTitle(String title) {
        this.title = title;
    }

    public void setScheduleAt(LocalDateTime scheduleAt) {
        this.scheduledAt = scheduleAt;
    }
}
