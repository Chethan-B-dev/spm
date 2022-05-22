package com.example.spm.exception;

public class TaskNotFoundException extends RuntimeException {
    private String message;
    public TaskNotFoundException(String message) {
        super(message);
        this.message = message;
    }
    public TaskNotFoundException() { }
}
