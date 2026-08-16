package com.samsamoo.coordinator.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ai_task_suggestion")
public class AiTaskSuggestion {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "suggestion_Id")
    private Long suggestionId;

    @ManyToOne
    @JoinColumn(name = "meeting_id", nullable = false)
    private Meeting meeting;

    @Lob
    @Column(nullable = false)
    private String content;

    @Column
    private boolean approved;

    protected AiTaskSuggestion(){
    }

    public AiTaskSuggestion(Meeting meeting, String content) {
        this.meeting = meeting;
        this.content = content;
        this.approved = false;
    }

    public Long getSuggestionId() {
        return suggestionId;
    }

    public Meeting getMeeting() {
        return meeting;
    }

    public String getContent() {
        return content;
    }

    public boolean isApproved() {
        return approved;
    }

    public void approve() {
        this.approved = true;
    }
}
