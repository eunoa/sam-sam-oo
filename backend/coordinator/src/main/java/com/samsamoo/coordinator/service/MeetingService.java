package com.samsamoo.coordinator.service;


import com.samsamoo.coordinator.dto.meeting.*;
import com.samsamoo.coordinator.entity.Meeting;
import com.samsamoo.coordinator.entity.Project;
import com.samsamoo.coordinator.exception.CustomException;
import com.samsamoo.coordinator.exception.ErrorCode;
import com.samsamoo.coordinator.repository.MeetingRepository;
import com.samsamoo.coordinator.repository.ProjectRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

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

    // 프로젝트별 회의 목록 조회
    public List<MeetingResponse> getMeetings(Long projectId) {

        findProject(projectId);

        return meetingRepository.findByProject_ProjectId(projectId).stream()
                .map(meeting -> new MeetingResponse(
                        meeting.getMeetingId(),
                        meeting.getTitle(),
                        meeting.getScheduledAt(),
                        meeting.getStatus()
                ))
                .collect(Collectors.toList());
    }

    // 회의 상세 조회
    public MeetingDetailResponse getMeeting(Long meetingId) {

        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEETING_NOT_FOUND));

        return new MeetingDetailResponse(
                meeting.getMeetingId(),
                meeting.getProject().getProjectId(),
                meeting.getTitle(),
                meeting.getScheduledAt(),
                meeting.getStatus(),
                meeting.getManualContent()
        );
    }

    // 회의 내용 입력
    @Transactional
    public void updateContent(Long meetingId, MeetingContentUpdateRequest request) {

        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEETING_NOT_FOUND));

        meeting.updateManualContent(request.getManualContent());
    }

    // 회의 삭제
    @Transactional
    public void deleteMeeting(Long meetingId) {

        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() -> new CustomException(ErrorCode.MEETING_NOT_FOUND));

        meetingRepository.delete(meeting);
    }
}