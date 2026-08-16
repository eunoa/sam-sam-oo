package com.samsamoo.coordinator.service;

import com.samsamoo.coordinator.dto.task.TaskCreateRequest;
import com.samsamoo.coordinator.dto.task.TaskResponse;
import com.samsamoo.coordinator.dto.task.TaskTranslationResponse;
import com.samsamoo.coordinator.dto.task.TaskUpdateRequest;
import com.samsamoo.coordinator.entity.Project;
import com.samsamoo.coordinator.entity.Task;
import com.samsamoo.coordinator.entity.User;
import com.samsamoo.coordinator.entity.enums.TaskStatus;
import com.samsamoo.coordinator.exception.CustomException;
import com.samsamoo.coordinator.exception.ErrorCode;
import com.samsamoo.coordinator.repository.ProjectRepository;
import com.samsamoo.coordinator.repository.TaskRepository;
import com.samsamoo.coordinator.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class TaskService {

    private final TaskRepository taskRepository;
    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final OpenAiService openAiService;

    public TaskService(
            TaskRepository taskRepository,
            ProjectRepository projectRepository,
            UserRepository userRepository,
            OpenAiService openAiService) {

        this.taskRepository = taskRepository;
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.openAiService = openAiService;
    }

    // 사용자가 직접 Task 생성
    @Transactional
    public TaskResponse createTask(
            Long projectId,
            TaskCreateRequest request) {

        // projectId로 프로젝트 조회
        Project project = projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        // assigneeId로 담당자 조회
        User assignee = userRepository.findById(request.getAssigneeId())
                .orElseThrow(() ->
                        new CustomException(ErrorCode.USER_NOT_FOUND));

        // Task Entity 생성
        Task task = new Task(
                project,
                assignee,
                request.getTitle(),
                request.getDescription(),
                request.getDeadline()
        );

        // DB 저장
        Task saved = taskRepository.save(task);

        // Response DTO 반환
        return toResponse(saved);
    }

    // 프로젝트의 Task 목록 조회
    // status가 없으면 전체 조회, 있으면 해당 상태만 조회
    public List<TaskResponse> getTasks(
            Long projectId,
            TaskStatus status) {

        // 프로젝트 존재 여부 확인
        projectRepository.findById(projectId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.PROJECT_NOT_FOUND));

        // status가 없으면 전체 Task 조회
        if (status == null) {
            return taskRepository.findByProject_ProjectId(projectId)
                    .stream()
                    .map(this::toResponse)
                    .toList();
        }

        // status가 있으면 해당 상태의 Task만 조회
        return taskRepository
                .findByProject_ProjectIdAndStatus(projectId, status)
                .stream()
                .map(this::toResponse)
                .toList();
    }

    // Task 상세 조회
    public TaskResponse getTask(Long taskId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.TASK_NOT_FOUND));

        return toResponse(task);
    }

    // Task 상태, 담당자, 마감일 수정
    @Transactional
    public TaskResponse updateTask(
            Long taskId,
            TaskUpdateRequest request) {

        // taskId로 Task 조회
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.TASK_NOT_FOUND));

        // 담당자 변경 요청이 들어온 경우
        if (request.getAssigneeId() != null) {

            User assignee = userRepository.findById(request.getAssigneeId())
                    .orElseThrow(() ->
                            new CustomException(ErrorCode.USER_NOT_FOUND));

            task.updateAssignee(assignee);
        }

        // 상태 변경 요청이 들어온 경우
        if (request.getStatus() != null) {
            task.updateStatus(request.getStatus());
        }

        // 마감일 변경 요청이 들어온 경우
        if (request.getDeadline() != null) {
            task.updateDeadline(request.getDeadline());
        }

        // JPA Dirty Checking으로 변경사항 자동 반영
        return toResponse(task);
    }

    // Task 삭제
    @Transactional
    public void deleteTask(Long taskId) {

        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.TASK_NOT_FOUND));

        taskRepository.delete(task);
    }

    // Task의 제목과 설명을 지정한 언어로 번역
    public TaskTranslationResponse translateTask(
            Long taskId,
            String targetLanguage) {

        // taskId로 Task 조회
        Task task = taskRepository.findById(taskId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.TASK_NOT_FOUND));

        // Task 제목 번역
        String translatedTitle = openAiService.translate(
                task.getTitle(),
                targetLanguage
        );

        String translatedDescription = null;

        // description이 존재하는 경우에만 번역
        if (task.getDescription() != null
                && !task.getDescription().isBlank()) {

            translatedDescription = openAiService.translate(
                    task.getDescription(),
                    targetLanguage
            );
        }

        // 번역 결과 반환
        return new TaskTranslationResponse(
                taskId,
                targetLanguage,
                translatedTitle,
                translatedDescription
        );
    }

    // Task Entity를 TaskResponse DTO로 변환
    private TaskResponse toResponse(Task task) {

        return new TaskResponse(
                task.getTaskId(),
                task.getProject().getProjectId(),
                task.getTitle(),
                task.getDescription(),
                task.getAssignee().getUserId(),
                task.getAssignee().getName(),
                task.getStatus(),
                task.getDeadline(),
                task.getCreatedAt()
        );
    }
}