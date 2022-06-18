package com.example.spm.model.entity;

import com.example.spm.model.enums.ProjectStatus;
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
public class Project {
    @Id
    @SequenceGenerator(
            name = "project_sequence",
            sequenceName = "project_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "project_sequence"
    )
    private Integer id;
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(
            name = "manager_id",
            referencedColumnName = "id"
    )
    private AppUser manager;
    @Column(nullable = false, unique = true)
    private String name;
    private LocalDate fromDate;
    private LocalDate toDate;
    @Column(nullable = false)
    private ProjectStatus status;
    private String description;
    @ManyToMany(cascade = CascadeType.MERGE)
    @JoinTable(
            name = "project_user",
            joinColumns = @JoinColumn(name = "project_id",referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "user_id",referencedColumnName = "id")
    )
    @ToString.Exclude
    private List<AppUser> users = new ArrayList<>();

    @OneToMany(mappedBy = "project")
    @ToString.Exclude
    private List<Task> tasks = new ArrayList<>();

    @OneToMany(mappedBy = "project")
    @ToString.Exclude
    private List<Issue> issues = new ArrayList<>();
}
