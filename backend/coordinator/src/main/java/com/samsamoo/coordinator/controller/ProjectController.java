package com.samsamoo.coordinator.controller;

import com.samsamoo.coordinator.dto.project.*;
import com.samsamoo.coordinator.security.CurrentUserId;
import com.samsamoo.coordinator.service.ProjectService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/projects")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    @PostMapping
    public ResponseEntity<ProjectCreateResponse> createProject(@CurrentUserId Long userId,
                                                               @RequestBody ProjectCreateRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.createProject(userId, request));
    }

    @GetMapping
    public ResponseEntity<List<ProjectResponse>> getMyProjects(@CurrentUserId Long userId) {
        return ResponseEntity.ok(projectService.getMyProjects(userId));
    }

    @GetMapping("/{projectId}")
    public ResponseEntity<ProjectDetailResponse> getProjectDetail(@CurrentUserId Long userId,
                                                                  @PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getProjectDetail(userId, projectId));
    }

    @GetMapping("/{projectId}/dashboard")
    public ResponseEntity<ProjectDashboardResponse> getDashboard(@CurrentUserId Long userId,
                                                                 @PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getDashboard(userId, projectId));
    }

    @DeleteMapping("/{projectId}")
    public ResponseEntity<Void> deleteProject(@CurrentUserId Long userId,
                                              @PathVariable Long projectId) {
        projectService.deleteProject(userId, projectId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{projectId}/members")
    public ResponseEntity<MemberInviteResponse> inviteMember(@CurrentUserId Long userId,
                                                             @PathVariable Long projectId,
                                                             @RequestBody MemberInviteRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(projectService.inviteMember(userId, projectId, request));
    }

    @GetMapping("/{projectId}/members")
    public ResponseEntity<List<MemberDetailResponse>> getMembers(@CurrentUserId Long userId,
                                                                 @PathVariable Long projectId) {
        return ResponseEntity.ok(projectService.getMembers(userId, projectId));
    }

    @DeleteMapping("/{projectId}/members/{userId}")
    public ResponseEntity<Void> removeMember(@CurrentUserId Long requesterId,
                                             @PathVariable Long projectId,
                                             @PathVariable Long userId) {
        projectService.removeMember(requesterId, projectId, userId);
        return ResponseEntity.noContent().build();
    }
}