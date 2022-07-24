package com.example.spm.model.entity;

import com.example.spm.model.enums.IssuePriority;
import com.example.spm.model.enums.IssueStatus;
import com.example.spm.model.enums.TaskPriority;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;

import javax.persistence.*;
import java.security.cert.TrustAnchor;
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
    @Column(nullable = false)
    private IssueStatus status;
    @Column(nullable = true)
    private IssuePriority priority;
    @Column(nullable = true)
    private String image;
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
    private LocalDate resolvedDate;

    @JsonIgnore
    @OneToMany(mappedBy = "issue", cascade =  CascadeType.REMOVE)
    @ToString.Exclude
    @Builder.Default
    private List<IssueComment> issueComments = new ArrayList<>();
}
