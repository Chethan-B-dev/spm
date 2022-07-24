package com.example.spm.service;


import com.example.spm.exception.ActionNotAllowedException;
import com.example.spm.exception.IssueCommentNotFoundException;
import com.example.spm.exception.IssueNotFoundException;
import com.example.spm.model.dto.AddCommentDTO;
import com.example.spm.model.dto.CreateIssueDTO;
import com.example.spm.model.dto.UpdateIssueDTO;
import com.example.spm.model.entity.*;
import com.example.spm.model.enums.IssueStatus;
import com.example.spm.model.enums.UserRole;
import com.example.spm.repository.IssueCommentRepository;
import com.example.spm.repository.IssueRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.repository.Modifying;
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
    private final AppUserService appUserService;
    private final AdminService adminService;
    private final IssueCommentRepository issueCommentRepository;

    public List<Issue> getAllIssues(Integer projectId) {
        return issueRepository.findAllByProjectIdOrderByCreatedDateDesc(projectId);
    }

    @Transactional
    @Modifying
    public Issue updateIssue(UpdateIssueDTO updateIssueDTO, Integer issueId){
        Issue issue = checkIfIssueExists(issueId);
        issue.setSummary(updateIssueDTO.getSummary());
        issue.setStatus(updateIssueDTO.getStatus());
        if (issue.getStatus().equals(IssueStatus.RESOLVED)) {
            issue.setResolvedDate(LocalDate.now());
        }
        return issue;
    }

    public Issue getIssueById(Integer issueId) {
        Issue issue = checkIfIssueExists(issueId);
        System.out.println(issue);
        return issue;
    }

    public Issue createIssue(Project project, CreateIssueDTO createIssueDTO, MyAppUserDetails loggedInUser) {
        if (!loggedInUser.getUser().getRole().equals(UserRole.EMPLOYEE))
            throw new ActionNotAllowedException("Only Employees can raise issues");
        Issue issue = Issue
                .builder()
                .status(IssueStatus.UNRESOLVED)
                .summary(createIssueDTO.getSummary())
                .priority(createIssueDTO.getPriority())
                .createdDate(LocalDate.now())
                .project(project)
                .image(createIssueDTO.getImage())
                .user(appUserService.getUser(loggedInUser.getUsername()))
                .build();
        return issueRepository.save(issue);
    }

    @Transactional
    @Modifying
    public void deleteIssue(Integer issueId, MyAppUserDetails loggedInUser) {
        Issue issue = checkIfIssueExists(issueId);
        checkIfIssueBelongsToManager(issue, loggedInUser);
        issueRepository.delete(issue);
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

    public List<IssueComment> getComments(Integer issueId){
        checkIfIssueExists(issueId);
        return issueCommentRepository.findAllByIssueIdOrderByIdDesc(issueId);
    }

    @Transactional
    @Modifying
    public void deleteComment(Integer commentId, MyAppUserDetails loggedInUser){
        checkIfCommentBelongsToUser(commentId, loggedInUser);
        issueCommentRepository.deleteById(commentId);
    }

    private Issue checkIfIssueExists(Integer issueId) {
        return issueRepository
                .findById(issueId)
                .orElseThrow(() -> new IssueNotFoundException("issue with id '" + issueId + "' not found)"));
    }

    public void checkIfIssueBelongsToManager(Issue issue, MyAppUserDetails loggedInUser) {
        if (!issue.getProject().getManager().getId().equals(loggedInUser.getUser().getId()))
            throw new ActionNotAllowedException("Cannot access this issue as this issue does not belong to your project");
    }

    private IssueComment checkIfIssueCommentExists(Integer commentId) {
        return issueCommentRepository
                .findById(commentId)
                .orElseThrow(() -> new IssueCommentNotFoundException("Issue Comment with id '" + commentId + "' not found)"));
    }

    private void checkIfCommentBelongsToUser(Integer commentId, MyAppUserDetails loggedInUser){
        IssueComment issueComment = checkIfIssueCommentExists(commentId);
        if(!issueComment.getUser().getId().equals(loggedInUser.getUser().getId()))
            throw new ActionNotAllowedException("User with id "+loggedInUser.getUser().getId()+" cannot delete the comment with id "+commentId);
    }

    public List<Issue> getAllIssuesWithSearchKeyAndManagerId(String searchKey, Integer managerId) {
        return issueRepository.getAllIssuesWithSearchKeyAndManagerId(managerId, searchKey);
    }

    public List<Issue> getAllIssuesWithSearchKeyAndEmployeeId(String searchKey, Integer employeeId) {
        return issueRepository.getAllIssuesWithSearchKeyAndEmployeeId(employeeId, searchKey);
    }
}
