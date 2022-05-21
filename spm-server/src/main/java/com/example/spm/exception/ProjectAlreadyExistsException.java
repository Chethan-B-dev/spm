package com.example.spm.exception;

public class ProjectAlreadyExistsException extends RuntimeException {
    private String message;
    public ProjectAlreadyExistsException(String message) {
        super(message);
        this.message = message;
    }
    public ProjectAlreadyExistsException() { }
}
