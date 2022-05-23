package com.example.spm.repository;

import com.example.spm.model.entity.Project;
import com.example.spm.model.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {

    List<Task> findAllByProjectId(Integer projectId);
}
