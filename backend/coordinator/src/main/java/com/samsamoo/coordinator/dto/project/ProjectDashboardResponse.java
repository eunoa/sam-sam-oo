package com.samsamoo.coordinator.dto.project;

import java.time.LocalDateTime;
import java.util.List;

public class ProjectDashboardResponse {

    private TaskStatusSummary taskStatus;
    private List<MeetingSummaryItem> upcomingMeetings;
    private List<MeetingSummaryItem> recentMeetings;

    public ProjectDashboardResponse(TaskStatusSummary taskStatus,
                                    List<MeetingSummaryItem> upcomingMeetings,
                                    List<MeetingSummaryItem> recentMeetings) {
        this.taskStatus = taskStatus;
        this.upcomingMeetings = upcomingMeetings;
        this.recentMeetings = recentMeetings;
    }

    public TaskStatusSummary getTaskStatus() {
        return taskStatus;
    }

    public List<MeetingSummaryItem> getUpcomingMeetings() {
        return upcomingMeetings;
    }

    public List<MeetingSummaryItem> getRecentMeetings() {
        return recentMeetings;
    }

    public static class TaskStatusSummary {
        private int total;
        private int todo;
        private int inProgress;
        private int done;

        public TaskStatusSummary(int total, int todo, int inProgress, int done) {
            this.total = total;
            this.todo = todo;
            this.inProgress = inProgress;
            this.done = done;
        }

        public int getTotal() {
            return total;
        }

        public int getTodo() {
            return todo;
        }

        public int getInProgress() {
            return inProgress;
        }

        public int getDone() {
            return done;
        }
    }

    public static class MeetingSummaryItem {
        private Long meetingId;
        private String title;
        private LocalDateTime scheduledAt;

        public MeetingSummaryItem(Long meetingId, String title, LocalDateTime scheduledAt) {
            this.meetingId = meetingId;
            this.title = title;
            this.scheduledAt = scheduledAt;
        }

        public Long getMeetingId() {
            return meetingId;
        }

        public String getTitle() {
            return title;
        }

        public LocalDateTime getScheduledAt() {
            return scheduledAt;
        }
    }
}
