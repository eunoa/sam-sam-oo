package com.samsamoo.coordinator.service;

import com.samsamoo.coordinator.dto.project.*;
import com.samsamoo.coordinator.entity.Project;
import com.samsamoo.coordinator.entity.ProjectMember;
import com.samsamoo.coordinator.entity.User;
import com.samsamoo.coordinator.entity.enums.ProjectMemberRole;
import com.samsamoo.coordinator.exception.CustomException;
import com.samsamoo.coordinator.exception.ErrorCode;
import com.samsamoo.coordinator.repository.ProjectMemberRepository;
import com.samsamoo.coordinator.repository.ProjectRepository;
import com.samsamoo.coordinator.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserRepository userRepository;

    public ProjectService(ProjectRepository projectRepository,
                          ProjectMemberRepository projectMemberRepository,
                          UserRepository userRepository) {
        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ProjectCreateResponse createProject(Long userId, ProjectCreateRequest request) {
        User user = findUser(userId);

        Project project = new Project(request.getName(), request.getDescription(), user);
        Project saved = projectRepository.save(project);

        // 프로젝트 생성자를 팀장(LEADER)으로 등록
        ProjectMember leader = new ProjectMember(saved, user, ProjectMemberRole.LEADER);
        projectMemberRepository.save(leader);

        return new ProjectCreateResponse(
                saved.getProjectId(),
                saved.getName(),
                saved.getDescription(),
                saved.getCreatedBy().getUserId(),
                saved.getCreatedAt()
        );
    }

    public List<ProjectResponse> getMyProjects(Long userId) {
        return projectMemberRepository.findByUser_UserId(userId).stream()
                .map(pm -> new ProjectResponse(
                        pm.getProject().getProjectId(),
                        pm.getProject().getName(),
                        pm.getProject().getDescription(),
                        pm.getRole()))
                .collect(Collectors.toList());
    }

    public ProjectDetailResponse getProjectDetail(Long projectId) {
        Project project = findProject(projectId);

        List<ProjectMemberSummary> members = projectMemberRepository.findByProject_ProjectId(projectId).stream()
                .map(this::toMemberSummary)
                .collect(Collectors.toList());

        return new ProjectDetailResponse(
                project.getProjectId(),
                project.getName(),
                project.getDescription(),
                project.getCreatedBy().getUserId(),
                members
        );
    }

    // TODO: Task/Meeting 도메인 개발 완료 후 실제 taskStatus/upcomingMeetings/recentMeetings 데이터 연동 필요
    public ProjectDashboardResponse getDashboard(Long projectId) {
        findProject(projectId);

        ProjectDashboardResponse.TaskStatusSummary taskStatus =
                new ProjectDashboardResponse.TaskStatusSummary(0, 0, 0, 0);

        return new ProjectDashboardResponse(
                taskStatus,
                Collections.emptyList(),
                Collections.emptyList()
        );
    }

    @Transactional
    public void deleteProject(Long userId, Long projectId) {
        Project project = findProject(projectId);
        validateLeader(projectId, userId);

        projectMemberRepository.findByProject_ProjectId(projectId)
                .forEach(projectMemberRepository::delete);
        projectRepository.delete(project);
    }

    @Transactional
    public MemberInviteResponse inviteMember(Long leaderId, Long projectId, MemberInviteRequest request) {
        validateLeader(projectId, leaderId);
        Project project = findProject(projectId);

        User invitee = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (projectMemberRepository.existsByProject_ProjectIdAndUser_UserId(projectId, invitee.getUserId())) {
            throw new CustomException(ErrorCode.ALREADY_PROJECT_MEMBER);
        }

        ProjectMember member = new ProjectMember(project, invitee, ProjectMemberRole.MEMBER);
        ProjectMember saved = projectMemberRepository.save(member);

        return toMemberInviteResponse(saved);
    }

    public List<MemberDetailResponse> getMembers(Long projectId) {
        return projectMemberRepository.findByProject_ProjectId(projectId).stream()
                .map(this::toMemberDetailResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public void removeMember(Long requesterId, Long projectId, Long targetUserId) {
        // 팀장은 팀원을 제외할 수 있고, 팀원은 본인만 탈퇴할 수 있음
        boolean isSelf = requesterId.equals(targetUserId);
        if (!isSelf) {
            validateLeader(projectId, requesterId);
        }

        ProjectMember target = projectMemberRepository.findByProject_ProjectIdAndUser_UserId(projectId, targetUserId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_MEMBER_NOT_FOUND));

        projectMemberRepository.delete(target);
    }

    private void validateLeader(Long projectId, Long userId) {
        ProjectMember member = projectMemberRepository.findByProject_ProjectIdAndUser_UserId(projectId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_MEMBER_NOT_FOUND));

        if (member.getRole() != ProjectMemberRole.LEADER) {
            throw new CustomException(ErrorCode.NOT_PROJECT_LEADER);
        }
    }

    // 프로젝트 상세조회(3번 항목)의 members 배열용: userId, name, role만 포함
    private ProjectMemberSummary toMemberSummary(ProjectMember pm) {
        return new ProjectMemberSummary(
                pm.getUser().getUserId(),
                pm.getUser().getName(),
                pm.getRole()
        );
    }

    // 팀원 초대(5번 항목) 응답용: projectMemberId 포함
    private MemberInviteResponse toMemberInviteResponse(ProjectMember pm) {
        return new MemberInviteResponse(
                pm.getProjectMemberId(),
                pm.getUser().getUserId(),
                pm.getUser().getName(),
                pm.getUser().getEmail(),
                pm.getRole()
        );
    }

    // 팀원 목록조회(6번 항목) 응답용: language, timezone 포함
    private MemberDetailResponse toMemberDetailResponse(ProjectMember pm) {
        return new MemberDetailResponse(
                pm.getUser().getUserId(),
                pm.getUser().getName(),
                pm.getUser().getEmail(),
                pm.getUser().getLanguage(),
                pm.getUser().getTimezone(),
                pm.getRole()
        );
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    private Project findProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));
    }
}
