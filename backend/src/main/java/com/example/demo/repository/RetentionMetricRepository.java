package com.example.demo.repository;



import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.RetentionMetric;

public interface RetentionMetricRepository extends JpaRepository<RetentionMetric, Long> {
    List<RetentionMetric> findByNextReviewDateBefore(LocalDateTime date); 

    long countByMasteryLevel(RetentionMetric.MasteryLevel masteryLevel);

    long countByMasteryLevelAndFlashcard_Deck_IdIn(RetentionMetric.MasteryLevel masteryLevel, List<Long> deckIds);
}
