package com.samsamoo.coordinator.controller;

import com.samsamoo.coordinator.dto.common.MessageResponse;
import com.samsamoo.coordinator.dto.user.*;
import com.samsamoo.coordinator.security.CurrentUserId;
import com.samsamoo.coordinator.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @PostMapping("/signup")
    public ResponseEntity<UserResponse> signup(@Valid @RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout(
            @RequestHeader(value = "Authorization", required = false) String authorizationHeader) {
        return ResponseEntity.ok(userService.logout(authorizationHeader));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(@CurrentUserId Long userId) {
        return ResponseEntity.ok(userService.getMe(userId));
    }

    @PatchMapping("/me")
    public ResponseEntity<UserResponse> updateMe(@CurrentUserId Long userId,
                                                 @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateMe(userId, request));
    }

    @GetMapping("/me/availability")
    public ResponseEntity<List<AvailabilityResponse>> getAvailability(@CurrentUserId Long userId) {
        return ResponseEntity.ok(userService.getAvailability(userId));
    }

    @PutMapping("/me/availability")
    public ResponseEntity<MessageResponse> updateAvailability(
            @CurrentUserId Long userId,
            @RequestBody AvailabilityUpdateRequest request) {
        return ResponseEntity.ok(userService.updateAvailability(userId, request));
    }
}
