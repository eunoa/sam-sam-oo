package com.samsamoo.coordinator.dto.user;

import java.time.LocalDateTime;

public class UserResponse {

    private Long userId;
    private String name;
    private String email;
    private String language;
    private String timezone;
    private LocalDateTime createdAt;

    public UserResponse(Long userId, String name, String email, String language,
                        String timezone, LocalDateTime createdAt) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.language = language;
        this.timezone = timezone;
        this.createdAt = createdAt;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getLanguage() {
        return language;
    }

    public String getTimezone() {
        return timezone;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
