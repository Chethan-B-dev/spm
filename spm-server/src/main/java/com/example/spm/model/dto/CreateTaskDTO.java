package com.example.spm.model.dto;

import com.example.spm.model.enums.TaskPriority;
import lombok.*;
import org.springframework.format.annotation.DateTimeFormat;

import javax.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class CreateTaskDTO {
    @NotNull
    private String name;
    @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME)
    private LocalDateTime deadLine;
    @NotNull
    private String description;
    private TaskPriority priority;
    private Integer userId;
}
