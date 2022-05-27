package com.example.spm.service;


import com.example.spm.exception.ProjectNotFoundException;
import com.example.spm.exception.RoleNotAcceptableException;
import com.example.spm.model.dto.CreateProjectDTO;
import com.example.spm.model.entity.AppUser;
import com.example.spm.model.entity.Project;
import com.example.spm.model.enums.ProjectStatus;
import com.example.spm.model.enums.UserRole;
import com.example.spm.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;


@Service
@Slf4j
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final AppUserService appUserService;
    private final AdminService adminService;

    public List<Project> getAllProjects(Integer managerId) {
        return projectRepository.findByManagerIdOrderByFromDateDesc(managerId);
    }

    public Project createProject(CreateProjectDTO createProjectDTO, MyAppUserDetails myAppUserDetails) {
        Project project = Project.builder()
                .description(createProjectDTO.getDescription())
                .name(createProjectDTO.getProjectName())
                .manager(appUserService.getUser(myAppUserDetails.getUsername()))
                .fromDate(LocalDate.now())
                .toDate(createProjectDTO.getToDate().toLocalDate())
                .status(ProjectStatus.IN_PROGRESS)
                .build();

        return projectRepository.save(project);
    }

    public List<AppUser> getAllVerifiedEmployees(Project project) {
        return adminService.getVerifiedUsers().stream().filter(
                appUser -> (appUser.getRole().equals(UserRole.EMPLOYEE) && !project.getUsers().contains(appUser))
        ).collect(Collectors.toList());
    }

    public Project addUsersToProject(Project project, List<Integer> userIds) {
        userIds.forEach(userId -> {
            AppUser appUser = adminService.checkIfUserExists(userId);
            if (appUser.getRole().equals(UserRole.EMPLOYEE))
                project.getUsers().add(appUser);
            else
                throw new RoleNotAcceptableException("Role '" + appUser.getRole() + "' is not acceptable for the current action");
        });

        return projectRepository.save(project);
    }

    public List<AppUser> getAllEmployeesOfTheProject(Project project) {
        return project.getUsers();
    }

    public Project getProjectById(Integer projectId) {
        return checkIfProjectExists(projectId);
    }


    private Project checkIfProjectExists(Integer projectId) {
        return projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project with the id '" + projectId + "' not found"));
    }

}
