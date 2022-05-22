package com.example.spm.service;


import com.example.spm.exception.ActionNotAllowedException;
import com.example.spm.exception.ProjectAlreadyExistsException;
import com.example.spm.exception.UserNotFoundException;
import com.example.spm.exception.ProjectNotFoundException;
import com.example.spm.exception.ProjectValidationException;
import com.example.spm.model.dto.CreateProjectDTO;
import com.example.spm.model.entity.AppUser;
import com.example.spm.model.entity.Project;
import com.example.spm.model.enums.ProjectStatus;
import com.example.spm.model.enums.UserRole;
import com.example.spm.repository.AppUserRepository;
import com.example.spm.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.validation.BindingResult;

import javax.validation.constraints.Null;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@Slf4j
@RequiredArgsConstructor
public class ManagerService {
    private final ProjectRepository projectRepository;
    private final AppUserRepository appUserRepository;
    private final AdminService adminService;
    private final AppUserService appUserService;
    public List<Project> getAllProjects(Integer managerId) {
        return projectRepository.findByManagerId(managerId);
    }

    public List<AppUser> getAllVerifiedEmployees () {
        return adminService.getVerifiedUsers().stream().filter(
                appUser -> appUser.getRole().equals(UserRole.EMPLOYEE)
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
        AppUser appUser = appUserRepository.getById(userId);
        Project project = projectRepository.getById(projectId)
        if(appUser == null){
            throw new UserNotFoundException("User with ID '"+userId+"' does not exists");
        }
        if (project == null){

        }
        if ( && appUser.getRole().equals(UserRole.EMPLOYEE)) {
            Project project = projectRepository.getById(projectId);
            System.out.println("Ele to be ins is "+appUser);
//            project.setUsers(Arrays.asList(appUser));
            if(project.getUsers() == null){
                project.setUsers(new ArrayList<>());
            }
            project.getUsers().add(appUser);
            System.out.println(project);
            projectRepository.save(project);
        }
//        System.out.println(project);
//        return projectRepository.save(project);
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
}
