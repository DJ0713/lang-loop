package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminFlashcardDto {
    private Long id;
    private String frontContent;
    private String backContent;
    private int orderIndex;
    private Long deckId;
    private String deckTitle;
}
