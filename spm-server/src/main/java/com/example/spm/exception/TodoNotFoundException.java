package com.example.spm.exception;

public class TodoNotFoundException extends RuntimeException {
    private String message;
    public TodoNotFoundException(String message) {
        super(message);
        this.message = message;
    }
    public TodoNotFoundException() { }
}
