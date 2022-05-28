package com.example.spm.exception;

public class IssueNotFoundException extends RuntimeException {
    private String message;
    public IssueNotFoundException(String message) {
        super(message);
        this.message = message;
    }
    public IssueNotFoundException() { }
}
