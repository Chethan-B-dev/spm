package com.example.spm.model.dto;

import com.example.spm.model.enums.TaskPriority;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UpdateTaskDTO {
    @NotBlank(message = "task name cannot be empty")
    private String taskName;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime deadline;
    @NotBlank(message = "task description cannot be empty")
    private String description;
    @NotNull(message = "task priority has to be set")
    private TaskPriority priority;
}
