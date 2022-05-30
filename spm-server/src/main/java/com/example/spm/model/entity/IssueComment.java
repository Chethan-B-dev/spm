package com.example.spm.model.entity;


import lombok.*;

import javax.persistence.*;
import java.time.LocalDateTime;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
public class IssueComment {
    @Id
    @SequenceGenerator(
            name = "issue_comment_sequence",
            sequenceName = "issue_comment_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "issue_comment_sequence"
    )
    private Integer id;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(
            name = "user_id",
            referencedColumnName = "id"
    )
    private AppUser user;
    private String comment;

    @ManyToOne(cascade = CascadeType.ALL)
    @JoinColumn(
            name = "issue_id",
            referencedColumnName = "id"
    )
    private Issue issue;

    private LocalDateTime createdDateTime;

}
