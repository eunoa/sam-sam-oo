package com.samsamoo.coordinator.entity;

import com.samsamoo.coordinator.entity.enums.TaskStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "task")
public class Task {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "task_id")
    private Long taskId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignee_id", nullable = false)
    private User assignee;

    @Column(nullable = false, length = 100)
    private String title;

    @Lob
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private TaskStatus status;

    private LocalDateTime deadline;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected Task() {
    }

    public Task(Project project,
                User assignee,
                String title,
                String description,
                LocalDateTime deadline) {

        this.project = project;
        this.assignee = assignee;
        this.title = title;
        this.description = description;
        this.status = TaskStatus.TODO;
        this.deadline = deadline;
        this.createdAt = LocalDateTime.now();
    }

    public Long getTaskId() {
        return taskId;
    }

    public Project getProject() {
        return project;
    }

    public User getAssignee() {
        return assignee;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public TaskStatus getStatus() {
        return status;
    }

    public LocalDateTime getDeadline() {
        return deadline;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}