package com.example.spm.exception;

public class UserNotLoggedInException extends RuntimeException {
    private String message;
    public UserNotLoggedInException(String message) {
        super(message);
        this.message = message;
    }
    public UserNotLoggedInException() { }
}
