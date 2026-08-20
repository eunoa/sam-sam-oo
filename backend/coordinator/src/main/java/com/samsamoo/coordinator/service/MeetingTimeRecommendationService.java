package com.samsamoo.coordinator.service;

import com.samsamoo.coordinator.dto.meeting.MeetingTimeRecommendationRequest;
import com.samsamoo.coordinator.dto.meeting.MeetingTimeRecommendationResponse;
import com.samsamoo.coordinator.entity.ProjectMember;
import com.samsamoo.coordinator.entity.User;
import com.samsamoo.coordinator.entity.UserAvailability;
import com.samsamoo.coordinator.exception.CustomException;
import com.samsamoo.coordinator.exception.ErrorCode;
import com.samsamoo.coordinator.repository.ProjectMemberRepository;
import com.samsamoo.coordinator.repository.ProjectRepository;
import com.samsamoo.coordinator.repository.UserAvailabilityRepository;
import com.samsamoo.coordinator.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class MeetingTimeRecommendationService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserAvailabilityRepository userAvailabilityRepository;
    private final UserRepository userRepository;
    private final OpenAiService openAiService;

    public MeetingTimeRecommendationService(
            ProjectRepository projectRepository,
            ProjectMemberRepository projectMemberRepository,
            UserAvailabilityRepository userAvailabilityRepository,
            UserRepository userRepository,
            OpenAiService openAiService) {

        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userAvailabilityRepository = userAvailabilityRepository;
        this.userRepository = userRepository;
        this.openAiService = openAiService;
    }

    // 프로젝트 멤버들의 가능 시간을 분석하여 회의시간 추천
    public MeetingTimeRecommendationResponse recommendTime(
            Long projectId,
            Long userId,
            MeetingTimeRecommendationRequest request) {

        // 프로젝트 존재 여부 확인
        projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        // 현재 추천 요청을 보낸 사용자 조회
        User requestUser = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.USER_NOT_FOUND));

        // 프론트에서 보낸 date/startTime/endTime의 기준 시간대
        String requestTimezone = requestUser.getTimezone();

        // 해당 프로젝트에 참여하고 있는 멤버만 조회
        List<ProjectMember> projectMembers =
                projectMemberRepository.findByProject_ProjectId(projectId);

        // AI에 전달할 프로젝트 멤버들의 시간 정보
        StringBuilder availabilityInfo = new StringBuilder();

        for (ProjectMember projectMember : projectMembers) {

            User user = projectMember.getUser();

            availabilityInfo
                    .append("사용자 ID: ")
                    .append(user.getUserId())
                    .append("\n");

            availabilityInfo
                    .append("시간대: ")
                    .append(user.getTimezone())
                    .append("\n");

            List<UserAvailability> availabilities =
                    userAvailabilityRepository.findByUser_UserId(
                            user.getUserId()
                    );

            for (UserAvailability availability : availabilities) {

                availabilityInfo
                        .append("- ")
                        .append(availability.getDayOfWeek())
                        .append(" ")
                        .append(availability.getStartTime())
                        .append(" ~ ")
                        .append(availability.getEndTime())
                        .append("\n");
            }

            availabilityInfo.append("\n");
        }

        return openAiService.recommendMeetingTime(
                request.getDate(),
                request.getStartTime(),
                request.getEndTime(),
                requestTimezone,
                availabilityInfo.toString()
        );
    }
}