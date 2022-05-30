package com.example.spm.service;


import com.example.spm.exception.ActionNotAllowedException;
import com.example.spm.exception.IssueNotFoundException;
import com.example.spm.model.dto.AddCommentDTO;
import com.example.spm.model.dto.CreateIssueDTO;
import com.example.spm.model.dto.UpdateIssueDTO;
import com.example.spm.model.entity.AppUser;
import com.example.spm.model.entity.Issue;
import com.example.spm.model.entity.IssueComment;
import com.example.spm.model.entity.Project;
import com.example.spm.model.enums.IssueStatus;
import com.example.spm.model.enums.UserRole;
import com.example.spm.repository.IssueCommentRepository;
import com.example.spm.repository.IssueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
public class IssueService {
    private final IssueRepository issueRepository;
    private final ProjectService projectService;
    private final AppUserService appUserService;
    private final AdminService adminService;
    private final IssueCommentRepository issueCommentRepository;

    public List<Issue> getAllIssues(Integer projectId) {
        return issueRepository.findAllByProjectIdOrderByCreatedDateDesc(projectId);
    }

    @Transactional
    public IssueComment addComment(AddCommentDTO addCommentDTO, Integer issueId) {
        Issue issue = checkIfIssueExists(issueId);
        AppUser appUser = adminService.checkIfUserExists(addCommentDTO.getUserId());
        IssueComment issueComment = IssueComment
                .builder()
                .comment(addCommentDTO.getComment())
                .issue(issue)
                .createdDateTime(LocalDateTime.now())
                .user(appUser)
                .build();
        return issueCommentRepository.save(issueComment);
    }

    @Transactional
    public Issue updateIssue(UpdateIssueDTO updateIssueDTO, Integer issueId){
        Issue issue = checkIfIssueExists(issueId);
        issue.setSummary(updateIssueDTO.getSummary());
        issue.setStatus(updateIssueDTO.getStatus());
        issue.setProject(projectService.getProjectById(updateIssueDTO.getProjectId()));
        issue.setCreatedDate(updateIssueDTO.getCreatedDate());
        return issue;
    }

    public Issue getIssueById(Integer issueId) {
        return checkIfIssueExists(issueId);
    }

    public Issue createIssue(Integer projectId, CreateIssueDTO createIssueDTO, MyAppUserDetails loggedInUser) {
//        todo: add this function in employee issue service
//        if (!loggedInUser.getUser().getRole().equals(UserRole.EMPLOYEE))
//            throw new ActionNotAllowedException("Only Employees can raise issues");
        Project project = projectService.checkIfProjectExists(projectId);
        Issue issue = Issue
                .builder()
                .status(IssueStatus.UNRESOLVED)
                .summary(createIssueDTO.getSummary())
                .createdDate(LocalDate.now())
                .project(project)
                .user(appUserService.getUser(loggedInUser.getUsername()))
                .build();
        return issueRepository.save(issue);
    }

    private Issue checkIfIssueExists(Integer issueId) {
        return issueRepository
                .findById(issueId)
                .orElseThrow(() -> new IssueNotFoundException("issue with id '" + issueId + "' not found)"));
    }

}
