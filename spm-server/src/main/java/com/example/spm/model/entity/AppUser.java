package com.example.spm.model.entity;

import com.example.spm.model.enums.UserDesignation;
import com.example.spm.model.enums.UserRole;
import com.example.spm.model.enums.UserStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

@Entity
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@ToString
@Builder
@Table(name = "app_user")
public class AppUser {
    @Id
    @SequenceGenerator(
            name = "user_sequence",
            sequenceName = "user_sequence",
            allocationSize = 1
    )
    @GeneratedValue(
            strategy = GenerationType.SEQUENCE,
            generator = "user_sequence"
    )
    private Integer id;

    @Column(nullable = false, unique = true)
    private String email;
    private String username;
    @JsonIgnore
    private String password;
    private String image;
    private UserRole role;
    @Length(min = 10, max = 10)
    private String phone;
    private UserStatus status;
    @Column(nullable = true)
    private UserDesignation designation;

    @OneToMany(mappedBy = "user", cascade =  CascadeType.REMOVE)
    @ToString.Exclude
    @Builder.Default
    @JsonIgnore
    private List<Task> tasks = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade =  CascadeType.REMOVE)
    @ToString.Exclude
    @Builder.Default
    @JsonIgnore
    private List<Issue> issues = new ArrayList<>();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        AppUser appUser = (AppUser) o;
        return id.equals(appUser.id);
    }

    @Override
    public int hashCode() {
        return Objects.hash(id);
    }
}