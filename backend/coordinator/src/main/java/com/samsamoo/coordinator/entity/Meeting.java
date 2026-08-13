package com.samsamoo.coordinator.entity;

import com.samsamoo.coordinator.entity.enums.MeetingStatus;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "meeting")
public class Meeting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "meeting_id")
    private Long meetingId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project_id", nullable = false)
    private Project project;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(name = "scheduled_at", nullable = false)
    private LocalDateTime scheduledAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private MeetingStatus status;

    @Column(name = "is_ai_recommended", nullable = false)
    private boolean aiRecommended;

    @Lob
    @Column(name = "manual_content")
    private String manualContent;

    protected Meeting() {
    }

    public Meeting(
            Project project,
            String title,
            LocalDateTime scheduledAt,
            boolean aiRecommended
    ) {
        this.project = project;
        this.title = title;
        this.scheduledAt = scheduledAt;
        this.status = MeetingStatus.SCHEDULED;
        this.aiRecommended = aiRecommended;
    }

    public Long getMeetingId() {
        return meetingId;
    }

    public Project getProject() {
        return project;
    }

    public String getTitle() {
        return title;
    }

    public LocalDateTime getScheduledAt() {
        return scheduledAt;
    }

    public MeetingStatus getStatus() {
        return status;
    }

    public boolean isAiRecommended() {
        return aiRecommended;
    }

    public String getManualContent() {
        return manualContent;
    }

    public void updateManualContent(String manualContent) {
        this.manualContent = manualContent;
    }
}