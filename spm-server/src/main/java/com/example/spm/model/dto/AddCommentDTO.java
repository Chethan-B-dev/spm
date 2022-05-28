package com.example.spm.model.dto;

import lombok.*;

import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class AddCommentDTO {
    @NotNull
    private String comment;
    private Integer userId;
}
