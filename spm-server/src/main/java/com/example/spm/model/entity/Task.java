package com.example.spm.model.entity;

import com.example.spm.model.enums.TaskPriority;
import com.example.spm.model.enums.TaskStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class Task {
    @Id
    @SequenceGenerator(
            name = "task_sequence",
            sequenceName = "task_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "task_sequence"
    )
    private Integer id;
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(
            name = "project_id",
            referencedColumnName = "id"
    )
    @JsonIgnore
    private Project project;
    @Column(nullable = false)
    private String name;
    private String description;
    @Column(nullable = false)
    private TaskStatus status;
    private LocalDate createdDate;
    private LocalDate deadLine;
    @Column(nullable = false)
    private TaskPriority priority;
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(
            name = "user_id",
            referencedColumnName = "id"
    )
    private AppUser user;
    @OneToMany(mappedBy = "task")
    @ToString.Exclude
    @Builder.Default
    private List<Todo> todos = new ArrayList<>();
}
