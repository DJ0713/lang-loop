package com.example.demo.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.example.demo.dto.FlashcardRequestDto;
import com.example.demo.dto.FlashcardResponseDto;
import com.example.demo.entity.Flashcard;
import com.example.demo.entity.StudyDeck;
import com.example.demo.exception.ResourceNotFoundException;
import com.example.demo.repository.FlashcardRepository;
import com.example.demo.repository.StudyDeckRepository;

@Service
public class FlashcardService {

    private final FlashcardRepository flashcardRepository;
    private final StudyDeckRepository studyDeckRepository;

    public FlashcardService(FlashcardRepository flashcardRepository,
                            StudyDeckRepository studyDeckRepository) {
        this.flashcardRepository = flashcardRepository;
        this.studyDeckRepository = studyDeckRepository;
    }

    public FlashcardResponseDto createFlashcard(Long deckId, FlashcardRequestDto dto) {

        StudyDeck deck = studyDeckRepository.findById(deckId)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Study Deck not found"));

        Flashcard flashcard = new Flashcard();

        flashcard.setFrontContent(dto.getFrontContent());
        flashcard.setBackContent(dto.getBackContent());

        // Maintain sequential ordering
        int nextOrderIndex = flashcardRepository
                .findByDeck_IdOrderByOrderIndexAsc(deckId)
                .size() + 1;

        flashcard.setOrderIndex(nextOrderIndex);
        flashcard.setDeck(deck);

        Flashcard savedFlashcard = flashcardRepository.save(flashcard);

        return mapToResponseDto(savedFlashcard);
    }

    public List<FlashcardResponseDto> getCardsByDeck(Long deckId) {

        return flashcardRepository
                .findByDeck_IdOrderByOrderIndexAsc(deckId)
                .stream()
                .map(this::mapToResponseDto)
                .collect(Collectors.toList());
    }

    private FlashcardResponseDto mapToResponseDto(Flashcard flashcard) {

        FlashcardResponseDto dto = new FlashcardResponseDto();

        dto.setId(flashcard.getId());
        dto.setFrontContent(flashcard.getFrontContent());
        dto.setBackContent(flashcard.getBackContent());
        dto.setOrderIndex(flashcard.getOrderIndex());

        return dto;
    }
}