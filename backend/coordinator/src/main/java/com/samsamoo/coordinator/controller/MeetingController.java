package com.samsamoo.coordinator.controller;

import com.samsamoo.coordinator.dto.meeting.MeetingCreateRequest;
import com.samsamoo.coordinator.dto.meeting.MeetingCreateResponse;
import com.samsamoo.coordinator.service.MeetingService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

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
}
