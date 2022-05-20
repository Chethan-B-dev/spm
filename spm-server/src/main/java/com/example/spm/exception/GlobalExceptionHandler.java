package com.example.spm.exception;

import com.example.spm.model.dto.GeneralExceptionResponseDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

import java.time.LocalDateTime;

@ControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(value = UserNotFoundException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> blogNotFoundException(UserNotFoundException userNotFoundException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .error(userNotFoundException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = ActionNotAllowedException.class)
    public ResponseEntity<GeneralExceptionResponseDTO> actionNotAllowedException(ActionNotAllowedException actionNotAllowedException) {
        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .error(actionNotAllowedException.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(value = Exception.class)
    public ResponseEntity<GeneralExceptionResponseDTO> generalException(Exception exception) {

        GeneralExceptionResponseDTO generalExceptionResponseDTO = GeneralExceptionResponseDTO
                .builder()
                .error(exception.getMessage())
                .timeStamp(LocalDateTime.now())
                .build();

        return new ResponseEntity<>(generalExceptionResponseDTO, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
