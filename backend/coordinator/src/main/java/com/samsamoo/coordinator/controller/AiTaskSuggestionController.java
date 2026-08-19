package com.samsamoo.coordinator.controller;

import com.samsamoo.coordinator.dto.meeting.AiTaskApproveRequest;
import com.samsamoo.coordinator.dto.meeting.AiTaskApproveResponse;
import com.samsamoo.coordinator.dto.meeting.AiTaskSuggestionResponse;
import com.samsamoo.coordinator.service.AiTaskSuggestionService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AiTaskSuggestionController {

    private final AiTaskSuggestionService aiTaskSuggestionService;

    public AiTaskSuggestionController(
            AiTaskSuggestionService aiTaskSuggestionService) {
        this.aiTaskSuggestionService = aiTaskSuggestionService;
    }

    // AI 업무 제안 생성
    @PostMapping("/meetings/{meetingId}/task-suggestions")
    public List<AiTaskSuggestionResponse> createSuggestions(
            @PathVariable Long meetingId) {

        return aiTaskSuggestionService.createSuggestions(meetingId);
    }

    // AI 업무 제안 목록 조회
    @GetMapping("/meetings/{meetingId}/task-suggestions")
    public List<AiTaskSuggestionResponse> getSuggestions(
            @PathVariable Long meetingId) {

        return aiTaskSuggestionService.getSuggestions(meetingId);
    }

    // AI 업무 제안 삭제
    @DeleteMapping("/meetings/{meetingId}/suggestions/{suggestionId}")
    public void deleteSuggestion(
            @PathVariable Long meetingId,
            @PathVariable Long suggestionId) {

        aiTaskSuggestionService.deleteSuggestion(meetingId, suggestionId);
    }

    // AI 업무 제안 승인 후 실제 Task 생성
    @PostMapping("/meetings/{meetingId}/tasks/approve")
    public AiTaskApproveResponse approveSuggestion(
            @PathVariable Long meetingId,
            @RequestBody AiTaskApproveRequest request) {

        return aiTaskSuggestionService.approveSuggestion(meetingId, request);
    }
}