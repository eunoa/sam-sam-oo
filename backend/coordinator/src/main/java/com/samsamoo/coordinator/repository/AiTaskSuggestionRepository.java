package com.samsamoo.coordinator.repository;

import com.samsamoo.coordinator.entity.AiTaskSuggestion;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AiTaskSuggestionRepository extends JpaRepository<AiTaskSuggestion, Long> {
    List<AiTaskSuggestion> findByMeeting_MeetingId(Long meetingId);
}
