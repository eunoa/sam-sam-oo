package com.samsamoo.coordinator.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "meeting_summary")
public class MeetingSummary {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "summary_id")
    private Long summaryId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "meeting_id", nullable = false, unique = true)
    private Meeting meeting;

    @Lob
    @Column(nullable = false)
    private String summary;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected MeetingSummary() {
    }

    public MeetingSummary(Meeting meeting, String summary) {
        this.meeting = meeting;
        this.summary = summary;
        this.createdAt = LocalDateTime.now();
    }

    public Long getSummaryId() {
        return summaryId;
    }

    public Meeting getMeeting() {
        return meeting;
    }

    public String getSummary() {
        return summary;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }
}