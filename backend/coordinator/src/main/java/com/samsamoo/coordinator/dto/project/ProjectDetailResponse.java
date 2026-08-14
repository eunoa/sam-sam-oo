package com.samsamoo.coordinator.dto.project;

import java.util.List;

public class ProjectDetailResponse {

    private Long projectId;
    private String name;
    private String description;
    private Long createdBy;
    private List<ProjectMemberSummary> members;

    public ProjectDetailResponse(Long projectId, String name, String description,
                                 Long createdBy, List<ProjectMemberSummary> members) {
        this.projectId = projectId;
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
        this.members = members;
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

    public List<ProjectMemberSummary> getMembers() {
        return members;
    }
}
