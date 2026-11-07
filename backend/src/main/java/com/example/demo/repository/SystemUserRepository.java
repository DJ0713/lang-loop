package com.example.demo.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.example.demo.entity.SystemUser;

public interface SystemUserRepository extends JpaRepository<SystemUser, Long> {
 
    Optional<SystemUser> findByUsername(String username);

    long countByRole(String role);
}
