package com.example.spm.model.dto;


import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class GeneralAuthExceptionDTO {
    private String error;
    private String timestamp;
}
