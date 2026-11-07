package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.example.demo.dto.AdminFlashcardDto;
import com.example.demo.dto.AdminStatsDto;
import com.example.demo.dto.AdminUserDto;
import com.example.demo.entity.Flashcard;
import com.example.demo.entity.StudyDeck;
import com.example.demo.entity.SystemUser;
import com.example.demo.repository.FlashcardRepository;
import com.example.demo.repository.LearnerCardMasteryRepository;
import com.example.demo.repository.StudyDeckRepository;
import com.example.demo.repository.StudySessionRepository;
import com.example.demo.repository.SystemUserRepository;

@Service
public class AdminService {

    @Autowired
    private SystemUserRepository systemUserRepository;

    @Autowired
    private StudyDeckRepository studyDeckRepository;

    @Autowired
    private FlashcardRepository flashcardRepository;

    @Autowired
    private StudySessionRepository studySessionRepository;

    @Autowired
    private LearnerCardMasteryRepository learnerCardMasteryRepository;

    public AdminStatsDto getAdminStats() {
        long totalUsers = systemUserRepository.count();
        long totalLearners = systemUserRepository.countByRole("LEARNER");
        long totalLinguists = systemUserRepository.countByRole("LINGUIST");
        long totalAdmins = systemUserRepository.countByRole("ADMIN");
        long totalDecks = studyDeckRepository.count();
        long totalFlashcards = flashcardRepository.count();
        long totalStudySessions = studySessionRepository.count();

        return AdminStatsDto.builder()
                .totalUsers(totalUsers)
                .totalLearners(totalLearners)
                .totalLinguists(totalLinguists)
                .totalAdmins(totalAdmins)
                .totalDecks(totalDecks)
                .totalFlashcards(totalFlashcards)
                .totalStudySessions(totalStudySessions)
                .build();
    }

    public List<AdminUserDto> getAllUsers() {
        return systemUserRepository.findAll().stream()
                .map(user -> AdminUserDto.builder()
                        .id(user.getId())
                        .username(user.getUsername())
                        .role(user.getRole())
                        .build())
                .collect(Collectors.toList());
    }

    @Transactional
    public AdminUserDto updateUserRole(Long id, String newRole) {
        if (newRole == null || newRole.trim().isEmpty()) {
            throw new IllegalArgumentException("Role cannot be empty");
        }
        String normalizedRole = newRole.trim().toUpperCase();
        if (!normalizedRole.equals("LEARNER") && !normalizedRole.equals("LINGUIST") && !normalizedRole.equals("ADMIN")) {
            throw new IllegalArgumentException("Invalid role: " + newRole);
        }

        SystemUser user = systemUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setRole(normalizedRole);
        SystemUser updated = systemUserRepository.save(user);

        return AdminUserDto.builder()
                .id(updated.getId())
                .username(updated.getUsername())
                .role(updated.getRole())
                .build();
    }

    @Transactional
    public void deleteUser(Long id) {
        SystemUser user = systemUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Delete mastery records
        learnerCardMasteryRepository.deleteByUser_Id(id);

        // Delete study sessions
        studySessionRepository.deleteByUser_Id(id);

        // Reassign or unbind owned decks so decks aren't orphaned or deleted inadvertently
        List<StudyDeck> ownedDecks = studyDeckRepository.findByOwner_Id(id);
        for (StudyDeck deck : ownedDecks) {
            deck.setOwner(null);
            studyDeckRepository.save(deck);
        }

        systemUserRepository.delete(user);
    }

    public List<AdminFlashcardDto> getAllFlashcards() {
        return flashcardRepository.findAll().stream()
                .map(card -> AdminFlashcardDto.builder()
                        .id(card.getId())
                        .frontContent(card.getFrontContent())
                        .backContent(card.getBackContent())
                        .orderIndex(card.getOrderIndex())
                        .deckId(card.getDeck() != null ? card.getDeck().getId() : null)
                        .deckTitle(card.getDeck() != null ? card.getDeck().getTitle() : "Unassigned")
                        .build())
                .collect(Collectors.toList());
    }
}
