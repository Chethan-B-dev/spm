package com.example.spm.service;

import com.example.spm.exception.ActionNotAllowedException;
import com.example.spm.exception.ProjectNotFoundException;
import com.example.spm.exception.TaskNotFoundException;
import com.example.spm.model.dto.*;
import com.example.spm.model.entity.*;
import com.example.spm.repository.ProjectRepository;
import com.example.spm.repository.TaskRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class EmployeeService {

    private final ProjectRepository projectRepository;
    private final ProjectService projectService;
    private final TaskService taskService;
    private final TodoService todoService;

    private final IssueService issueService;

    public List<Project> getAllProjectsByEmployeeId(AppUser employee) {
        return  projectService.getAllProjectsByEmployeeId(employee);
    }
    public Project getProjectById(Integer projectId, MyAppUserDetails loggedInUser) {
        Project project = checkIfProjectExists(projectId);
        // if the employee is present in the project
        checkIfProjectBelongsToEmployee(project, loggedInUser.getUser());
        return projectService.getProjectById(projectId);
    }

    private void checkIfProjectBelongsToEmployee(Project project, AppUser user) {
        if (!project.getUsers().contains(user))
            throw new ActionNotAllowedException("Cannot Access this project resource");
    }

    private Project checkIfProjectExists(Integer projectId) {
        return projectRepository
                .findById(projectId)
                .orElseThrow(() -> new ProjectNotFoundException("Project with the id '" + projectId + "' not found"));
    }

    public Task getTaskById(Integer taskId) {
        return taskService.getTaskById(taskId);
    }

    public Task updateTask(Integer taskId, UpdateTaskDTO updateTaskDTO) {
        return taskService.updateTask(taskId, updateTaskDTO);
    }

    public Todo getTodoById(Integer todoId) {
        return todoService.getTodoById(todoId);
    }

    public List<Todo> getAllTaskTodos(Integer taskId, MyAppUserDetails loggedInUser) {
        Task task = taskService.checkIfTaskExists(taskId);
        taskService.checkIfTaskBelongsToEmployee(task, loggedInUser.getUser().getId());
        return todoService.getAllTaskTodos(taskId);
    }

    public Todo updateTodo(Integer todoId, UpdateTodoDTO updateTodoDTO) {
        todoService.checkIfTodoExists(todoId);
        return todoService.updateTodo(todoId, updateTodoDTO);
    }

    public Issue createIssue(Integer projectId, CreateIssueDTO createIssueDTO, MyAppUserDetails loggedInUser) {
        Project project = projectService.checkIfProjectExists(projectId);
        return issueService.createIssue(project, createIssueDTO, loggedInUser);
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

}
