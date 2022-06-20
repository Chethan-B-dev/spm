package com.example.spm.model.dto;


import com.example.spm.model.enums.UserDesignation;
import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
public class SetDesignationDTO {
    UserDesignation designation;
}
