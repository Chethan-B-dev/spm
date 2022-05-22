package com.example.spm.controller;

import com.example.spm.model.dto.CreateProjectDTO;
import com.example.spm.model.dto.ProjectUserDTO;
import com.example.spm.model.entity.Project;
import com.example.spm.service.AppUserService;
import com.example.spm.service.ManagerService;
import com.example.spm.service.MyAppUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import javax.servlet.Servlet;
import javax.transaction.Transactional;
import javax.validation.Valid;
import java.net.URI;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/manager")
@RequiredArgsConstructor
public class ManagerController {

    private final ManagerService managerService;

    @GetMapping("/projects")
    public ResponseEntity<List<Project>> getAllProjects (@AuthenticationPrincipal MyAppUserDetails myAppUserDetails) {
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getAllProjects(loggedInUser.getUser().getId()), HttpStatus.OK
        );
    }

    @PostMapping("create-project")
    public ResponseEntity<Project> createProject (
            @RequestBody @Valid CreateProjectDTO createProjectDTO,
            BindingResult bindingResult,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        if(bindingResult.hasFieldErrors()) bindingResult.getFieldErrors().forEach(System.out::println);
        return new ResponseEntity<>(
                managerService.createProject(createProjectDTO, myAppUserDetails), HttpStatus.OK
        );
    }

    @Transactional
    @PutMapping("assign-user/{projectId}")
    public void addUserToProject (
            @PathVariable Integer projectId,
            @RequestBody ProjectUserDTO projectUserDTO,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        System.out.println(projectUserDTO.getUserIds());
        for (Integer userId : projectUserDTO.getUserIds()) {
            managerService.addUserToProject(projectId, userId);
            System.out.println(userId);
        }

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

}
