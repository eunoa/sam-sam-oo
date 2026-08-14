package com.samsamoo.coordinator.controller;

import com.samsamoo.coordinator.dto.meeting.MeetingCreateRequest;
import com.samsamoo.coordinator.dto.meeting.MeetingCreateResponse;
import com.samsamoo.coordinator.dto.meeting.MeetingDetailResponse;
import com.samsamoo.coordinator.dto.meeting.MeetingResponse;
import com.samsamoo.coordinator.service.MeetingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class MeetingController {
    private final MeetingService meetingService;

    // service 의존성 주입
    public MeetingController(MeetingService meetingService){
        this.meetingService = meetingService;
    }

    @PostMapping("/projects/{projectId}/meetings")
    public MeetingCreateResponse createMeeting(
            @PathVariable Long projectId,
            @Valid @RequestBody MeetingCreateRequest request) {

        return meetingService.createMeeting(projectId, request);
    }

    // 프로젝트별 회의 목록 조회
    @GetMapping("/projects/{projectId}/meetings")
    public List<MeetingResponse> getMeetings(
            @PathVariable Long projectId) {

        return meetingService.getMeetings(projectId);
    }

    // 회의 상세 조회
    @GetMapping("/meetings/{meetingId}")
    public MeetingDetailResponse getMeeting(
            @PathVariable Long meetingId) {

        return meetingService.getMeeting(meetingId);
    }
}
