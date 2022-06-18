package com.example.spm.model.dto;

import com.example.spm.model.enums.TodoStatus;
import lombok.*;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UpdateTodoDTO {
    @NotBlank(message = "todo message cannot be empty")
    private String todoName;
    private Integer taskId;
    private TodoStatus status;
}
