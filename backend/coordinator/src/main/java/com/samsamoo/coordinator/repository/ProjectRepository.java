package com.samsamoo.coordinator.repository;

import com.samsamoo.coordinator.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProjectRepository extends JpaRepository<Project, Long> {
}
