package com.samsamoo.coordinator.service;


import com.samsamoo.coordinator.dto.meeting.MeetingCreateRequest;
import com.samsamoo.coordinator.dto.meeting.MeetingCreateResponse;
import com.samsamoo.coordinator.entity.Meeting;
import com.samsamoo.coordinator.entity.Project;
import com.samsamoo.coordinator.exception.CustomException;
import com.samsamoo.coordinator.exception.ErrorCode;
import com.samsamoo.coordinator.repository.MeetingRepository;
import com.samsamoo.coordinator.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional(readOnly = true)
public class MeetingService {

    private final MeetingRepository meetingRepository;
    private final ProjectRepository projectRepository;

    // Repository 의존성 주입
    public MeetingService(MeetingRepository meetingRepository,
                          ProjectRepository projectRepository) {
        this.meetingRepository = meetingRepository;
        this.projectRepository = projectRepository;
    }

    // 회의 생성
    @Transactional
    public MeetingCreateResponse createMeeting(Long projectId, MeetingCreateRequest request) {

        Project project = findProject(projectId);

        Meeting meeting = new Meeting(
                project,
                request.getTitle(),
                request.getScheduledAt(),
                false
        );

        Meeting saved = meetingRepository.save(meeting);

        return new MeetingCreateResponse(
                saved.getMeetingId(),
                saved.getProject().getProjectId(),
                saved.getTitle(),
                saved.getScheduledAt()
        );
    }

    // 프로젝트 ID로 프로젝트 조회
    private Project findProject(Long projectId) {
        return projectRepository.findById(projectId)
                .orElseThrow(() -> new CustomException(ErrorCode.PROJECT_NOT_FOUND));
    }
}