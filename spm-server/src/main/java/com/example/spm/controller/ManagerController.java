package com.example.spm.controller;

import com.example.spm.model.dto.CreateProjectDTO;
import com.example.spm.model.dto.ProjectUserDTO;
import com.example.spm.model.entity.AppUser;
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

import javax.transaction.Transactional;
import javax.validation.Valid;
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

    @GetMapping("/employees")
    public ResponseEntity<List<AppUser>> getAllPagedEmployees (
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @RequestParam(required = false) Integer pageNumber
    ) {
        System.out.println("came here");
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        pageNumber = pageNumber != null ? pageNumber : 0;
        return new ResponseEntity<>(
                managerService.getAllPagedEmployees(pageNumber), HttpStatus.OK
        );
    }

    @GetMapping("/project/{projectId}")
    public ResponseEntity<Project> getProjectById (
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer projectId
    ) {
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getProjectById(projectId, loggedInUser), HttpStatus.OK
        );
    }

    @GetMapping("/project/{projectId}/employees")
    public ResponseEntity<List<AppUser>> getEmployeesProjectById (
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer projectId
    ) {
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getAllEmployeesOfTheProject(projectId, loggedInUser), HttpStatus.OK
        );
    }

    @GetMapping("/employees/{projectId}")
    public ResponseEntity<List<AppUser>> getAllProjectEmployees (
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer projectId
    ) {
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                managerService.getAllVerifiedEmployees(projectId, loggedInUser), HttpStatus.OK
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
                managerService.createProject(createProjectDTO, loggedInUser), HttpStatus.OK
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
                managerService.addUsersToProject(projectId, projectUserDTO.getUserIds()), HttpStatus.OK
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
