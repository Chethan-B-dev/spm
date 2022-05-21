package com.example.spm.exception;

public class ProjectValidationException extends RuntimeException {
    private String message;
    public ProjectValidationException(String message) {
        super(message);
        this.message = message;
    }
    public ProjectValidationException() { }
}
