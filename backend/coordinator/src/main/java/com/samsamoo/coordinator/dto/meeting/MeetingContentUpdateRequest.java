package com.samsamoo.coordinator.dto.meeting;

import jakarta.validation.constraints.NotBlank;

public class MeetingContentUpdateRequest {
    @NotBlank
    private String manualContent;

    public MeetingContentUpdateRequest(){

    }

    public String getManualContent() {
        return manualContent;
    }

    public void setManualContent(String manualContent) {
        this.manualContent = manualContent;
    }
}
