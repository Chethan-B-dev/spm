package com.example.spm.model.dto;

import com.example.spm.model.enums.TodoStatus;
import lombok.*;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UpdateTodoDTO {
    private String todoName;
    private Integer taskId;
    private TodoStatus status;
}
