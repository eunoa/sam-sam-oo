package com.samsamoo.coordinator.controller;

import com.samsamoo.coordinator.dto.common.MessageResponse;
import com.samsamoo.coordinator.dto.user.*;
import com.samsamoo.coordinator.service.UserService;
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
    public ResponseEntity<UserResponse> signup(@RequestBody SignupRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(userService.signup(request));
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {
        return ResponseEntity.ok(userService.login(request));
    }

    @PostMapping("/logout")
    public ResponseEntity<MessageResponse> logout() {
        // TODO: 세션/토큰 무효화 로직은 인증 방식 확정 후 구현
        return ResponseEntity.ok(new MessageResponse("로그아웃되었습니다."));
    }

    // TODO: X-User-Id 헤더는 임시 방편. 인증 방식(JWT/세션) 확정되면 교체 필요
    @GetMapping("/me")
    public ResponseEntity<UserResponse> getMe(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(userService.getMe(userId));
    }

    @PatchMapping("/me")
    public ResponseEntity<UserResponse> updateMe(@RequestHeader("X-User-Id") Long userId,
                                                 @RequestBody UserUpdateRequest request) {
        return ResponseEntity.ok(userService.updateMe(userId, request));
    }

    @GetMapping("/me/availability")
    public ResponseEntity<List<AvailabilityResponse>> getAvailability(@RequestHeader("X-User-Id") Long userId) {
        return ResponseEntity.ok(userService.getAvailability(userId));
    }

    @PutMapping("/me/availability")
    public ResponseEntity<MessageResponse> updateAvailability(
            @RequestHeader("X-User-Id") Long userId,
            @RequestBody AvailabilityUpdateRequest request) {
        return ResponseEntity.ok(userService.updateAvailability(userId, request));
    }
}
