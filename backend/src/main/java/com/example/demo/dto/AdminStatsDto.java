package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AdminStatsDto {
    private long totalUsers;
    private long totalLearners;
    private long totalLinguists;
    private long totalAdmins;
    private long totalDecks;
    private long totalFlashcards;
    private long totalStudySessions;
}
