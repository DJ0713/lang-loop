package com.example.demo.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import com.example.demo.entity.Flashcard;

public interface FlashcardRepository extends JpaRepository<Flashcard,Long> {

    List<Flashcard> findByDeck_IdOrderByOrderIndexAsc(Long deckId);

    @Query(
        "SELECT f FROM Flashcard f WHERE f.deck.id=:deckId ORDER BY f.orderIndex ASC")
        List<Flashcard> getFlashcardsByDecks(@Param("deckId") Long deckId);

    long countByDeck_IdIn(List<Long> deckIds);

    List<Flashcard> findByDeck_IdIn(List<Long> deckIds);
}
