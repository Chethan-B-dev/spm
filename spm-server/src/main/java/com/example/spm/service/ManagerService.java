package com.example.spm.service;


import com.example.spm.exception.ProjectAlreadyExistsException;
import com.example.spm.model.dto.CreateProjectDTO;
import com.example.spm.model.entity.Project;
import com.example.spm.model.enums.ProjectStatus;
import com.example.spm.repository.ProjectRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class ManagerService {
    private final ProjectRepository projectRepository;

    private final AppUserService appUserService;
    public List<Project> getAllProjects(Integer managerId) {
        return projectRepository.findByManagerId(managerId);
    }

    public Project createProject(CreateProjectDTO createProjectDTO, MyAppUserDetails myAppUserDetails) {
        if(projectRepository.existsByName(createProjectDTO.getProjectName())){
            throw new ProjectAlreadyExistsException("Project with the name '"+createProjectDTO.getProjectName()+"' already exists");
        }
        Project project = Project.builder()
                .description(createProjectDTO.getDescription())
                .name(createProjectDTO.getProjectName())
                .manager(appUserService.getUser(myAppUserDetails.getUsername()))
                .fromDate(LocalDate.now())
                .status(ProjectStatus.IN_PROGRESS)
                .build();

        System.out.println(project);
        return projectRepository.save(project);
    }
}
