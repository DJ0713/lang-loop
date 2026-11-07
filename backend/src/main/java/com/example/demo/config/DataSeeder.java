package com.example.demo.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataSeeder {
    @Bean
    CommandLineRunner seedData(){

        return args ->{
            System.out.println("Checking database");

            System.out.println("Sample data inserted Successfully.");
        };

    }
}
