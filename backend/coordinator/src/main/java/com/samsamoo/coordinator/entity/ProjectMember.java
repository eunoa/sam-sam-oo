package com.samsamoo.coordinator.entity;

import com.samsamoo.coordinator.entity.enums.ProjectMemberRole;
import jakarta.persistence.*;

@Entity
@Table(
        name = "project_member",
        uniqueConstraints = @UniqueConstraint(columnNames = {"project_id", "user_id"})
)
public class ProjectMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "project_member_id")
    private Long projectMemberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ProjectMemberRole role;

    protected ProjectMember() {
    }

    public ProjectMember(Project project, User user, ProjectMemberRole role) {
        this.project = project;
        this.user = user;
        this.role = role;
    }

    public Long getProjectMemberId() {
        return projectMemberId;
    }

    public Project getProject() {
        return project;
    }

    public User getUser() {
        return user;
    }

    public ProjectMemberRole getRole() {
        return role;
    }

    public void changeRole(ProjectMemberRole role) {
        this.role = role;
    }
}
