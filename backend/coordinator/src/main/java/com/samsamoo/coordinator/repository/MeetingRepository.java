package com.samsamoo.coordinator.repository;

import com.samsamoo.coordinator.entity.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
    // 프로젝트별 회의 목록 조회
    List<Meeting> findByProject_ProjectId(Long projectId);
}
