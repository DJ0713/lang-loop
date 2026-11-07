package com.example.demo.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.demo.dto.DeckRequestDto;
import com.example.demo.entity.StudyDeck;
import com.example.demo.service.DeckManagementService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/decks")
public class DeckController {
    
    @Autowired
    private DeckManagementService deckManagementService;

    @GetMapping
    public ResponseEntity<List<StudyDeck>> getAlldecks(){
        return ResponseEntity.ok(deckManagementService.getAllDecks());
    }

    @GetMapping("/{id}")
    public ResponseEntity<StudyDeck> getDeckById(@PathVariable Long id){
            return ResponseEntity.ok(deckManagementService.getDeckById(id));
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('LINGUIST','ADMIN')")
    public ResponseEntity<StudyDeck> createDeck(@Valid @RequestBody DeckRequestDto dto){
        return new ResponseEntity<>(
                deckManagementService.createDeck(dto),
                HttpStatus.CREATED);
    }

    // PUT /{id}
    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('LINGUIST','ADMIN')")
    public ResponseEntity<StudyDeck> updateDeck(@PathVariable Long id,
                                                @RequestBody DeckRequestDto dto) {
        return ResponseEntity.ok(deckManagementService.updateDeck(id, dto));
    }

    // DELETE /{id}
    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'LINGUIST')")
    public ResponseEntity<String> deleteDeck(@PathVariable Long id) {
        deckManagementService.deleteDeck(id);
        return ResponseEntity.ok("StudyDeck deleted successfully.");
    }

    }


      
