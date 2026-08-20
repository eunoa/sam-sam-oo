package com.samsamoo.coordinator.dto.project;

import com.samsamoo.coordinator.entity.enums.ProjectMemberRole;

public class ProjectMemberSummary {

    private Long userId;
    private String name;
    private ProjectMemberRole role;

    public ProjectMemberSummary(Long userId, String name, ProjectMemberRole role) {
        this.userId = userId;
        this.name = name;
        this.role = role;
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public ProjectMemberRole getRole() {
        return role;
    }
}
