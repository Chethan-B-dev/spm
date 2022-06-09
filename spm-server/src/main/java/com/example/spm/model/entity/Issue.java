package com.example.spm.model.entity;

import com.example.spm.model.enums.IssueStatus;
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
public class Issue {
    @Id
    @SequenceGenerator(
            name = "issue_sequence",
            sequenceName = "issue_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "issue_sequence"
    )
    private Integer id;

    @Column(nullable = false)
    private String summary;
    private IssueStatus status;
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(
            name = "project_id",
            referencedColumnName = "id"
    )
    @JsonIgnore
    private Project project;
    @ManyToOne(cascade = CascadeType.MERGE)
    @JoinColumn(
            name = "user_id",
            referencedColumnName = "id"
    )
    private AppUser user;
    private LocalDate createdDate;
}
