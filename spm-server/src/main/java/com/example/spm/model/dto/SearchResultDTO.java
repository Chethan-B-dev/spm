package com.example.spm.model.dto;

import com.example.spm.model.entity.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class SearchResultDTO {
    @Builder.Default
    private List<Project> projects = new ArrayList<>();
    @Builder.Default
    private List<AppUser> users = new ArrayList<>();
    @Builder.Default
    private List<Task> tasks = new ArrayList<>();
    @Builder.Default
    private List<Todo> todos = new ArrayList<>();
    @Builder.Default
    private List<Issue> issues = new ArrayList<>();
}
