package com.samsamoo.coordinator.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(nullable = false, length = 50)
    private String name;

    @Column(nullable = false, unique = true, length = 100)
    private String email;

    @Column(nullable = false, length = 100)
    private String password;

    @Column(nullable = false, length = 20)
    private String language;

    @Column(nullable = false, length = 50)
    private String timezone;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;

    protected User() {
        // JPA 기본 생성자
    }

    public User(String name, String email, String password, String language, String timezone) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.language = language;
        this.timezone = timezone;
        this.createdAt = LocalDateTime.now();
    }

    public Long getUserId() {
        return userId;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getPassword() {
        return password;
    }

    public String getLanguage() {
        return language;
    }

    public String getTimezone() {
        return timezone;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void updateProfile(String name, String language, String timezone) {
        if (name != null) {
            this.name = name;
        }
        if (language != null) {
            this.language = language;
        }
        if (timezone != null) {
            this.timezone = timezone;
        }
    }
}
