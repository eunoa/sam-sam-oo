package com.samsamoo.coordinator.dto.project;

import com.samsamoo.coordinator.entity.enums.ProjectMemberRole;

public class MemberDetailResponse {

    private Long userId;
    private String name;
    private String email;
    private String language;
    private String timezone;
    private ProjectMemberRole role;

    public MemberDetailResponse(Long userId, String name, String email,
                                String language, String timezone, ProjectMemberRole role) {
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.language = language;
        this.timezone = timezone;
        this.role = role;
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

    public ProjectMemberRole getRole() {
        return role;
    }
}
