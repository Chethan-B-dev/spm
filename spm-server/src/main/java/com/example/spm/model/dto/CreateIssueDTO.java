package com.example.spm.model.dto;

import com.example.spm.model.enums.IssuePriority;
import com.example.spm.model.enums.TaskPriority;
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
    private IssuePriority priority;
    private String image;
}
