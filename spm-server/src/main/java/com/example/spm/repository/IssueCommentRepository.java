package com.example.spm.repository;

import com.example.spm.model.entity.IssueComment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface IssueCommentRepository extends JpaRepository<IssueComment, Integer> {
    List<IssueComment> findAllByIssueIdOrderByIdDesc(Integer issueId);
}
