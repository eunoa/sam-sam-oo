package com.samsamoo.coordinator.repository;

import com.samsamoo.coordinator.entity.Meeting;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MeetingRepository extends JpaRepository<Meeting, Long> {
}
