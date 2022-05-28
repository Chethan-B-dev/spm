package com.example.spm.repository;

import com.example.spm.model.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Integer> {
    List<Issue> findAllByProjectIdOrderByCreatedDateDesc(Integer projectId);
}
