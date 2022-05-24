package com.example.spm.model.dto;

import com.example.spm.model.enums.TaskPriority;
import com.example.spm.model.enums.TodoStatus;
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
public class CreateTodoDTO {
    @NotNull
    private String todoName;
}
