package com.samsamoo.coordinator.repository;

import com.samsamoo.coordinator.entity.ProjectMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProjectMemberRepository extends JpaRepository<ProjectMember, Long> {

    List<ProjectMember> findByUser_UserId(Long userId);

    List<ProjectMember> findByProject_ProjectId(Long projectId);

    Optional<ProjectMember> findByProject_ProjectIdAndUser_UserId(Long projectId, Long userId);

    boolean existsByProject_ProjectIdAndUser_UserId(Long projectId, Long userId);
}
