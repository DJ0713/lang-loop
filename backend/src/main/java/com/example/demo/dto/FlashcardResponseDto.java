package com.example.demo.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class FlashcardResponseDto {

    private Long id;
    private String frontContent;
    private String backContent;
    private int orderIndex;

    public String getFrontText() {
        return this.frontContent;
    }

    public String getBackText() {
        return this.backContent;
    }

}