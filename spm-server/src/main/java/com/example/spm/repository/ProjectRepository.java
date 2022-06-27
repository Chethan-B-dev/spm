package com.example.spm.repository;

import com.example.spm.model.entity.AppUser;
import com.example.spm.model.entity.Project;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Integer> {
    List<Project> findByManagerIdOrderByFromDateDesc (Integer managerId);

    Page<Project> findByManagerIdOrderByFromDateDesc (Integer managerId, Pageable pageable);
    Boolean existsByName (String name);

    List<Project> findAllByUsers(AppUser employee);

    Page<Project> findAllByUsers(AppUser employee, Pageable pageable);

    @Query(
            value = "SELECT * FROM project p WHERE p.manager_id = :managerId and LOWER(p.name) LIKE %:searchKey%",
            nativeQuery = true)
    List<Project> getAllProjectsWithSearchKeyAndManagerId(Integer managerId, String searchKey);

//    List<Project> findAllByManagerIdAndNameContaining(Integer managerId, String searchKey);

    @Query(
            value = "SELECT * FROM project p, project_user pu WHERE p.id = pu.project_id and pu.user_id = :employeeId and LOWER(p.name) LIKE %:searchKey%",
            nativeQuery = true)
    List<Project> getAllProjectsWithSearchKeyAndEmployeeId(Integer employeeId, String searchKey);
}
