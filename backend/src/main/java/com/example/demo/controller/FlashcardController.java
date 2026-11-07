package com.example.demo.controller;

import java.util.List;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.example.demo.dto.FlashcardRequestDto;
import com.example.demo.dto.FlashcardResponseDto;
import com.example.demo.service.FlashcardService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/decks/{id}/cards")
public class FlashcardController {

    private final FlashcardService flashcardService;

    public FlashcardController(FlashcardService flashcardService) {
        this.flashcardService = flashcardService;
    }

    @PostMapping
    public ResponseEntity<FlashcardResponseDto> createFlashcard(
            @PathVariable("id") Long deckId,
            @Valid @RequestBody FlashcardRequestDto dto) {

        FlashcardResponseDto flashcard =
                flashcardService.createFlashcard(deckId, dto);

        return new ResponseEntity<>(flashcard, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<FlashcardResponseDto>> getCardsByDecks(
            @PathVariable("id") Long deckId) {

        List<FlashcardResponseDto> flashcards =
                flashcardService.getCardsByDeck(deckId);

        return ResponseEntity.ok(flashcards);
    }
}