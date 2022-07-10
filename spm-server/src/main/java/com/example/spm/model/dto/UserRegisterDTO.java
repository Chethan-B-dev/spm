package com.example.spm.model.dto;

import com.example.spm.model.enums.UserRole;
import lombok.*;

import javax.validation.constraints.Email;
import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UserRegisterDTO {
    @NotNull
    @Email(message = "email should be valid")
    private String email;
    @NotNull(message = "your password cannot be empty")
    private String password;
    @NotNull(message = "your username cannot be null")
    private String username;
    @NotNull(message = "the role cannot be null")
    private UserRole userRole;
    @NotNull @Pattern(regexp = "^[789]\\d{9}$", message = "Phone number should have 10 digits and should be valid")
    private String phone;
}
