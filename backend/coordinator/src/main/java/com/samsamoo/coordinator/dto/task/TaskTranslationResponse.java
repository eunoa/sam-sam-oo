package com.samsamoo.coordinator.dto.task;

public class TaskTranslationResponse {

    private Long taskId;
    private String targetLanguage;
    private String translatedTitle;
    private String translatedDescription;

    public TaskTranslationResponse(
            Long taskId,
            String targetLanguage,
            String translatedTitle,
            String translatedDescription) {

        this.taskId = taskId;
        this.targetLanguage = targetLanguage;
        this.translatedTitle = translatedTitle;
        this.translatedDescription = translatedDescription;
    }

    public Long getTaskId() {
        return taskId;
    }

    public String getTargetLanguage() {
        return targetLanguage;
    }

    public String getTranslatedTitle() {
        return translatedTitle;
    }

    public String getTranslatedDescription() {
        return translatedDescription;
    }
}