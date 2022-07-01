package com.example.spm.controller;

import com.example.spm.model.dto.*;
import com.example.spm.model.entity.*;
import com.example.spm.service.AppUserService;
import com.example.spm.service.ManagerService;
import com.example.spm.service.MyAppUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;
    private final AppUserService appUserService;

    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getAllProjectsByManagerId (
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ) {
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getAllProjectsByManagerId(loggedInUser.getUser().getId()), HttpStatus.OK
        );
    }

    @GetMapping("/projects/paged")
    public ResponseEntity<PagedData<Project>> getAllPagedProjectsByManagerId (
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @RequestParam(required = false) Integer pageNumber
    ) {
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        pageNumber = pageNumber != null ? pageNumber - 1 : 0;
        return new ResponseEntity<>(
                managerService.getAllPagedProjectsByManagerId(pageNumber, 7, loggedInUser.getUser().getId()), HttpStatus.OK
        );
    }

    @GetMapping("/employees")
    public ResponseEntity<PagedData<AppUser>> getAllPagedEmployees (
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @RequestParam(required = false) Integer pageNumber
    ) {
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        pageNumber = pageNumber != null ? pageNumber - 1 : 0;
        return new ResponseEntity<>(
                managerService.getAllPagedEmployees(pageNumber),
                HttpStatus.OK
        );
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<Project> getProjectById (
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable final Integer projectId
    ) {
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getProjectById(projectId, loggedInUser),
                HttpStatus.OK
        );
    }

    @GetMapping("/project/{projectId}/employees")
    public ResponseEntity<List<AppUser>> getEmployeesProjectById (
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable final Integer projectId
    ) {
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getAllEmployeesOfTheProject(projectId, loggedInUser),
                HttpStatus.OK
        );
    }

    @GetMapping("/employees/{projectId}")
    public ResponseEntity<List<AppUser>> getAllProjectEmployees (
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable final Integer projectId
    ) {
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getAllVerifiedEmployees(projectId, loggedInUser),
                HttpStatus.OK
        );
    }

    @PostMapping("/create-project")
    public ResponseEntity<Project> createProject (
            @RequestBody @Valid final CreateProjectDTO createProjectDTO,
            BindingResult bindingResult,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        managerService.handleValidationErrors(bindingResult);
        return new ResponseEntity<>(
                managerService.createProject(createProjectDTO, loggedInUser),
                HttpStatus.OK
        );
    }
    @PutMapping("/assign-user/{projectId}")
    public ResponseEntity<Project> addUserToProject (
            @PathVariable final Integer projectId,
            @RequestBody final ProjectUserDTO projectUserDTO,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.addUsersToProject(projectId, projectUserDTO.getUserIds()),
                HttpStatus.OK
        );
    }

    @PostMapping("/{projectId}/create-task")
    public ResponseEntity<Task> createTask (
            @RequestBody @Valid final CreateTaskDTO createTaskDTO,
            BindingResult bindingResult,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable final Integer projectId
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        managerService.handleValidationErrors(bindingResult);
        return new ResponseEntity<>(
                managerService.createTask(createTaskDTO, loggedInUser, projectId),
                HttpStatus.OK
        );
    }

    @GetMapping("/tasks/{projectId}")
    public ResponseEntity<List<Task>> getAllProjectTasks (
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable final Integer projectId
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getAllProjectTasks(projectId, loggedInUser),
                HttpStatus.OK
        );
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<Task> getTaskByTaskId(
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable final Integer taskId
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getTaskById(taskId),
                HttpStatus.OK
        );
    }
    @PutMapping("/edit-task/{taskId}")
    public ResponseEntity<Task> updateTask (
            @PathVariable final Integer taskId,
            @RequestBody @Valid final UpdateTaskDTO updateTaskDTO,
            BindingResult bindingResult,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        managerService.handleValidationErrors(bindingResult);
        return new ResponseEntity<>(
            managerService.updateTask(taskId, updateTaskDTO),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/delete-task/{taskId}")
    public ResponseEntity<Boolean> deleteTask(
            @PathVariable final Integer taskId,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        managerService.deleteTask(taskId, loggedInUser);
        return new ResponseEntity<>(true, HttpStatus.OK);
    }

    @PostMapping("/{taskId}/create-todo")
    public ResponseEntity<Todo> createTodo(
            @RequestBody @Valid final CreateTodoDTO createTodoDTO,
            BindingResult bindingResult,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable final Integer taskId
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        managerService.handleValidationErrors(bindingResult);
        return new ResponseEntity<>(
                managerService.createTodo(createTodoDTO, loggedInUser, taskId),
                HttpStatus.OK
        );
    }

    @GetMapping("/todo/{todoId}")
    public ResponseEntity<Todo> getTodoByTodoId(
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable final Integer todoId
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getTodoById(todoId),
                HttpStatus.OK
        );
    }

    @GetMapping("/todos/{taskId}")
    public ResponseEntity<List<Todo>> getAllTaskTodos (
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable final Integer taskId
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getAllTaskTodos(taskId, loggedInUser),
                HttpStatus.OK
        );
    }

    @PutMapping("/edit-todo/{todoId}")
    public ResponseEntity<Todo> updateTodo(
            @RequestBody @Valid final UpdateTodoDTO updateTodoDTO,
            BindingResult bindingResult,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable final Integer todoId
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        managerService.handleValidationErrors(bindingResult);
        return new ResponseEntity<>(
                managerService.updateTodo(todoId, updateTodoDTO),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/delete-todo/{todoId}")
    public ResponseEntity<Void> deleteTodo(
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable final Integer todoId
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        managerService.deleteTodo(todoId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/issues/{projectId}")
    public ResponseEntity<List<Issue>> getAllProjectIssues(
            @PathVariable final Integer projectId,
            MyAppUserDetails myAppUserDetails
    ) {
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(managerService.getAllIssues(projectId), HttpStatus.OK);
    }

    @GetMapping("/issue/{issueId}")
    public ResponseEntity<Issue> getIssueByIssueId(
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable final Integer issueId
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getIssueById(issueId),
                HttpStatus.OK
        );
    }

    @PutMapping("/edit-issue/{issueId}")
    public ResponseEntity<Issue> updateIssue(
            @RequestBody @Valid final UpdateIssueDTO updateIssueDTO,
            BindingResult bindingResult,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable final Integer issueId
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        managerService.handleValidationErrors(bindingResult);
        return new ResponseEntity<>(
                managerService.updateIssue(issueId, updateIssueDTO),
                HttpStatus.OK
        );
    }

    @DeleteMapping("/delete-issue/{issueId}")
    public ResponseEntity<Boolean> deleteIssue(
            @PathVariable final Integer issueId,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        managerService.deleteIssue(issueId, loggedInUser);
        return new ResponseEntity<>(true, HttpStatus.GONE);
    }

    @PostMapping("/comment/{issueId}")
    public ResponseEntity<IssueComment> addComment(
            @PathVariable final Integer issueId,
            @RequestBody @Valid final AddCommentDTO addCommentDTO,
            BindingResult bindingResult,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        managerService.handleValidationErrors(bindingResult);
        return new ResponseEntity<>(managerService.addComment(addCommentDTO, issueId), HttpStatus.OK);
    }

    @GetMapping("/comment/{issueId}")
    public ResponseEntity<List<IssueComment>> getComments(
            @PathVariable final Integer issueId,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(managerService.getComments(issueId), HttpStatus.OK);
    }

    @DeleteMapping("/delete-comment/{commentId}")
    public ResponseEntity<Boolean> deleteComment(
            @PathVariable final Integer commentId,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        managerService.deleteComment(commentId, loggedInUser);
        return new ResponseEntity<>(true, HttpStatus.GONE);
    }

    @GetMapping("/tasks/{projectId}/{userId}")
    public ResponseEntity<List<Task>> getUserTasks(
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable final Integer projectId,
            @PathVariable final Integer userId
    ) {
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(managerService.getUserTasks(projectId, userId), HttpStatus.OK);
    }

    @GetMapping("/search/{searchKey}")
    public ResponseEntity<SearchResultDTO> getSearchResult(
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable String searchKey
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getSearchResult(searchKey, loggedInUser),
                HttpStatus.OK
        );
    }

    @PutMapping("/edit-designation/{id}")
    public ResponseEntity<AppUser> setDesignation(
            @PathVariable final Integer id,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @RequestBody final SetDesignationDTO setDesignationDTO
    ) {
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                appUserService.setDesignation(id, setDesignationDTO.getDesignation()),
                HttpStatus.CREATED
        );
    }

}
