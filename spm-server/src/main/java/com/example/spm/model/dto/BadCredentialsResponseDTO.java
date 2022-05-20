package com.example.spm.model.dto;

import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class BadCredentialsResponseDTO {
    private String timeStamp;
    private String message;
}
