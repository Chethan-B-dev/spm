package com.example.spm.controller;

import com.example.spm.model.dto.*;
import com.example.spm.model.entity.*;
import com.example.spm.service.AppUserService;
import com.example.spm.service.IssueService;
import com.example.spm.service.ManagerService;
import com.example.spm.service.MyAppUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.transaction.Transactional;
import javax.validation.Valid;
import lombok.extern.slf4j.Slf4j;
import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;
    //todo: just for quick testing we are using issueservice directly later will move everything to managerservice
    private final IssueService issueService;

    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getAllProjectsByManagerId (
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ) {
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getAllProjectsByManagerId(loggedInUser.getUser().getId()), HttpStatus.OK
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
            @PathVariable Integer projectId
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
            @PathVariable Integer projectId
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
            @PathVariable Integer projectId
    ) {
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getAllVerifiedEmployees(projectId, loggedInUser),
                HttpStatus.OK
        );
    }

    @PostMapping("/create-project")
    public ResponseEntity<Project> createProject (
            @RequestBody @Valid CreateProjectDTO createProjectDTO,
            BindingResult bindingResult,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        managerService.handleProjectValidationErrors(bindingResult);
        return new ResponseEntity<>(
                managerService.createProject(createProjectDTO, loggedInUser),
                HttpStatus.OK
        );
    }

    @Transactional
    @PutMapping("/assign-user/{projectId}")
    public ResponseEntity<Project> addUserToProject (
            @PathVariable Integer projectId,
            @RequestBody ProjectUserDTO projectUserDTO,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.addUsersToProject(projectId, projectUserDTO.getUserIds()),
                HttpStatus.OK
        );
    }
    /*
    ** todo: create project
    ** todo: get project by its id -- if project id does not exists throw ProjectNotFoundException and handle it in GlobalExceptionHandler
    ** assign user to a project
    * { userIds : [1,3,4,5] , projectId : 4}
    * for loop if (role != manager) add to project
    **
    *
    *
    ** update project
    ** delete Project - very complex
     */

    @PostMapping("/{projectId}/create-task")
    public ResponseEntity<Task> createTask (
            @RequestBody @Valid CreateTaskDTO createTaskDTO,
            BindingResult bindingResult,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer projectId
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
//        managerService.handleProjectValidationErrors(bindingResult);
        return new ResponseEntity<>(
                managerService.createTask(createTaskDTO, loggedInUser, projectId),
                HttpStatus.OK
        );
    }

    @GetMapping("/tasks/{projectId}")
    public ResponseEntity<List<Task>> getAllProjectTasks (
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer projectId
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
            @PathVariable Integer taskId
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getTaskById(taskId),
                HttpStatus.OK
        );
    }
    @Transactional
    @PutMapping("/edit-task/{taskId}")
    public ResponseEntity<Task> updateTask (
            @PathVariable Integer taskId,
            @RequestBody UpdateTaskDTO updateTaskDTO,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
            managerService.updateTask(taskId, updateTaskDTO),
                HttpStatus.OK
        );
    }

    @PostMapping("/{taskId}/create-todo")
    public ResponseEntity<Todo> createTodo(
            @RequestBody @Valid CreateTodoDTO createTodoDTO,
            BindingResult bindingResult,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer taskId
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.createTodo(createTodoDTO, loggedInUser, taskId),
                HttpStatus.OK
        );
    }

    @GetMapping("/todo/{todoId}")
    public ResponseEntity<Todo> getTodoByTodoId(
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer todoId
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getTodoById(todoId),
                HttpStatus.OK
        );
    }

    @GetMapping("/todos/{taskId}")
    public ResponseEntity<List<Todo>> getAllTaskTodos (
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer taskId
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getAllTaskTodos(taskId, loggedInUser),
                HttpStatus.OK
        );
    }

    @Transactional
    @PutMapping("/edit-todo/{todoId}")
    public ResponseEntity<Todo> updateTodo(
            @RequestBody UpdateTodoDTO updateTodoDTO,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer todoId
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.updateTodo(todoId, updateTodoDTO),
                HttpStatus.OK
        );
    }

    @GetMapping("/issues/{projectId}")
    public ResponseEntity<List<Issue>> getAllProjectIssues(@PathVariable Integer projectId, MyAppUserDetails myAppUserDetails) {
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(managerService.getAllIssues(projectId), HttpStatus.OK);
    }

    @GetMapping("/issue/{issueId}")
    public ResponseEntity<Issue> getIssueByIssueId(
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer issueId
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getIssueById(issueId),
                HttpStatus.OK
        );
    }

    @PutMapping("/edit-issue/{issueId}")
    public ResponseEntity<Issue> updateIssue(
            @RequestBody UpdateIssueDTO updateIssueDTO,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer issueId
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.updateIssue(issueId, updateIssueDTO),
                HttpStatus.OK
        );
    }

    @PostMapping("/comment/{issueId}")
    public ResponseEntity<IssueComment> addComment(
            @PathVariable Integer issueId,
            @RequestBody AddCommentDTO addCommentDTO,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(managerService.addComment(addCommentDTO, issueId), HttpStatus.OK);
    }

    @GetMapping("/comment/{issueId}")
    public ResponseEntity<List<IssueComment>> getComments(
            @PathVariable Integer issueId,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(managerService.getComments(issueId), HttpStatus.OK);
    }

    @DeleteMapping("/delete-comment/{commentId}")
    public ResponseEntity<Boolean> deleteComment(
            @PathVariable Integer commentId,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        managerService.deleteComment(commentId, loggedInUser);
        return new ResponseEntity<>(true, HttpStatus.GONE);
    }

}
