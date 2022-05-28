package com.example.spm.model.dto;

import lombok.*;

import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@ToString
@Builder
public class PagedData<T> {
    private List<T> data;
    private int currentPage;
    private int totalPages;
}
