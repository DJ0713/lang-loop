package com.example.demo.entity;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.OneToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="retention_metric")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class RetentionMetric {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Double easeFactor;
    private int intervalDays;
    private LocalDateTime nextReviewDate;
    
    @Enumerated(EnumType.STRING)
    private MasteryLevel masteryLevel;

    public enum MasteryLevel{
        NEW,
        LEARNING,
        MASTERED
    }

    @OneToOne
    @JoinColumn(name = "flashcard_id")
    private Flashcard flashcard;
    
}
