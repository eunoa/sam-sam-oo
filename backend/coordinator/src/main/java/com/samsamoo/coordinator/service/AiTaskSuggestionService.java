package com.samsamoo.coordinator.service;

import com.samsamoo.coordinator.dto.meeting.AiTaskApproveRequest;
import com.samsamoo.coordinator.dto.meeting.AiTaskApproveResponse;
import com.samsamoo.coordinator.dto.meeting.AiTaskSuggestionResponse;
import com.samsamoo.coordinator.entity.AiTaskSuggestion;
import com.samsamoo.coordinator.entity.Meeting;
import com.samsamoo.coordinator.entity.Task;
import com.samsamoo.coordinator.entity.User;
import com.samsamoo.coordinator.exception.CustomException;
import com.samsamoo.coordinator.exception.ErrorCode;
import com.samsamoo.coordinator.repository.AiTaskSuggestionRepository;
import com.samsamoo.coordinator.repository.MeetingRepository;
import com.samsamoo.coordinator.repository.TaskRepository;
import com.samsamoo.coordinator.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class AiTaskSuggestionService {

    private final AiTaskSuggestionRepository aiTaskSuggestionRepository;
    private final MeetingRepository meetingRepository;
    private final OpenAiService openAiService;
    private final TaskRepository taskRepository;
    private final UserRepository userRepository;

    public AiTaskSuggestionService(
            AiTaskSuggestionRepository aiTaskSuggestionRepository,
            MeetingRepository meetingRepository,
            OpenAiService openAiService,
            TaskRepository taskRepository,
            UserRepository userRepository) {

        this.aiTaskSuggestionRepository = aiTaskSuggestionRepository;
        this.meetingRepository = meetingRepository;
        this.openAiService = openAiService;
        this.taskRepository = taskRepository;
        this.userRepository = userRepository;
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

    // AI 업무 제안 목록 조회
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

    // AI 업무 제안 삭제
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

    // AI 업무 제안을 승인하고 실제 Task로 생성
    @Transactional
    public AiTaskApproveResponse approveSuggestion(
            Long meetingId,
            AiTaskApproveRequest request) {

        // meetingId로 회의 조회
        Meeting meeting = meetingRepository.findById(meetingId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.MEETING_NOT_FOUND));

        // suggestionId로 AI 업무 제안 조회
        AiTaskSuggestion suggestion =
                aiTaskSuggestionRepository.findById(request.getSuggestionId())
                        .orElseThrow(() ->
                                new CustomException(ErrorCode.AI_TASK_SUGGESTION_NOT_FOUND));

        // 해당 회의의 업무 제안이 맞는지 확인
        if (!suggestion.getMeeting().getMeetingId().equals(meetingId)) {
            throw new CustomException(ErrorCode.AI_TASK_SUGGESTION_NOT_FOUND);
        }

        // assigneeId로 담당자 조회
        User assignee = userRepository.findById(request.getAssigneeId())
                .orElseThrow(() ->
                        new CustomException(ErrorCode.USER_NOT_FOUND));

        // 승인한 AI 업무 제안을 실제 Task로 생성
        Task task = new Task(
                meeting.getProject(),
                assignee,
                suggestion.getContent(),
                null,
                null
        );

        // Task DB 저장
        Task savedTask = taskRepository.save(task);

        // AI 업무 제안을 승인 상태로 변경
        suggestion.approve();

        // 생성된 Task 정보 반환
        return new AiTaskApproveResponse(
                savedTask.getTaskId(),
                suggestion.getSuggestionId(),
                savedTask.getTitle(),
                savedTask.getAssignee().getUserId(),
                savedTask.getStatus()
        );
    }
}