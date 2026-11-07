package com.example.demo.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class FlashcardRequestDto {

    @NotBlank
    private String frontContent;
    @NotBlank
    private String backContent;
    private int orderIndex;

    public void setFrontText(String frontText) {
        if (this.frontContent == null || this.frontContent.trim().isEmpty()) {
            this.frontContent = frontText;
        }
    }

    public void setBackText(String backText) {
        if (this.backContent == null || this.backContent.trim().isEmpty()) {
            this.backContent = backText;
        }
    }


}
