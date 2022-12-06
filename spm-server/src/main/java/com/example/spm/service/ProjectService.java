package com.example.spm.service;


import com.example.spm.exception.ActionNotAllowedException;
import com.example.spm.exception.ProjectNotFoundException;
import com.example.spm.exception.RoleNotAcceptableException;
import com.example.spm.model.dto.CreateProjectDTO;
import com.example.spm.model.dto.PagedData;
import com.example.spm.model.entity.AppUser;
import com.example.spm.model.entity.Project;
import com.example.spm.model.enums.ProjectStatus;
import com.example.spm.model.enums.UserRole;
import com.example.spm.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import static java.util.Optional.ofNullable;
import static java.util.stream.Collectors.toList;


@Service
@Slf4j
@RequiredArgsConstructor
public class ProjectService {
    private final ProjectRepository projectRepository;
    private final AppUserService appUserService;

    @Transactional
    public List<Project> getAllProjectsByManagerId(Integer managerId) {
        return projectRepository.findByManagerIdOrderByFromDateDesc(managerId);
    }

    @Transactional
    public PagedData<Project> getPagedProjectsByManagerId(int pageNumber, int pageSize, Integer managerId) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id").descending());
        Page<Project> pagedProjects = projectRepository.findByManagerIdOrderByFromDateDesc(managerId, pageable);
        return PagedData
                .<Project>builder()
                .data(pagedProjects.getContent())
                .totalPages(pagedProjects.getTotalPages())
                .currentPage(pageNumber)
                .build();
    }

    @Transactional
    public List<Project> getAllProjectsByEmployeeId(AppUser employee) {
        return projectRepository.findAllByUsers(employee);
    }

    @Transactional
    public PagedData<Project> getPagedProjectsByEmployee(int pageNumber, int pageSize, AppUser employee) {
        Pageable pageable = PageRequest.of(pageNumber, pageSize, Sort.by("id").descending());
        Page<Project> pagedProjects = projectRepository.findAllByUsers(employee, pageable);
        return PagedData
                .<Project>builder()
                .data(pagedProjects.getContent())
                .totalPages(pagedProjects.getTotalPages())
                .currentPage(pageNumber)
                .build();
    }

    public Project createProject(CreateProjectDTO createProjectDTO, MyAppUserDetails myAppUserDetails) {

        if (!myAppUserDetails.getUser().getRole().equals(UserRole.MANAGER)) {
            throw new ActionNotAllowedException("Only manager can create a project");
        }

        Project project = Project
                .builder()
                .description(createProjectDTO.getDescription())
                .name(createProjectDTO.getName())
                .manager(appUserService.getUser(myAppUserDetails.getUsername()))
                .fromDate(LocalDate.now())
                .toDate(createProjectDTO.getToDate())
                .status(ProjectStatus.IN_PROGRESS)
                .files(ofNullable(createProjectDTO.getFiles()).orElse("[]"))
                .build();

        return projectRepository.save(project);
    }

    @Transactional
    @Modifying
    public Project editProject(Integer projectId, CreateProjectDTO createProjectDTO, MyAppUserDetails myAppUserDetails) {
        Project project = checkIfProjectExists(projectId);
        checkIfProjectBelongsToManager(project, myAppUserDetails.getUser().getId());
        project.setName(createProjectDTO.getName());
        project.setDescription(createProjectDTO.getDescription());
        project.setToDate(createProjectDTO.getToDate());
        project.setStatus(createProjectDTO.getStatus());
        Optional.ofNullable(createProjectDTO.getFiles()).ifPresent(project::setFiles);
        return project;
    }

    public List<AppUser> getAllVerifiedEmployees(Project project) {
        Set<AppUser> users = new HashSet<>(project.getUsers());
        return appUserService
                .getVerifiedUsers()
                .stream()
                .filter(appUser -> appUser.getRole().equals(UserRole.EMPLOYEE) && !users.contains(appUser))
                .collect(toList());
    }

    @Transactional
    @Modifying
    public Project addUsersToProject(Project project, List<Integer> userIds) {
        userIds.forEach(userId -> {
            AppUser appUser = appUserService.checkIfUserExists(userId);
            if (appUser.getRole().equals(UserRole.EMPLOYEE)) {
                project.getUsers().add(appUser);
            } else {
                throw new RoleNotAcceptableException("Role '" + appUser.getRole() + "' is not acceptable for the current action");
            }
        });
        return project;
    }

    public List<AppUser> getAllEmployeesOfTheProject(Project project) {
        return project.getUsers();
    }

    @Transactional
    public Project getProjectById(Integer projectId) {
        return checkIfProjectExists(projectId);
    }

    @Transactional
    public Project checkIfProjectExists(Integer projectId) {
        return projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project with the id '" + projectId + "' not found"));
    }

    public boolean projectExistsByName(String projectName) {
        return projectRepository.existsByName(projectName);
    }

    public void checkIfProjectBelongsToManager(Project project, Integer managerId) {
        if (!project.getManager().getId().equals(managerId))
            throw new ActionNotAllowedException("Cannot Access this project resource");
    }

    @Transactional
    public List<Project> getAllProjectsWithSearchKeyAndManagerId(String searchKey, Integer managerId) {
        return projectRepository.getAllProjectsWithSearchKeyAndManagerId(managerId, searchKey);
    }

    @Transactional
    public List<Project> getAllProjectsWithSearchKeyAndEmployeeId(String searchKey, Integer employeeId) {
        return projectRepository.getAllProjectsWithSearchKeyAndEmployeeId(employeeId, searchKey);
    }
}
