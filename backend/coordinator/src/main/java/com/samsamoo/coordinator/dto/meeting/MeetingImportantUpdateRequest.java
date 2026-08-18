package com.samsamoo.coordinator.dto.meeting;

public class MeetingImportantUpdateRequest {

    private boolean important;

    public MeetingImportantUpdateRequest() {
    }

    public boolean isImportant() {
        return important;
    }

    public void setImportant(boolean important) {
        this.important = important;
    }
}