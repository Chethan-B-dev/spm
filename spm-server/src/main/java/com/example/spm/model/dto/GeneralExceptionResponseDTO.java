package com.example.spm.model.dto;


import lombok.*;

import java.time.LocalDateTime;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class GeneralExceptionResponseDTO {
    private String message;
    private LocalDateTime timeStamp;
}
