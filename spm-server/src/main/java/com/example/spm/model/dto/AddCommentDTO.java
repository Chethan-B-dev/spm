package com.example.spm.model.dto;

import lombok.*;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class AddCommentDTO {
    @NotBlank(message = "comment cannot be empty")
    private String comment;
    private Integer userId;
}
