package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.SessionResultDto;
import com.example.demo.dto.StudySessionResponseDto;
import com.example.demo.entity.Flashcard;
import com.example.demo.repository.FlashcardRepository;
import com.example.demo.service.StudySessionService;

@RestController
@RequestMapping("/api/study")
public class StudyController {

    @Autowired
    private StudySessionService studySessionService;

    @Autowired
    private FlashcardRepository flashcardRepository;

    @GetMapping("/due")
    public List<Flashcard> getDueFlashcards(@RequestParam Long deckId) {

        return flashcardRepository.findByDeck_IdOrderByOrderIndexAsc(deckId);
    }

    @PostMapping("/card-review")
    public org.springframework.http.ResponseEntity<Void> recordCardReview(
            @RequestBody com.example.demo.dto.CardReviewRequestDto dto) {
        org.springframework.security.core.Authentication auth =
                org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
        String username = (auth != null) ? auth.getName() : null;
        studySessionService.recordCardReview(username, dto);
        return org.springframework.http.ResponseEntity.ok().build();
    }

    @PostMapping("/complete")
    public StudySessionResponseDto completeSession(
            @RequestBody SessionResultDto dto) {

        return studySessionService.completeSession(dto);
    }

    @GetMapping("/history/{userId}")
    public List<StudySessionResponseDto> getUserSessions(
            @PathVariable Long userId) {

        return studySessionService.getUserSessions(userId);
    }

}