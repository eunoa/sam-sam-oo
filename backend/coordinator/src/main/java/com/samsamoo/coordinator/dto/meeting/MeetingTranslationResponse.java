package com.samsamoo.coordinator.dto.meeting;

public class MeetingTranslationResponse {

    private Long meetingId;
    private String targetLanguage;
    private String translatedText;

    public MeetingTranslationResponse(
            Long meetingId,
            String targetLanguage,
            String translatedText) {

        this.meetingId = meetingId;
        this.targetLanguage = targetLanguage;
        this.translatedText = translatedText;
    }

    public Long getMeetingId() {
        return meetingId;
    }

    public String getTargetLanguage() {
        return targetLanguage;
    }

    public String getTranslatedText() {
        return translatedText;
    }
}