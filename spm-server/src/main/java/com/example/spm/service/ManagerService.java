package com.example.spm.service;

import com.example.spm.exception.*;
import com.example.spm.model.dto.*;
import com.example.spm.model.entity.AppUser;
import com.example.spm.model.entity.Project;
import com.example.spm.model.entity.Task;
import com.example.spm.model.entity.Todo;
import com.example.spm.model.enums.UserRole;
import com.example.spm.model.enums.UserStatus;
import com.example.spm.repository.AppUserRepository;
import com.example.spm.repository.ProjectRepository;
import com.example.spm.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ManagerService {
    private final ProjectService projectService;
    private final TaskService taskService;
    private final TodoService todoService;
    private final AdminService adminService;
    private final ProjectRepository projectRepository;
    private final TaskRepository taskRepository;
    private final AppUserRepository appUserRepository;

    private final int pageSize = 2;

    public List<Project> getAllProjects(Integer managerId) {
        return projectService.getAllProjects(managerId);
    }

    public Project createProject(CreateProjectDTO createProjectDTO, MyAppUserDetails myAppUserDetails) {
        if (projectRepository.existsByName(createProjectDTO.getProjectName())) {
            throw new ProjectAlreadyExistsException(
                    "Project with the name '" + createProjectDTO.getProjectName() + "' already exists");
        }
        return projectService.createProject(createProjectDTO, myAppUserDetails);
    }

    public List<AppUser> getAllVerifiedEmployees(Integer projectId, MyAppUserDetails loggedInUser) {
        Project project = checkIfProjectExists(projectId);
        checkIfProjectBelongsToManager(project, loggedInUser.getUser().getId());
        // returning all employees who are not part of the project
        return projectService.getAllVerifiedEmployees(project);
    }

    public Project addUsersToProject(Integer projectId, List<Integer> userIds) {
        Project project = checkIfProjectExists(projectId);
        return projectService.addUsersToProject(project, userIds);
    }

    public List<AppUser> getAllEmployeesOfTheProject(Integer projectId, MyAppUserDetails loggedInUser) {
        Project project = checkIfProjectExists(projectId);
        // if the project does not belong to that manager
        checkIfProjectBelongsToManager(project, loggedInUser.getUser().getId());
        return projectService.getAllEmployeesOfTheProject(project);
    }

    public PagedData<AppUser> getAllPagedEmployees(int pageNumber) {
        Pageable paging = PageRequest.of(pageNumber, pageSize, Sort.by("id").ascending());
        Page<AppUser> employees = appUserRepository.findAllByStatusAndRole(UserStatus.VERIFIED, UserRole.EMPLOYEE, paging);
        return PagedData
                .<AppUser>builder()
                .data(employees.getContent())
                .totalPages(employees.getTotalPages())
                .currentPage(pageNumber)
                .build();
    }

    public Project getProjectById(Integer projectId, MyAppUserDetails loggedInUser) {
        Project project = checkIfProjectExists(projectId);
        // if the project does not belong to that manager
        checkIfProjectBelongsToManager(project, loggedInUser.getUser().getId());
        return projectService.getProjectById(projectId);
    }

    private void checkIfProjectBelongsToManager(Project project, Integer managerId) {
        if (!project.getManager().getId().equals(managerId))
            throw new ActionNotAllowedException("Cannot Access this project resource");
    }

    public void handleProjectValidationErrors(BindingResult bindingResult) {
        StringBuilder errors = new StringBuilder();
        if (bindingResult.hasFieldErrors()) {
            bindingResult.getFieldErrors().forEach(fieldError -> errors.append(fieldError.getField()).append(" : ")
                    .append(fieldError.getDefaultMessage()).append(","));
            throw new ProjectValidationException(errors.substring(0, errors.length() - 1));
        }
    }

    private Project checkIfProjectExists(Integer projectId) {
        return projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project with the id '" + projectId + "' not found"));
    }

    public Task createTask(CreateTaskDTO createTaskDTO, MyAppUserDetails loggedInUser, Integer projectId) {
        Project project = checkIfProjectExists(projectId);
        checkIfProjectBelongsToManager(project, loggedInUser.getUser().getId());
        AppUser employee = adminService.checkIfUserExists(createTaskDTO.getUserId());

        if (!employee.getRole().equals(UserRole.EMPLOYEE))
            throw new ActionNotAllowedException("You can assign a task only to an employee");

        return taskService.createTask(createTaskDTO, project, employee);
    }

    public Task getTaskById(Integer taskId) {
        return taskService.getTaskById(taskId);
    }

    private Task checkIfTaskExists(Integer taskId) {
        return taskRepository
                .findById(taskId)
                .orElseThrow(() -> new TaskNotFoundException("Task with id '" + taskId + "' does not exists"));
    }

    public List<Task> getAllProjectTasks(Integer projectId, MyAppUserDetails loggedInUser) {
        Project project = checkIfProjectExists(projectId);
        checkIfProjectBelongsToManager(project, loggedInUser.getUser().getId());
        return taskService.getAllProjectTasks(projectId);
    }

    public Task updateTask(Integer taskId, UpdateTaskDTO updateTaskDTO) {
        return taskService.updateTask(taskId, updateTaskDTO);
    }

    public Todo createTodo(CreateTodoDTO createTodoDTO, MyAppUserDetails loggedInUser, Integer taskId) {
        return todoService.createTodo(createTodoDTO, loggedInUser, taskId);
    }

    public Todo getTodoById(Integer todoId) {
        return todoService.getTodoById(todoId);
    }

    public List<Todo> getAllTaskTodos(Integer taskId, MyAppUserDetails loggedInUser) {
        Task task = checkIfTaskExists(taskId);
        checkIfTaskBelongsToEmployee(task, loggedInUser.getUser().getId());
        return todoService.getAllTaskTodos(taskId);
    }

    private void checkIfTaskBelongsToEmployee(Task task, Integer employeeId) {
        if (!task.getUser().getId().equals(employeeId))
            throw new ActionNotAllowedException("Cannot access this task resource");
    }

    public Todo updateTodo(Integer todoId, UpdateTodoDTO updateTodoDTO) {
        todoService.checkIfTodoExists(todoId);
        return todoService.updateTodo(todoId, updateTodoDTO);
    }
}
