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
    @Email
    private String email;
    @NotNull
    private String password;
    @NotNull
    private String username;
    @NotNull
    private UserRole userRole;
    @NotNull @Pattern(regexp = "^[789]\\d{9}$", message = "Phone number should have 10 digits and should be valid")
    private String phone;
}
