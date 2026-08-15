package com.samsamoo.coordinator.dto.user;

public class LoginResponse {

    private Long userId;
    private String name;
    private String accessToken;

    public LoginResponse(Long userId, String name, String accessToken) {
        this.userId = userId;
        this.name = name;
        this.accessToken = accessToken;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getAccessToken() {
        return accessToken;
    }
}
