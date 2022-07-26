package com.example.spm.model.dto;

import com.example.spm.model.enums.UserDesignation;
import lombok.*;

import javax.validation.constraints.NotNull;
import javax.validation.constraints.Pattern;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class EditProfileDTO {
    @NotNull(message = "username cannot be empty")
    private String username;
    @NotNull
    @Pattern(regexp = "^[789]\\d{9}$", message = "Phone number should have 10 digits and should be valid")
    private String phone;
    private String image;
    private UserDesignation designation;
}
