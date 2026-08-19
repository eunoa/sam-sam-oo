package com.samsamoo.coordinator.repository;

import com.samsamoo.coordinator.entity.UserAvailability;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserAvailabilityRepository extends JpaRepository<UserAvailability, Long> {

    List<UserAvailability> findByUser_UserId(Long userId);

    void deleteByUser_UserId(Long userId);
}
