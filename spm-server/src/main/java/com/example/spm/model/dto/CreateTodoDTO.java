package com.example.spm.model.dto;

import lombok.*;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class CreateTodoDTO {
    @NotBlank(message = "todo message cannot be empty")
    private String todoName;
}
