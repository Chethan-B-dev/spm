package com.example.spm.controller;

import com.example.spm.model.dto.*;
import com.example.spm.model.entity.*;
import com.example.spm.service.AppUserService;
import com.example.spm.service.EmployeeService;
import com.example.spm.service.MyAppUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@Slf4j
@RestController
@RequestMapping("/api/employee")
@RequiredArgsConstructor
public class EmployeeController {
    private final EmployeeService employeeService;

    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getAllProjectsByEmployee (
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ) {
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                employeeService.getAllProjectsByEmployee(loggedInUser.getUser()), HttpStatus.OK
        );
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<Project> getProjectById (
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer projectId
    ) {
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                employeeService.getProjectById(projectId, loggedInUser),
                HttpStatus.OK
        );
    }

    @GetMapping("/task/{taskId}")
    public ResponseEntity<Task> getTaskByTaskId(
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer taskId
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                employeeService.getTaskById(taskId),
                HttpStatus.OK
        );
    }


    @PutMapping("/edit-task/{taskId}")
    public ResponseEntity<Task> updateTask (
            @PathVariable Integer taskId,
            @RequestBody UpdateTaskDTO updateTaskDTO,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                employeeService.updateTask(taskId, updateTaskDTO),
                HttpStatus.OK
        );
    }

    @GetMapping("/todo/{todoId}")
    public ResponseEntity<Todo> getTodoByTodoId(
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer todoId
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                employeeService.getTodoById(todoId),
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
                employeeService.getAllTaskTodos(taskId, loggedInUser),
                HttpStatus.OK
        );
    }

    @PutMapping("/edit-todo/{todoId}")
    public ResponseEntity<Todo> updateTodo(
            @RequestBody UpdateTodoDTO updateTodoDTO,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer todoId
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                employeeService.updateTodo(todoId, updateTodoDTO),
                HttpStatus.OK
        );
    }

    @GetMapping("/issue/{issueId}")
    public ResponseEntity<Issue> getIssueByIssueId(
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer issueId
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                employeeService.getIssueById(issueId),
                HttpStatus.OK
        );
    }

    @GetMapping("/issues/{projectId}")
    public ResponseEntity<List<Issue>> getAllProjectIssues(
            @PathVariable final Integer projectId,
            MyAppUserDetails myAppUserDetails
    ) {
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(employeeService.getAllIssues(projectId), HttpStatus.OK);
    }

    @PostMapping("/create-issue/{projectId}")
    public ResponseEntity<Issue> createIssue(
            @PathVariable Integer projectId,
            @RequestBody CreateIssueDTO createIssueDTO,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(employeeService.createIssue(projectId, createIssueDTO, loggedInUser), HttpStatus.OK);
    }

    @PutMapping("/edit-issue/{issueId}")
    public ResponseEntity<Issue> updateIssue(
            @RequestBody UpdateIssueDTO updateIssueDTO,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer issueId
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                employeeService.updateIssue(issueId, updateIssueDTO),
                HttpStatus.OK
        );
    }

    @PostMapping("/comment/{issueId}")
    public ResponseEntity<IssueComment> addComment(
            @PathVariable Integer issueId,
            @RequestBody AddCommentDTO addCommentDTO,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(employeeService.addComment(addCommentDTO, issueId), HttpStatus.OK);
    }

    @GetMapping("/comment/{issueId}")
    public ResponseEntity<List<IssueComment>> getComments(
            @PathVariable Integer issueId,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(employeeService.getComments(issueId), HttpStatus.OK);
    }
    @DeleteMapping("/delete-comment/{commentId}")
    public ResponseEntity<Boolean> deleteComment(
            @PathVariable Integer commentId,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        employeeService.deleteComment(commentId, loggedInUser);
        return new ResponseEntity<>(true, HttpStatus.GONE);
    }

}
