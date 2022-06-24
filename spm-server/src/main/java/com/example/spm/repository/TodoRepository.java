package com.example.spm.repository;

import com.example.spm.model.entity.Task;
import com.example.spm.model.entity.Todo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface TodoRepository extends JpaRepository<Todo, Integer> {

    List<Todo> findAllByTaskId(Integer taskId);

    @Query(
            value = "SELECT * FROM todo td, task ts, project p WHERE td.task_id = ts.id and ts.project_id = p.id and p.manager_id = :managerId and LOWER(td.name) LIKE %:searchKey%",
            nativeQuery = true)
    List<Todo> getAllTodosWithSearchKey(Integer managerId, String searchKey);

//    List<Todo> findAllByTaskProjectManagerIdAndNameContaining(Integer managerId, String searchKey);
}
