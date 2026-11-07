package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.example.demo.entity.RetentionMetric;
import com.example.demo.repository.RetentionMetricRepository;

@Service
public class SpacedRepetitionService {

    private final RetentionMetricRepository retentionMetricRepository;

    public SpacedRepetitionService(RetentionMetricRepository retentionMetricRepository) {
        this.retentionMetricRepository = retentionMetricRepository;
    }

    public void updateRetentionMetric(Long userId, Long cardId, Integer quality) {

        // Placeholder for SM-2 algorithm implementation
        // Future enhancement:
        // - Update easeFactor
        // - Update intervalDays
        // - Update nextReviewDate
        // - Update masteryLevel
    }

    public List<RetentionMetric> getDueReviews(Long userId) {

        return retentionMetricRepository.findByNextReviewDateBefore(
                LocalDateTime.now());
    }
}