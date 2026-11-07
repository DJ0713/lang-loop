package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.example.demo.entity.LearnerCardMastery;
import com.example.demo.entity.RetentionMetric;

@Repository
public interface LearnerCardMasteryRepository extends JpaRepository<LearnerCardMastery, Long> {

    Optional<LearnerCardMastery> findByUser_IdAndFlashcard_Id(Long userId, Long flashcardId);

    long countByUser_IdAndMasteryLevel(Long userId, RetentionMetric.MasteryLevel masteryLevel);

    long countByUser_UsernameAndMasteryLevel(String username, RetentionMetric.MasteryLevel masteryLevel);

    long countByMasteryLevel(RetentionMetric.MasteryLevel masteryLevel);

    void deleteByUser_Id(Long userId);
}
