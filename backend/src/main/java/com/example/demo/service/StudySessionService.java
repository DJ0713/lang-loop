package com.example.demo.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.SessionResultDto;
import com.example.demo.dto.StudySessionResponseDto;
import com.example.demo.entity.StudyDeck;
import com.example.demo.entity.StudySession;
import com.example.demo.entity.SystemUser;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.StudyDeckRepository;
import com.example.demo.repository.StudySessionRepository;
import com.example.demo.repository.SystemUserRepository;

@Service
public class StudySessionService {

    @Autowired
    private StudySessionRepository studySessionRepository;

    @Autowired
    private SystemUserRepository systemUserRepository;

    @Autowired
    private StudyDeckRepository studyDeckRepository;

    @Autowired
    private com.example.demo.repository.FlashcardRepository flashcardRepository;

    @Autowired
    private com.example.demo.repository.LearnerCardMasteryRepository learnerCardMasteryRepository;

    public void recordCardReview(String username, com.example.demo.dto.CardReviewRequestDto dto) {
        if (username == null || dto.getCardId() == null) {
            return;
        }

        SystemUser user = systemUserRepository.findByUsername(username).orElse(null);
        if (user == null) {
            return;
        }

        com.example.demo.entity.Flashcard flashcard = flashcardRepository.findById(dto.getCardId()).orElse(null);
        if (flashcard == null) {
            return;
        }

        com.example.demo.entity.LearnerCardMastery mastery = learnerCardMasteryRepository
                .findByUser_IdAndFlashcard_Id(user.getId(), flashcard.getId())
                .orElseGet(() -> {
                    com.example.demo.entity.LearnerCardMastery newMastery = new com.example.demo.entity.LearnerCardMastery();
                    newMastery.setUser(user);
                    newMastery.setFlashcard(flashcard);
                    return newMastery;
                });

        boolean isCorrect = Boolean.TRUE.equals(dto.getCorrect());
        if (isCorrect) {
            mastery.setMasteryLevel(com.example.demo.entity.RetentionMetric.MasteryLevel.MASTERED);
        } else {
            // Only set to LEARNING if it wasn't already MASTERED, or if incorrect resets to LEARNING
            if (mastery.getMasteryLevel() == null) {
                mastery.setMasteryLevel(com.example.demo.entity.RetentionMetric.MasteryLevel.LEARNING);
            }
        }
        mastery.setReviewedAt(LocalDateTime.now());
        learnerCardMasteryRepository.save(mastery);
    }

    public StudySessionResponseDto completeSession(SessionResultDto dto) {

        SystemUser user = systemUserRepository.findById(dto.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        StudyDeck deck = studyDeckRepository.findById(dto.getDeckId())
                .orElseThrow(() -> new ResourceNotFoundException("Deck not found"));

        StudySession session = new StudySession();
        session.setUser(user);
        session.setDeck(deck);
        session.setStartTime(LocalDateTime.now());
        session.setEndTime(LocalDateTime.now());
        session.setScore(dto.getScore());

        StudySession saved = studySessionRepository.save(session);

        StudySessionResponseDto response = new StudySessionResponseDto();
        response.setSessionId(saved.getId());
        response.setUserId(user.getId());
        response.setDeckId(deck.getId());
        response.setScore(saved.getScore());
        response.setStartTime(saved.getStartTime());
        response.setEndTime(saved.getEndTime());

        return response;
    }

    public List<StudySessionResponseDto> getUserSessions(Long userId) {

    return studySessionRepository.findByUser_Id(userId)
            .stream()
            .map(session -> {
                StudySessionResponseDto dto = new StudySessionResponseDto();
                dto.setSessionId(session.getId());
                dto.setUserId(session.getUser().getId());
                dto.setDeckId(session.getDeck().getId());
                dto.setScore(session.getScore());
                dto.setStartTime(session.getStartTime());
                dto.setEndTime(session.getEndTime());
                return dto;
            })
            .collect(Collectors.toList());
}

}