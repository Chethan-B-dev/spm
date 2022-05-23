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
    // Normal user but the role is the manager
    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(
            name = "manager_id",
            referencedColumnName = "id"
    )
    private AppUser manager;
    @Column(nullable = false, unique = true)
    private String name;
    private LocalDate fromDate;
    private LocalDate toDate;
    private ProjectStatus status;
    private String description;
    @ManyToMany(cascade = CascadeType.ALL)
    @JoinTable(
            name = "project_user",
            joinColumns = @JoinColumn(name = "project_id",referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(name = "user_id",referencedColumnName = "id")
    )
    @ToString.Exclude
    private List<AppUser> users = new ArrayList<>();
}
