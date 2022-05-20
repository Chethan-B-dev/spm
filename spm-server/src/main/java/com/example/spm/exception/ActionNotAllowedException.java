package com.example.spm.exception;

public class ActionNotAllowedException extends RuntimeException {
    private String message;
    public ActionNotAllowedException(String message) {
        super(message);
        this.message = message;
    }
    public ActionNotAllowedException() { }
}
