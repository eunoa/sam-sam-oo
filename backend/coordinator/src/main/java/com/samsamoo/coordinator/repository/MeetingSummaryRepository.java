package com.samsamoo.coordinator.repository;

import com.samsamoo.coordinator.entity.MeetingSummary;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface MeetingSummaryRepository extends JpaRepository<MeetingSummary,Long> {
    // 회의 ID로 AI 요약 조회
    Optional<MeetingSummary> findByMeeting_MeetingId(Long meetingId);
}
