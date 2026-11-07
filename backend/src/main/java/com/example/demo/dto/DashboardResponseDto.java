package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DashboardResponseDto {
    private long totalDecks;
    private long totalFlashcards;
    private long mastered;
    private long masteredCards;
    private int progress;
    private int streak;
}
