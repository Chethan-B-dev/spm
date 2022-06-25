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
public class ManagerSearchResultDTO {
    private List<Project> projects = new ArrayList<>();
    private List<AppUser> users = new ArrayList<>();
    private List<Task> tasks = new ArrayList<>();
    private List<Todo> todos = new ArrayList<>();
    private List<Issue> issues = new ArrayList<>();
}
