package com.example.spm.model.dto;

import lombok.*;

import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class CreateProjectDTO {
    @NotNull
    private String projectName;
    private String toDate;
    @Min(3)
    private String description;
}
