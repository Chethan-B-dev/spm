package com.example.spm.service;


import com.example.spm.exception.*;
import com.example.spm.model.dto.CreateProjectDTO;
import com.example.spm.model.dto.CreateTaskDTO;
import com.example.spm.model.entity.AppUser;
import com.example.spm.model.entity.Project;
import com.example.spm.model.entity.Task;
import com.example.spm.model.enums.ProjectStatus;
import com.example.spm.model.enums.TaskStatus;
import com.example.spm.model.enums.UserRole;
import com.example.spm.repository.AppUserRepository;
import com.example.spm.repository.ProjectRepository;
import com.example.spm.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.time.LocalDate;
import java.util.ArrayList;
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
    public List<Project> getAllProjects(Integer managerId) {
        return projectRepository.findByManagerId(managerId);
    }

    public List<AppUser> getAllVerifiedEmployees (Integer projectId, MyAppUserDetails loggedInUser) {
        Project project = checkIfProjectExists(projectId);
        checkIfProjectBelongsToManager(project, loggedInUser.getUser().getId());
        // returning all employees who are not part of the project
        return adminService.getVerifiedUsers().stream().filter(
                appUser -> (appUser.getRole().equals(UserRole.EMPLOYEE) && !project.getUsers().contains(appUser))
        ).collect(Collectors.toList());
    }

    public Project createProject(CreateProjectDTO createProjectDTO, MyAppUserDetails myAppUserDetails) {

        if (projectRepository.existsByName(createProjectDTO.getProjectName())){
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

    public void addUserToProject(Integer projectId, Integer userId) {
        AppUser appUser = adminService.checkIfUserExists(userId);
        Project project = checkIfProjectExists(projectId);
        if(appUser == null){
            throw new UserNotFoundException("User with ID '"+userId+"' does not exists");
        }
        if (project == null){
            throw new ProjectNotFoundException("Project with id '"+projectId+"' does not exists");
        }
        if (appUser.getRole().equals(UserRole.EMPLOYEE)) {
            if(project.getUsers() == null){
                project.setUsers(new ArrayList<>());
            }
            project.getUsers().add(appUser);
            System.out.println(project);
            projectRepository.save(project);
        }else {
            throw new RoleNotAcceptableException("Role '"+appUser.getRole()+"' is not acceptable for the current action");
        }
    }

    public List<AppUser> getAllEmployeesOfTheProject (Integer projectId, MyAppUserDetails loggedInUser) {
        Project project = checkIfProjectExists(projectId);
        // if the project does not belong to that manager
        checkIfProjectBelongsToManager(project, loggedInUser.getUser().getId());
        return project.getUsers();
    }

    public Project getProjectById (Integer projectId, MyAppUserDetails loggedInUser) {
        Project project = checkIfProjectExists(projectId);
        // if the project does not belong to that manager
        checkIfProjectBelongsToManager(project, loggedInUser.getUser().getId());
        return project;
    }

    private void checkIfProjectBelongsToManager (Project project, Integer managerId) {
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

    private Project checkIfProjectExists (Integer projectId) {
        Optional<Project> projectOptional = projectRepository.findById(projectId);
        if (projectOptional.isEmpty())
            throw new ProjectNotFoundException("Project with the id " + projectId + " not found");
        return projectOptional.get();
    }

    public Task createTask(CreateTaskDTO createTaskDTO, MyAppUserDetails loggedInUser, Integer projectId) {
        if (!projectRepository.existsById(projectId)){
            throw new ProjectNotFoundException("Project with id '" + projectId + "' does not exists exists");
        }
        Task task = Task.builder()
                .name(createTaskDTO.getTaskName())
                .createdDate(LocalDate.now())
                .description(createTaskDTO.getDescription())
                .project(projectRepository.getById(projectId))
                .priority(createTaskDTO.getPriority())
                .status(TaskStatus.CREATED)
                .user(appUserRepository.getById(createTaskDTO.getUserId()))
                .deadLine(createTaskDTO.getDeadline().toLocalDate())
                .build();

        return taskRepository.save(task);
    }

    public Task getTaskById (Integer taskId) {
        Task task = checkIfTaskExists(taskId);
        return task;
    }


    private Task checkIfTaskExists(Integer taskId) {
        Optional<Task> taskOptional = taskRepository.findById(taskId);
        if(taskOptional.isEmpty()){
            throw new TaskNotFoundException("Task with id '"+taskId+"' does not exists");
        }
        return taskOptional.get();
    }
}
