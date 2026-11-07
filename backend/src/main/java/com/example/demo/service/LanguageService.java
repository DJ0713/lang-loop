package com.example.demo.service;

import java.util.List;

import org.springframework.stereotype.Service;

@Service
public class LanguageService {

    public List<String> getSupportedLanguages() {
        return List.of(
                "English",
                "Spanish",
                "French",
                "German",
                "Japanese"
        );
    }
}