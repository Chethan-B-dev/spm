package com.example.spm.controller;

import com.example.spm.model.entity.Project;
import com.example.spm.service.AppUserService;
import com.example.spm.service.ManagerService;
import com.example.spm.service.MyAppUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

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
