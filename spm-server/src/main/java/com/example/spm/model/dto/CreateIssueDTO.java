package com.example.spm.model.dto;

import lombok.*;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class CreateIssueDTO {
    @NotBlank(message = "issue summary cannot be blank")
    private String summary;
}
