package com.example.spm.repository;

import com.example.spm.model.entity.Project;
import com.example.spm.model.entity.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TaskRepository extends JpaRepository<Task, Integer> {

    List<Task> findAllByProjectId(Integer projectId);

    List<Task> findAllByProjectIdAndUserId(Integer projectId, Integer userId);

    @Query(
            value = "SELECT * FROM task t, project p WHERE t.project_id = p.id and p.manager_id = :managerId and t.name LIKE %:searchKey%",
            nativeQuery = true)
    List<Task> getAllTasksWithSearchKey(Integer managerId, String searchKey);

//    List<Task> findAllByProjectManagerIdAndNameContaining(Integer managerId, String searchKey);

}
