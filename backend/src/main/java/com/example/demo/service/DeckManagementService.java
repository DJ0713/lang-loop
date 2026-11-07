package com.example.demo.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.example.demo.dto.DeckRequestDto;
import com.example.demo.entity.StudyDeck;
import com.example.demo.repository.StudyDeckRepository;

@Service
public class DeckManagementService {
    @Autowired
    private StudyDeckRepository studyDeckRepository;

    @Autowired
    private com.example.demo.repository.SystemUserRepository systemUserRepository;

    public List<StudyDeck> getAllDecks(){
        return studyDeckRepository.findAll();
    }

    public StudyDeck getDeckById(Long id){
        return studyDeckRepository.findById(id).orElseThrow(()-> new RuntimeException("Deck not found"));
    }
    public StudyDeck createDeck(DeckRequestDto dto){
        StudyDeck deck=new StudyDeck();
        deck.setTitle(dto.getTitle());
        deck.setDescription(dto.getDescription());
        deck.setCapacity(dto.getCapacity() <= 0 ? 50 : dto.getCapacity());
        String mentor = (dto.getMentorName() != null && !dto.getMentorName().trim().isEmpty())
                ? dto.getMentorName().trim()
                : "Instructor";
        deck.setMentorName(mentor);

        try {
            org.springframework.security.core.Authentication auth =
                    org.springframework.security.core.context.SecurityContextHolder.getContext().getAuthentication();
            if (auth != null && auth.getName() != null && !"anonymousUser".equals(auth.getName())) {
                systemUserRepository.findByUsername(auth.getName()).ifPresent(deck::setOwner);
            }
        } catch (Exception ignored) {
        }

        return studyDeckRepository.save(deck);
    }

    public StudyDeck updateDeck(Long id, DeckRequestDto dto){
        StudyDeck deck=studyDeckRepository.findById(id).orElseThrow(()->new RuntimeException("Deck not found"));
        deck.setTitle(dto.getTitle());
        deck.setDescription(dto.getDescription());
        if (dto.getCapacity() > 0) {
            deck.setCapacity(dto.getCapacity());
        }
        if (dto.getMentorName() != null && !dto.getMentorName().trim().isEmpty()) {
            deck.setMentorName(dto.getMentorName().trim());
        }
        return studyDeckRepository.save(deck);
    }

    public void deleteDeck(Long id){
        StudyDeck deck = studyDeckRepository.findById(id).orElse(null);
        if (deck != null) {
            studyDeckRepository.delete(deck);
        }
    }
    


    
}
