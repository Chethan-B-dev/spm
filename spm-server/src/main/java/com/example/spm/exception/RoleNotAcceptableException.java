package com.example.spm.exception;

public class RoleNotAcceptableException extends RuntimeException {
    private String message;
    public RoleNotAcceptableException(String message) {
        super(message);
        this.message = message;
    }
    public RoleNotAcceptableException() { }
}
