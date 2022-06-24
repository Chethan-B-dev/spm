package com.example.spm.service;

import com.example.spm.exception.ActionNotAllowedException;
import com.example.spm.exception.ProjectAlreadyExistsException;
import com.example.spm.model.dto.*;
import com.example.spm.model.entity.*;
import com.example.spm.model.enums.UserRole;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.jsoup.Jsoup;
import org.jsoup.safety.Safelist;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import javax.transaction.Transactional;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ManagerService {
    private final ProjectService projectService;
    private final TaskService taskService;
    private final TodoService todoService;
    private final AdminService adminService;
    private final IssueService issueService;
    private final AppUserService appUserService;

    private final int pageSize = 2;

    public List<Project> getAllProjectsByManagerId(Integer managerId) {
        return projectService.getAllProjectsByManagerId(managerId);
    }

    public PagedData<Project> getAllPagedProjectsByManagerId(int pageNumber, int pageSize, Integer managerId) {
        return projectService.getPagedProjectsByManagerId(pageNumber, pageSize, managerId);
    }

    public Project createProject(CreateProjectDTO createProjectDTO, MyAppUserDetails myAppUserDetails) {
        if (projectService.projectExistsByName(createProjectDTO.getProjectName())) {
            throw new ProjectAlreadyExistsException(
                    "Project with the name '" + createProjectDTO.getProjectName() + "' already exists");
        }
        return projectService.createProject(createProjectDTO, myAppUserDetails);
    }

    public List<AppUser> getAllVerifiedEmployees(Integer projectId, MyAppUserDetails loggedInUser) {
        Project project = projectService.checkIfProjectExists(projectId);
        projectService.checkIfProjectBelongsToManager(project, loggedInUser.getUser().getId());
        // returning all employees who are not part of the project
        return projectService.getAllVerifiedEmployees(project);
    }

    @Transactional
    public Project addUsersToProject(Integer projectId, List<Integer> userIds) {
        Project project = projectService.checkIfProjectExists(projectId);
        return projectService.addUsersToProject(project, userIds);
    }

    public List<AppUser> getAllEmployeesOfTheProject(Integer projectId, MyAppUserDetails loggedInUser) {
        Project project = projectService.checkIfProjectExists(projectId);
        // if the project does not belong to that manager
        projectService.checkIfProjectBelongsToManager(project, loggedInUser.getUser().getId());
        return projectService.getAllEmployeesOfTheProject(project);
    }

    public PagedData<AppUser> getAllPagedEmployees(int pageNumber) {
        return appUserService.getPagedVerifiedEmployees(pageNumber, pageSize);
    }

    public Project getProjectById(Integer projectId, MyAppUserDetails loggedInUser) {
        Project project = projectService.checkIfProjectExists(projectId);
        // if the project does not belong to that manager
        projectService.checkIfProjectBelongsToManager(project, loggedInUser.getUser().getId());
        return projectService.getProjectById(projectId);
    }

    public void handleValidationErrors(BindingResult bindingResult) {
        StringBuilder errors = new StringBuilder();
        if (bindingResult.hasFieldErrors()) {
            bindingResult.getFieldErrors().forEach(fieldError -> errors.append(fieldError.getField()).append(" : ")
                    .append(fieldError.getDefaultMessage()).append(","));
            throw new ActionNotAllowedException(errors.substring(0, errors.length() - 1));
        }
    }

    public Task createTask(CreateTaskDTO createTaskDTO, MyAppUserDetails loggedInUser, Integer projectId) {
        Project project = projectService.checkIfProjectExists(projectId);
        projectService.checkIfProjectBelongsToManager(project, loggedInUser.getUser().getId());
        AppUser employee = adminService.checkIfUserExists(createTaskDTO.getUserId());

        if (!employee.getRole().equals(UserRole.EMPLOYEE))
            throw new ActionNotAllowedException("You can assign a task only to an employee");

        return taskService.createTask(createTaskDTO, project, employee);
    }

    public Task getTaskById(Integer taskId) {
        return taskService.getTaskById(taskId);
    }


    public List<Task> getAllProjectTasks(Integer projectId, MyAppUserDetails loggedInUser) {
        Project project = projectService.checkIfProjectExists(projectId);
        projectService.checkIfProjectBelongsToManager(project, loggedInUser.getUser().getId());
        return taskService.getAllProjectTasks(projectId);
    }

    @Transactional
    @Modifying
    public Task updateTask(Integer taskId, UpdateTaskDTO updateTaskDTO) {
        return taskService.updateTask(taskId, updateTaskDTO);
    }

    public Todo createTodo(CreateTodoDTO createTodoDTO, MyAppUserDetails loggedInUser, Integer taskId) {
        return todoService.createTodo(createTodoDTO, loggedInUser,  taskId);
    }

    public Todo getTodoById(Integer todoId) {
        return todoService.getTodoById(todoId);
    }

    public List<Todo> getAllTaskTodos(Integer taskId, MyAppUserDetails loggedInUser) {
        Task task = taskService.checkIfTaskExists(taskId);
        taskService.checkIfTaskBelongsToEmployee(task, loggedInUser.getUser().getId());
        return todoService.getAllTaskTodos(taskId);
    }

    @Transactional
    @Modifying
    public Todo updateTodo(Integer todoId, UpdateTodoDTO updateTodoDTO) {
        todoService.checkIfTodoExists(todoId);
        return todoService.updateTodo(todoId, updateTodoDTO);
    }

    public void deleteTodo(Integer todoId) {
        todoService.deleteTodo(todoId);
    }

    public List<Issue> getAllIssues(Integer projectId) {
        return issueService.getAllIssues(projectId);
    }

    public Issue getIssueById(Integer issueId) {
        return issueService.getIssueById(issueId);
    }

    public Issue updateIssue(Integer issueId, UpdateIssueDTO updateIssueDTO) {
        return issueService.updateIssue(updateIssueDTO, issueId);
    }

    public IssueComment addComment(AddCommentDTO addCommentDTO, Integer issueId){
        return issueService.addComment(addCommentDTO, issueId);
    }

    public List<IssueComment> getComments(Integer issueId){
        return issueService.getComments(issueId);
    }

    public void deleteComment(Integer commentId, MyAppUserDetails loggedInUser){
        issueService.deleteComment(commentId, loggedInUser);
    }

    public List<Task> getUserTasks(Integer projectId, Integer userId) {
        Project project = projectService.checkIfProjectExists(projectId);
        adminService.checkIfUserExists(userId);
        return project
                .getTasks()
                .stream()
                .filter(task -> task.getUser().getId().equals(userId))
                .collect(Collectors.toList());
    }

    public SearchResultDTO getSearchResult(String searchKey, MyAppUserDetails loggedInUser) {
        // sanitizing search string
        searchKey = Jsoup.clean(searchKey.trim(), Safelist.basic());
        Integer managerId = loggedInUser.getUser().getId();
        List<Project> projects = projectService.getAllProjectsWithSearchKey(searchKey, managerId);
        List<Task> tasks = taskService.getAllTasksWithSearchKey(searchKey, managerId);
        List<Todo> todos = todoService.getAllTasksWithSearchKey(searchKey, managerId);
        List<Issue> issues = issueService.getAllIssuesWithSearchKey(searchKey, managerId);
        List<AppUser> appUsers = appUserService.getAllUsersWithSearchKey(searchKey);
        return SearchResultDTO
                .builder()
                .projects(projects)
                .tasks(tasks)
                .todos(todos)
                .issues(issues)
                .users(appUsers)
                .build();
    }
}
