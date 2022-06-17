package com.example.spm.model.dto;

import com.example.spm.model.enums.UserDesignation;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class EditProfileDTO {
    private String username;
    private String phone;
    private UserDesignation designation;
}
