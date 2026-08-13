package com.samsamoo.coordinator.dto.user;

public class SignupRequest {

    private String name;
    private String email;
    private String password;
    private String language;
    private String timezone;

    protected SignupRequest() {
    }

    public SignupRequest(String name, String email, String password, String language, String timezone) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.language = language;
        this.timezone = timezone;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getLanguage() {
        return language;
    }

    public String getTimezone() {
        return timezone;
    }
}
