package com.samsamoo.coordinator.controller;

import com.samsamoo.coordinator.dto.meeting.MeetingSummaryResponse;
import com.samsamoo.coordinator.dto.meeting.MeetingTranslationResponse;
import com.samsamoo.coordinator.service.MeetingSummaryService;
import org.springframework.web.bind.annotation.*;

@RestController
public class MeetingSummaryController {

    private final MeetingSummaryService meetingSummaryService;

    public MeetingSummaryController(MeetingSummaryService meetingSummaryService) {
        this.meetingSummaryService = meetingSummaryService;
    }

    @GetMapping("/meetings/{meetingId}/summary")
    public MeetingSummaryResponse getSummary(@PathVariable Long meetingId) {
        return meetingSummaryService.getSummary(meetingId);
    }

    @PostMapping("/meetings/{meetingId}/summary")
    public MeetingSummaryResponse createSummary(@PathVariable Long meetingId) {
        return meetingSummaryService.createSummary(meetingId);
    }
    // 회의 요약 번역
    @GetMapping("/meetings/{meetingId}/translate")
    public MeetingTranslationResponse translateSummary(
            @PathVariable Long meetingId,
            @RequestParam String targetLanguage) {

        return meetingSummaryService.translateSummary(
                meetingId,
                targetLanguage
        );
    }
}