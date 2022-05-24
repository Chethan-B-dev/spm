package com.example.spm.service;


import com.example.spm.exception.*;
import com.example.spm.model.dto.CreateProjectDTO;
import com.example.spm.model.dto.CreateTaskDTO;
import com.example.spm.model.dto.UpdateTaskDTO;
import com.example.spm.model.entity.AppUser;
import com.example.spm.model.entity.Project;
import com.example.spm.model.entity.Task;
import com.example.spm.model.enums.*;
import com.example.spm.repository.AppUserRepository;
import com.example.spm.repository.ProjectRepository;
import com.example.spm.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ManagerService {
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final AppUserRepository appUserRepository;
    private final AdminService adminService;
    private final AppUserService appUserService;

    private final int pageSize = 2;

    public List<Project> getAllProjects(Integer managerId) {
        return projectRepository.findByManagerIdOrderByFromDateDesc(managerId);
    }

    public List<AppUser> getAllVerifiedEmployees(Integer projectId, MyAppUserDetails loggedInUser) {
        Project project = checkIfProjectExists(projectId);
        checkIfProjectBelongsToManager(project, loggedInUser.getUser().getId());
        // returning all employees who are not part of the project
        return adminService.getVerifiedUsers().stream().filter(
                appUser -> (appUser.getRole().equals(UserRole.EMPLOYEE) && !project.getUsers().contains(appUser))
        ).collect(Collectors.toList());
    }

    public Project createProject(CreateProjectDTO createProjectDTO, MyAppUserDetails myAppUserDetails) {

        if (projectRepository.existsByName(createProjectDTO.getProjectName())) {
            throw new ProjectAlreadyExistsException(
                    "Project with the name '" + createProjectDTO.getProjectName() + "' already exists"
            );
        }


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

    public Project addUsersToProject(Integer projectId, List<Integer> userIds) {
        Project project = checkIfProjectExists(projectId);
        userIds.forEach(userId -> {
            AppUser appUser = adminService.checkIfUserExists(userId);
            if (appUser.getRole().equals(UserRole.EMPLOYEE))
                project.getUsers().add(appUser);
            else
                throw new RoleNotAcceptableException("Role '" + appUser.getRole() + "' is not acceptable for the current action");
        });

        return projectRepository.save(project);
    }

    public List<AppUser> getAllEmployeesOfTheProject(Integer projectId, MyAppUserDetails loggedInUser) {
        Project project = checkIfProjectExists(projectId);
        // if the project does not belong to that manager
        checkIfProjectBelongsToManager(project, loggedInUser.getUser().getId());
        return project.getUsers();
    }

    public List<AppUser> getAllPagedEmployees(int pageNumber) {
        Pageable paging = PageRequest.of(pageNumber, pageSize, Sort.by("id").ascending());
        return appUserRepository.findAllByStatusAndRole(UserStatus.VERIFIED, UserRole.EMPLOYEE, paging);
    }

    public Project getProjectById(Integer projectId, MyAppUserDetails loggedInUser) {
        Project project = checkIfProjectExists(projectId);
        // if the project does not belong to that manager
        checkIfProjectBelongsToManager(project, loggedInUser.getUser().getId());
        return project;
    }

    private void checkIfProjectBelongsToManager(Project project, Integer managerId) {
        if (!project.getManager().getId().equals(managerId))
            throw new ActionNotAllowedException("Cannot Access this project resource");
    }

    public void handleProjectValidationErrors(BindingResult bindingResult) {
        StringBuilder errors = new StringBuilder();
        if (bindingResult.hasFieldErrors()) {
            bindingResult.getFieldErrors().forEach(fieldError ->
                    errors.append(fieldError.getField()).append(" : ").append(fieldError.getDefaultMessage()).append(",")
            );
            throw new ProjectValidationException(errors.substring(0, errors.length() - 1));
        }
    }

    private Project checkIfProjectExists(Integer projectId) {
        Optional<Project> projectOptional = projectRepository.findById(projectId);
        if (projectOptional.isEmpty())
            throw new ProjectNotFoundException("Project with the id '" + projectId + "' not found");
        return projectOptional.get();
    }

    public Task createTask(CreateTaskDTO createTaskDTO, MyAppUserDetails loggedInUser, Integer projectId) {

        Project project = checkIfProjectExists(projectId);
        AppUser employee = adminService.checkIfUserExists(createTaskDTO.getUserId());

        if (!employee.getRole().equals(UserRole.EMPLOYEE))
            throw new ActionNotAllowedException("You can assign a task only to an employee");

        Task task = Task.builder()
                .name(createTaskDTO.getTaskName())
                .createdDate(LocalDate.now())
                .description(createTaskDTO.getDescription())
                .project(project)
                // if task priority is not provided let us default it to LOW
                .priority(createTaskDTO.getPriority() != null ? createTaskDTO.getPriority() : TaskPriority.LOW)
                .status(TaskStatus.CREATED)
                .user(employee)
                .deadLine(createTaskDTO.getDeadline().toLocalDate())
                .build();

        return taskRepository.save(task);
    }

    public Task getTaskById(Integer taskId) {
        return checkIfTaskExists(taskId);
    }


    private Task checkIfTaskExists(Integer taskId) {
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if (taskOptional.isEmpty()) {
            throw new TaskNotFoundException("Task with id '" + taskId + "' does not exists");
        }
        return taskOptional.get();
    }

    public List<Task> getAllProjectTasks(Integer projectId, MyAppUserDetails loggedInUser) {
        Project project = checkIfProjectExists(projectId);
        checkIfProjectBelongsToManager(project, loggedInUser.getUser().getId());
        return taskRepository.findAllByProjectId(projectId);
    }

    public Task updateTask(Integer taskId, UpdateTaskDTO updateTaskDTO) {
        Task task = checkIfTaskExists(taskId);
        task.setName(updateTaskDTO.getTaskName());
        task.setDeadLine(updateTaskDTO.getDeadline().toLocalDate());
        task.setPriority(updateTaskDTO.getPriority());
        task.setDescription(updateTaskDTO.getDescription());
        return task;
    }
}
