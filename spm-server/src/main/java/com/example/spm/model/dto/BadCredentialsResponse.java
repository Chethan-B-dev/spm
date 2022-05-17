package com.example.spm.model.dto;

import lombok.*;


@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class BadCredentialsResponse {
    private String timeStamp;
    private String message;
}
