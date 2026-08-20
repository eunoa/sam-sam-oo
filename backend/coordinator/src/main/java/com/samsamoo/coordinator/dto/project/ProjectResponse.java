package com.samsamoo.coordinator.dto.project;

import com.samsamoo.coordinator.entity.enums.ProjectMemberRole;

public class ProjectResponse {

    private Long projectId;
    private String name;
    private String description;
    private ProjectMemberRole role;

    public ProjectResponse(Long projectId,
                           String name,
                           String description,
                           ProjectMemberRole role) {
        this.projectId = projectId;
        this.name = name;
        this.description = description;
        this.role = role;
    }

    public Long getProjectId() {
        return projectId;
    }

    public String getName() {
        return name;
    }

    public String getDescription() {
        return description;
    }

    public ProjectMemberRole getRole() {
        return role;
    }
}