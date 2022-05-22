package com.example.spm.model.dto;

import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class ProjectValidationErrorResponseDTO {
    private List<String> errors;
    private LocalDateTime timestamp;
}
