package com.example.spm.model.dto;

import com.example.spm.model.enums.IssueStatus;
import com.example.spm.model.enums.TodoStatus;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UpdateIssueDTO {
    private String summary;
    private IssueStatus status;
    private Integer projectId;
    private LocalDate createdDate;
}
