package com.example.spm.model.dto;

import com.example.spm.model.enums.UserRole;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class UserRegisterDTO {
    private String email;
    private String password;
    private String username;
    private UserRole userRole;
    private String phone;
}
