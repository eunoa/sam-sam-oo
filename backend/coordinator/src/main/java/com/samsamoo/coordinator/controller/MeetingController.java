package com.samsamoo.coordinator.controller;

import com.samsamoo.coordinator.dto.meeting.*;
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

    //회의 생성
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

    // 회의 내용 입력
    @PatchMapping("/meetings/{meetingId}/content")
    public void UpdateContent(
            @PathVariable Long meetingId,
            @Valid @RequestBody MeetingContentUpdateRequest request){
        meetingService.updateContent(meetingId, request);
    }

    // 회의 삭제
    @DeleteMapping("/meetings/{meetingId}")
    public void deleteMeeting( @PathVariable Long meetingId ) {
        meetingService.deleteMeeting(meetingId);
    }

    // 중요 회의 여부 변경
    @PatchMapping("/meetings/{meetingId}/important")
    public void updateImportant(
            @PathVariable Long meetingId,
            @RequestBody MeetingImportantUpdateRequest request) {

        meetingService.updateImportant(
                meetingId,
                request
        );
    }
}
