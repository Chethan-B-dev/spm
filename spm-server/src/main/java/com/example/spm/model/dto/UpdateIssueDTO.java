package com.example.spm.model.dto;

import com.example.spm.model.enums.IssueStatus;
import lombok.*;

import javax.validation.constraints.NotBlank;
import java.time.LocalDate;

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
    private Integer projectId;
    private LocalDate createdDate;
}
