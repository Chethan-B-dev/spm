package com.example.spm.exception;

import com.example.spm.model.dto.GeneralExceptionResponseDTO;
import com.example.spm.model.dto.ProjectValidationErrorResponseDTO;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.MalformedJwtException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.InsufficientAuthenticationException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.nio.file.AccessDeniedException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = UserNotFoundException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> userNotFoundException(UserNotFoundException userNotFoundException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .message(userNotFoundException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = ProjectNotFoundException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> projectNotFoundException(ProjectNotFoundException projectNotFoundException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .message(projectNotFoundException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = TaskNotFoundException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> taskNotFoundException(TaskNotFoundException taskNotFoundException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .message(taskNotFoundException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = IssueNotFoundException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> issueNotFoundException(IssueNotFoundException issueNotFoundException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .message(issueNotFoundException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = IssueCommentNotFoundException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> issueCommentNotFoundException(IssueCommentNotFoundException issueCommentNotFoundException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .message(issueCommentNotFoundException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = TodoNotFoundException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> todoNotFoundException(TodoNotFoundException todoNotFoundException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .message(todoNotFoundException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = RoleNotAcceptableException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> roleNotAcceptableException(RoleNotAcceptableException roleNotAcceptableException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .message(roleNotAcceptableException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(value = ActionNotAllowedException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> actionNotAllowedException(ActionNotAllowedException actionNotAllowedException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .message(actionNotAllowedException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.FORBIDDEN);

    }

    @ExceptionHandler(value = ProjectAlreadyExistsException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> projectAlreadyExistsException(ProjectAlreadyExistsException projectAlreadyExistsException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .message(projectAlreadyExistsException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.NOT_ACCEPTABLE);
    }

    @ExceptionHandler(value = UserNotLoggedInException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> userNotLoggedInException(UserNotLoggedInException userNotLoggedInException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .message(userNotLoggedInException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = ProjectValidationException.class)
    public ResponseEntity<ProjectValidationErrorResponseDTO> userNotLoggedInException(ProjectValidationException projectValidationException) {
        String[] errors = projectValidationException.getMessage().split(",");
        List<String> errorsList = new ArrayList<>(Arrays.asList(errors));
        ProjectValidationErrorResponseDTO projectValidationErrorResponseDTO = ProjectValidationErrorResponseDTO.builder()
                .errors(errorsList)
                .timestamp(LocalDateTime.now())
                .build();
        return new ResponseEntity<>(projectValidationErrorResponseDTO, HttpStatus.NOT_ACCEPTABLE);
    }



    // todo: handle this error when token is invalid
    @ExceptionHandler(value = AccessDeniedException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> accessDeniedException(AccessDeniedException accessDeniedException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .message(accessDeniedException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.FORBIDDEN);
    }
    @ExceptionHandler(value = InsufficientAuthenticationException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> insufficientAuthException(InsufficientAuthenticationException insufficientAuthenticationException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .message(insufficientAuthenticationException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = MalformedJwtException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> malformedJWTException(MalformedJwtException malformedJwtException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .message(malformedJwtException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = JwtException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> jwtException(JwtException jwtException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .message(jwtException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = ExpiredJwtException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> jwtException(ExpiredJwtException jwtException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .message(jwtException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = IllegalArgumentException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> illegalArgumentException(IllegalArgumentException illegalArgumentException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .message(illegalArgumentException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<GeneralExceptionResponseDTO> generalException(Exception exception) {
        exception.printStackTrace();
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .message(exception.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
