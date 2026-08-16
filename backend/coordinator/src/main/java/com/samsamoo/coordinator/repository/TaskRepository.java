package com.samsamoo.coordinator.repository;

import com.samsamoo.coordinator.entity.Task;
import com.samsamoo.coordinator.entity.enums.TaskStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Long> {

    // 프로젝트의 전체 Task 조회
    List<Task> findByProject_ProjectId(Long projectId);

    // 프로젝트의 특정 상태 Task 조회
    List<Task> findByProject_ProjectIdAndStatus(
            Long projectId,
            TaskStatus status
    );
}