package com.example.spm.exception;

public class IssueCommentNotFoundException extends RuntimeException {
    private String message;
    public IssueCommentNotFoundException(String message) {
        super(message);
        this.message = message;
    }
    public IssueCommentNotFoundException() { }
}
