package com.samsamoo.coordinator.dto.project;

import java.time.LocalDateTime;

public class ProjectCreateResponse {

    private Long projectId;
    private String name;
    private String description;
    private Long createdBy;
    private LocalDateTime createdAt;

    public ProjectCreateResponse(Long projectId, String name, String description,
                                 Long createdBy, LocalDateTime createdAt) {
        this.projectId = projectId;
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
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

    public Long getCreatedBy() {
        return createdBy;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}
