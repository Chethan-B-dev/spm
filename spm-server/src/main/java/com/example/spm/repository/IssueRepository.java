package com.example.spm.repository;

import com.example.spm.model.entity.Issue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface IssueRepository extends JpaRepository<Issue, Integer> {
    List<Issue> findAllByProjectIdOrderByCreatedDateDesc(Integer projectId);

    @Query(
            value = "SELECT * FROM issue i, project p WHERE i.project_id = p.id and p.manager_id = :managerId and LOWER(i.summary) LIKE %:searchKey%",
            nativeQuery = true)
    List<Issue> getAllIssuesWithSearchKey(Integer managerId, String searchKey);

//    List<Issue> findAllByProjectManagerIdAndSummaryContaining(Integer managerId, String searchKey);
}
