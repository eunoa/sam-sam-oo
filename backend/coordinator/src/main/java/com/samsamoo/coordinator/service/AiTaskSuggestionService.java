package com.samsamoo.coordinator.service;

import com.samsamoo.coordinator.dto.meeting.AiTaskSuggestionResponse;
import com.samsamoo.coordinator.entity.AiTaskSuggestion;
import com.samsamoo.coordinator.entity.Meeting;
import com.samsamoo.coordinator.exception.CustomException;
import com.samsamoo.coordinator.exception.ErrorCode;
import com.samsamoo.coordinator.repository.AiTaskSuggestionRepository;
import com.samsamoo.coordinator.repository.MeetingRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class AiTaskSuggestionService {
    private final AiTaskSuggestionRepository aiTaskSuggestionRepository;
    private final MeetingRepository meetingRepository;
    private final OpenAiService openAiService;

    public AiTaskSuggestionService(AiTaskSuggestionRepository aiTaskSuggestionRepository,
                                   MeetingRepository meetingRepository,
                                   OpenAiService openAiService) {
        this.aiTaskSuggestionRepository = aiTaskSuggestionRepository;
        this.meetingRepository = meetingRepository;
        this.openAiService = openAiService;
    }
    // 회의 내용을 기반으로 AI 업무 제안을 생성하고 DB에 저장
    @Transactional
    public List<AiTaskSuggestionResponse> createSuggestions(Long meetingId) {

        // meetingId로 회의 조회
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.MEETING_NOT_FOUND));

        // 회의록을 OpenAI에 전달하여 업무 제안 목록 생성
        List<String> taskContents =
                openAiService.suggestTasks(meeting.getManualContent());

        // AI가 제안한 각 업무를 DB에 저장한 뒤 DTO로 변환
        return taskContents.stream()
                .map(content -> {

                    // 업무 제안 Entity 생성
                    AiTaskSuggestion suggestion =
                            new AiTaskSuggestion(meeting, content);

                    // DB 저장
                    AiTaskSuggestion saved =
                            aiTaskSuggestionRepository.save(suggestion);

                    // 저장된 Entity를 Response DTO로 변환
                    return new AiTaskSuggestionResponse(
                            saved.getSuggestionId(),
                            saved.getMeeting().getMeetingId(),
                            saved.getContent(),
                            saved.isApproved()
                    );
                })
                .toList();
    }

    public List<AiTaskSuggestionResponse> getSuggestions(Long meetingId) {

        // meetingId로 회의 존재 여부 확인
        meetingRepository.findById(meetingId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.MEETING_NOT_FOUND));

        // 해당 회의의 AI 업무 제안 목록 조회 후 DTO로 변환
        return aiTaskSuggestionRepository.findByMeeting_MeetingId(meetingId)
                .stream()
                .map(suggestion -> new AiTaskSuggestionResponse(
                        suggestion.getSuggestionId(),
                        suggestion.getMeeting().getMeetingId(),
                        suggestion.getContent(),
                        suggestion.isApproved()
                ))
                .toList();
    }

    @Transactional
    public void deleteSuggestion(Long meetingId, Long suggestionId) {

        // meetingId로 회의 존재 여부 확인
        meetingRepository.findById(meetingId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.MEETING_NOT_FOUND));

        // suggestionId로 업무 제안 조회
        AiTaskSuggestion suggestion =
                aiTaskSuggestionRepository.findById(suggestionId)
                        .orElseThrow(() ->
                                new CustomException(ErrorCode.AI_TASK_SUGGESTION_NOT_FOUND));

        // 요청한 meetingId의 업무 제안이 맞는지 확인
        if (!suggestion.getMeeting().getMeetingId().equals(meetingId)) {
            throw new CustomException(ErrorCode.AI_TASK_SUGGESTION_NOT_FOUND);
        }

        // 업무 제안 삭제
        aiTaskSuggestionRepository.delete(suggestion);
    }
}
