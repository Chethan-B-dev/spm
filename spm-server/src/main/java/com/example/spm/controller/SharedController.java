package com.example.spm.controller;

import com.example.spm.model.dto.AddCommentDTO;
import com.example.spm.model.dto.UpdateIssueDTO;
import com.example.spm.model.entity.Issue;
import com.example.spm.model.entity.IssueComment;
import com.example.spm.service.AppUserService;
import com.example.spm.service.IssueService;
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
@RequestMapping("/api/shared")
@RequiredArgsConstructor
public class SharedController {

    private final IssueService issueService;

    @GetMapping("/issue/{issueId}")
    public ResponseEntity<Issue> getIssueByIssueId(
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer issueId
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                issueService.getIssueById(issueId),
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
        return new ResponseEntity<>(issueService.addComment(addCommentDTO, issueId), HttpStatus.OK);
    }

    @GetMapping("/comment/{issueId}")
    public ResponseEntity<List<IssueComment>> getComments(
            @PathVariable Integer issueId,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(issueService.getComments(issueId), HttpStatus.OK);
    }

    @DeleteMapping("/delete-comment/{commentId}")
    public ResponseEntity<Boolean> deleteComment(
            @PathVariable Integer commentId,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ){
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        issueService.deleteComment(commentId, loggedInUser);
        return new ResponseEntity<>(true, HttpStatus.OK);
    }

    @PutMapping("/edit-issue/{issueId}")
    public ResponseEntity<Issue> updateIssue(
            @RequestBody UpdateIssueDTO updateIssueDTO,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails,
            @PathVariable Integer issueId
    ){
        AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                issueService.updateIssue(updateIssueDTO, issueId),
                HttpStatus.OK
        );
    }
}
