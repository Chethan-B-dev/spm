package com.example.spm.model.dto;

import com.example.spm.model.entity.*;
import lombok.*;

import javax.validation.constraints.NotNull;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class SearchResultDTO {
    private List<Project> projects = new ArrayList<>();
    private List<AppUser> appUsers = new ArrayList<>();
    private List<Task> tasks = new ArrayList<>();
    private List<Todo> todos = new ArrayList<>();
    private List<Issue> issues = new ArrayList<>();
}
