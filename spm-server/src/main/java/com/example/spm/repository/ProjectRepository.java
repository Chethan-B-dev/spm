package com.example.spm.repository;

import com.example.spm.model.entity.Project;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
    List<Project> findByManagerIdOrderByFromDateDesc (Integer managerId);
    Boolean existsByName (String name);
}
