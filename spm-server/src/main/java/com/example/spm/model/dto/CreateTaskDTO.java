package com.example.spm.model.dto;

import com.example.spm.model.enums.TaskPriority;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class CreateTaskDTO {
    @NotBlank(message = "task name cannot be empty")
    private String name;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
    private LocalDate deadLine;
    @NotBlank(message = "task description cannot be empty")
    private String description;
    private TaskPriority priority;
    private Integer userId;
}
