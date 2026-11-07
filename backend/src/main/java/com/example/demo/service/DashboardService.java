package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.example.demo.dto.DashboardResponseDto;
import com.example.demo.entity.RetentionMetric;
import com.example.demo.entity.StudyDeck;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.FlashcardRepository;
import com.example.demo.repository.RetentionMetricRepository;
import com.example.demo.repository.StudyDeckRepository;
import com.example.demo.repository.SystemUserRepository;

@Service
public class DashboardService {

    @Autowired
    private StudyDeckRepository studyDeckRepository;

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private RetentionMetricRepository retentionMetricRepository;

    @Autowired
    private com.example.demo.repository.LearnerCardMasteryRepository learnerCardMasteryRepository;

    @Autowired
    private SystemUserRepository systemUserRepository;

    public DashboardResponseDto getDashboardStats() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        String username = (authentication != null) ? authentication.getName() : null;

        SystemUser user = null;
        if (username != null) {
            user = systemUserRepository.findByUsername(username).orElse(null);
        }

        String role = (user != null) ? user.getRole() : "LEARNER";

        long totalDecks = 0;
        long totalFlashcards = 0;
        long mastered = 0;

        // The Learning Roadmaps page (/api/decks) and dashboard statistics reflect
        // the active learning roadmaps / decks accessible in the application.
        // For all authenticated roles (LEARNER, LINGUIST, ADMIN), GET /api/decks returns
        // all study decks in the catalog. The dashboard statistics must match the exact same data.
        totalDecks = studyDeckRepository.count();
        totalFlashcards = flashcardRepository.count();

        // Mastery is strictly learner-specific.
        // If user is authenticated, retrieve unique cards mastered by this user.
        if (user != null) {
            mastered = learnerCardMasteryRepository.countByUser_IdAndMasteryLevel(
                    user.getId(),
                    RetentionMetric.MasteryLevel.MASTERED
            );
        } else {
            mastered = 0;
        }

        int progress = 0;
        if (totalFlashcards > 0) {
            progress = (int) Math.round(((double) mastered / totalFlashcards) * 100);
        }

        return DashboardResponseDto.builder()
                .totalDecks(totalDecks)
                .totalFlashcards(totalFlashcards)
                .mastered(mastered)
                .masteredCards(mastered)
                .progress(progress)
                .streak(0)
                .build();
    }
}
