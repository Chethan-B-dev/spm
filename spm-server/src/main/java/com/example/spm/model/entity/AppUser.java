package com.example.spm.model.entity;

import com.example.spm.model.enums.UserRole;
import com.example.spm.model.enums.UserStatus;
import com.fasterxml.jackson.annotation.JsonIgnore;
import lombok.*;
import org.hibernate.validator.constraints.Length;

import javax.persistence.*;

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
    private UserRole role;
    @Length(min = 10, max = 10)
    private String phone;
    private UserStatus status;

    public AppUser(String email, String username, String password, UserRole role, String phone, UserStatus status) {
        this.email = email;
        this.username = username;
        this.password = password;
        this.role = role;
        this.phone = phone;
        this.status = status;
    }
}