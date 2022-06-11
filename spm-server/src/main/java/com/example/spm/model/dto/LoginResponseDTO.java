package com.example.spm.model.dto;

import com.example.spm.model.entity.AppUser;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class LoginResponseDTO {
    private String token;
    private AppUser user;
}
