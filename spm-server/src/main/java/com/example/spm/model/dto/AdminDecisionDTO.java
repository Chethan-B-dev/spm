package com.example.spm.model.dto;


import com.example.spm.model.enums.AdminDecision;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class AdminDecisionDTO {
    private Integer userId;
    private AdminDecision adminDecision;
}
