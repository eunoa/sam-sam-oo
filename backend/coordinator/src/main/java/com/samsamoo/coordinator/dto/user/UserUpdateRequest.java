package com.samsamoo.coordinator.dto.user;

public class UserUpdateRequest {

    private String name;
    private String language;
    private String timezone;

    protected UserUpdateRequest() {
    }

    public UserUpdateRequest(String name, String language, String timezone) {
        this.name = name;
        this.language = language;
        this.timezone = timezone;
    }

    public String getName() {
        return name;
    }

    public String getLanguage() {
        return language;
    }

    public String getTimezone() {
        return timezone;
    }
}
