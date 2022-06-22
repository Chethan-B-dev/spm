package com.example.spm.model.dto;

import com.example.spm.model.enums.IssueStatus;
import lombok.*;

import javax.validation.constraints.NotBlank;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UpdateIssueDTO {
    @NotBlank(message = "issue cannot be empty")
    private String summary;
    private IssueStatus status;
}
