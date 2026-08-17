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
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class MeetingTimeRecommendationService {

    private final ProjectRepository projectRepository;
    private final ProjectMemberRepository projectMemberRepository;
    private final UserAvailabilityRepository userAvailabilityRepository;
    private final OpenAiService openAiService;

    public MeetingTimeRecommendationService(
            ProjectRepository projectRepository,
            ProjectMemberRepository projectMemberRepository,
            UserAvailabilityRepository userAvailabilityRepository,
            OpenAiService openAiService) {

        this.projectRepository = projectRepository;
        this.projectMemberRepository = projectMemberRepository;
        this.userAvailabilityRepository = userAvailabilityRepository;
        this.openAiService = openAiService;
    }

    // 프로젝트 멤버들의 가능 시간을 분석하여 회의시간 추천
    public MeetingTimeRecommendationResponse recommendTime(
            Long projectId,
            MeetingTimeRecommendationRequest request) {

        // 프로젝트 존재 여부 확인
        projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        // 프로젝트에 참여하고 있는 멤버 전체 조회
        List<ProjectMember> projectMembers =
                projectMemberRepository.findByProject_ProjectId(projectId);

        // AI에 전달할 멤버별 가능 시간 정보 생성
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

            // 해당 사용자의 가능한 시간 조회
            List<UserAvailability> availabilities =
                    userAvailabilityRepository.findByUser_UserId(
                            user.getUserId()
                    );

            // 사용자의 요일별 가능 시간 추가
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

        // OpenAI를 이용하여 가장 적절한 회의시간 추천
        String recommendation = openAiService.recommendMeetingTime(
                request.getStartDate(),
                request.getEndDate(),
                request.getDurationMinutes(),
                availabilityInfo.toString()
        );

        return new MeetingTimeRecommendationResponse(
                recommendation,
                "프로젝트 멤버들의 가능 시간과 시간대를 기준으로 추천된 시간입니다."
        );
    }
}