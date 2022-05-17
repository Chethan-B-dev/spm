package com.example.spm.model.entity;

import com.example.spm.model.enums.TaskPriority;
import com.example.spm.model.enums.TaskStatus;
import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;

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
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(
            name = "project_id",
            referencedColumnName = "id"
    )
    private Project project;
    @Column(nullable = false)
    private String name;
    private String description;
    private TaskStatus status = TaskStatus.CREATED;
    private LocalDate createdDate = LocalDate.now();
    private LocalDate deadLine;
    private TaskPriority priority;
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(
            name = "user_id",
            referencedColumnName = "id"
    )
    private AppUser user;
}
