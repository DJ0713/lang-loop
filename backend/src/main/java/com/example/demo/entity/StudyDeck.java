package com.example.demo.entity;

import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name="study_decks")
@NoArgsConstructor
@AllArgsConstructor
@Getter
@Setter
public class StudyDeck {
@Id
@GeneratedValue(strategy = GenerationType.IDENTITY)
private Long id;
@Column(name="title", nullable = false)
private String title;
private String description;
private int capacity;
@Column(name = "mentor_name", nullable = false)
private String mentorName;

@ManyToOne
@JoinColumn(name = "owner_id")
private SystemUser owner;

@OneToMany(mappedBy = "deck", cascade = CascadeType.ALL)
private List<Flashcard> flashcards;

    @com.fasterxml.jackson.annotation.JsonIgnore
    @OneToMany(mappedBy = "deck", cascade = CascadeType.ALL)
    private List<StudySession> studySessions;
}
