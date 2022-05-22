package com.example.spm.exception;

public class ProjectNotFoundException extends RuntimeException {
    private String message;
    public ProjectNotFoundException(String message) {
        super(message);
        this.message = message;
    }
    public ProjectNotFoundException() { }
}
