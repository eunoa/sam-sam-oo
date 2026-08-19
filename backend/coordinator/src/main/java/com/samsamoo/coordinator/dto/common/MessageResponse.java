package com.samsamoo.coordinator.dto.common;

public class MessageResponse {

    private String message;

    protected MessageResponse() {
    }

    public MessageResponse(String message) {
        this.message = message;
    }

    public String getMessage() {
        return message;
    }
}
