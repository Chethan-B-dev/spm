package com.example.spm.model.entity;

import com.example.spm.model.enums.TodoStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
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
public class Todo {

    @Id
    @SequenceGenerator(
            name = "todo_sequence",
            sequenceName = "todo_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "todo_sequence"
    )
    private Integer id;
    private String name;
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(
            name = "task_id",
            referencedColumnName = "id"
    )
    @JsonIgnore
    private Task task;
    private TodoStatus status;
    private LocalDate createdOn;
}
