package com.samsamoo.coordinator.controller;

import com.samsamoo.coordinator.dto.meeting.MeetingTimeRecommendationRequest;
import com.samsamoo.coordinator.dto.meeting.MeetingTimeRecommendationResponse;
import com.samsamoo.coordinator.service.MeetingTimeRecommendationService;
import org.springframework.web.bind.annotation.*;

@RestController
public class MeetingTimeRecommendationController {

    private final MeetingTimeRecommendationService meetingTimeRecommendationService;

    public MeetingTimeRecommendationController(
            MeetingTimeRecommendationService meetingTimeRecommendationService) {

        this.meetingTimeRecommendationService = meetingTimeRecommendationService;
    }

    // 프로젝트 멤버들의 가능 시간을 기반으로 AI 회의시간 추천
    @PostMapping("/projects/{projectId}/meetings/recommend-time")
    public MeetingTimeRecommendationResponse recommendTime(
            @PathVariable Long projectId,
            @RequestBody MeetingTimeRecommendationRequest request) {

        return meetingTimeRecommendationService.recommendTime(
                projectId,
                request
        );
    }
}