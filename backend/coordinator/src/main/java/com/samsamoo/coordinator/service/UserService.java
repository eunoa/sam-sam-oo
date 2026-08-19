package com.samsamoo.coordinator.service;

import com.samsamoo.coordinator.dto.common.MessageResponse;
import com.samsamoo.coordinator.dto.user.*;
import com.samsamoo.coordinator.entity.User;
import com.samsamoo.coordinator.entity.UserAvailability;
import com.samsamoo.coordinator.exception.CustomException;
import com.samsamoo.coordinator.exception.ErrorCode;
import com.samsamoo.coordinator.repository.UserAvailabilityRepository;
import com.samsamoo.coordinator.repository.UserRepository;
import com.samsamoo.coordinator.security.JwtTokenProvider;
import com.samsamoo.coordinator.security.TokenBlacklistService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class UserService {

    private static final String BEARER_PREFIX = "Bearer ";

    private final UserRepository userRepository;
    private final UserAvailabilityRepository userAvailabilityRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final TokenBlacklistService tokenBlacklistService;

    public UserService(UserRepository userRepository,
                       UserAvailabilityRepository userAvailabilityRepository,
                       PasswordEncoder passwordEncoder,
                       JwtTokenProvider jwtTokenProvider,
                       TokenBlacklistService tokenBlacklistService) {
        this.userRepository = userRepository;
        this.userAvailabilityRepository = userAvailabilityRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Transactional
    public UserResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // 평문 비밀번호를 그대로 저장하지 않고 BCrypt로 암호화해서 저장
        String encodedPassword = passwordEncoder.encode(request.getPassword());
        User user = new User(
                request.getName(),
                request.getEmail(),
                encodedPassword,
                request.getLanguage(),
                request.getTimezone()
        );
        User saved = userRepository.save(user);

        return toUserResponse(saved);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        // 암호화된 비밀번호와 입력값을 비교 (평문 비교 X)
        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        String accessToken = jwtTokenProvider.createToken(user.getUserId());
        return new LoginResponse(user.getUserId(), user.getName(), accessToken);
    }

    public MessageResponse logout(String authorizationHeader) {
        String token = resolveToken(authorizationHeader);

        // 유효한 토큰이면 만료 시각까지 블랙리스트에 등록해서 재사용을 막는다.
        // 토큰이 없거나 이미 잘못된 토큰이면 굳이 에러 내지 않고 그냥 로그아웃 처리(멱등하게)한다.
        if (token != null && jwtTokenProvider.isValid(token)) {
            tokenBlacklistService.blacklist(token, jwtTokenProvider.getExpiration(token));
        }

        return new MessageResponse("로그아웃되었습니다.");
    }

    private String resolveToken(String authorizationHeader) {
        if (authorizationHeader != null && authorizationHeader.startsWith(BEARER_PREFIX)) {
            return authorizationHeader.substring(BEARER_PREFIX.length());
        }
        return null;
    }

    public UserResponse getMe(Long userId) {
        User user = findUser(userId);
        return toUserResponse(user);
    }

    @Transactional
    public UserResponse updateMe(Long userId, UserUpdateRequest request) {
        User user = findUser(userId);
        user.updateProfile(request.getName(), request.getLanguage(), request.getTimezone());
        return toUserResponse(user);
    }

    public List<AvailabilityResponse> getAvailability(Long userId) {
        return userAvailabilityRepository.findByUser_UserId(userId).stream()
                .map(a -> new AvailabilityResponse(a.getAvailabilityId(), a.getDayOfWeek(), a.getStartTime(), a.getEndTime()))
                .collect(Collectors.toList());
    }

    @Transactional
    public MessageResponse updateAvailability(Long userId, AvailabilityUpdateRequest request) {
        User user = findUser(userId);

        // 요일별 회의 가능 시간을 통째로 교체
        userAvailabilityRepository.deleteByUser_UserId(userId);

        List<UserAvailability> entities = request.getAvailabilities().stream()
                .map(item -> new UserAvailability(user, item.getDayOfWeek(), item.getStartTime(), item.getEndTime()))
                .collect(Collectors.toList());
        userAvailabilityRepository.saveAll(entities);

        return new MessageResponse("회의 가능 시간이 저장되었습니다.");
    }

    private User findUser(Long userId) {
        return userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
    }

    private UserResponse toUserResponse(User user) {
        return new UserResponse(
                user.getUserId(),
                user.getName(),
                user.getEmail(),
                user.getLanguage(),
                user.getTimezone(),
                user.getCreatedAt()
        );
    }
}