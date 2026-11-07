package com.example.demo.dto;


import java.time.LocalDateTime;

import lombok.Getter;

import lombok.Setter;


@Getter
@Setter
public class StudySessionResponseDto {
  private Long sessionId;
    private Long userId;
    private Long deckId;
    private int score;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
}
