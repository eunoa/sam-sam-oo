package com.samsamoo.coordinator.dto.project;

import com.samsamoo.coordinator.entity.enums.ProjectMemberRole;

public class MemberInviteResponse {

    private Long projectMemberId;
    private Long userId;
    private String name;
    private String email;
    private ProjectMemberRole role;

    public MemberInviteResponse(Long projectMemberId, Long userId, String name,
                                String email, ProjectMemberRole role) {
        this.projectMemberId = projectMemberId;
        this.userId = userId;
        this.name = name;
        this.email = email;
        this.role = role;
    }

    public Long getProjectMemberId() {
        return projectMemberId;
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

    public ProjectMemberRole getRole() {
        return role;
    }
}
