package com.samsamoo.coordinator.service;

import com.samsamoo.coordinator.dto.common.MessageResponse;
import com.samsamoo.coordinator.dto.user.*;
import com.samsamoo.coordinator.entity.User;
import com.samsamoo.coordinator.entity.UserAvailability;
import com.samsamoo.coordinator.exception.CustomException;
import com.samsamoo.coordinator.exception.ErrorCode;
import com.samsamoo.coordinator.repository.UserAvailabilityRepository;
import com.samsamoo.coordinator.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
public class UserService {

    private final UserRepository userRepository;
    private final UserAvailabilityRepository userAvailabilityRepository;

    public UserService(UserRepository userRepository,
                       UserAvailabilityRepository userAvailabilityRepository) {
        this.userRepository = userRepository;
        this.userAvailabilityRepository = userAvailabilityRepository;
    }

    @Transactional
    public UserResponse signup(SignupRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        }

        // TODO: 비밀번호 암호화(BCrypt 등) 적용 필요 - 인증 방식 확정 후 반영
        User user = new User(
                request.getName(),
                request.getEmail(),
                request.getPassword(),
                request.getLanguage(),
                request.getTimezone()
        );
        User saved = userRepository.save(user);

        return toUserResponse(saved);
    }

    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        if (!user.getPassword().equals(request.getPassword())) {
            throw new CustomException(ErrorCode.INVALID_PASSWORD);
        }

        // TODO: 로그인 성공 시 세션/토큰(JWT 등) 발급 방식은 팀 협의 후 반영
        return new LoginResponse(user.getUserId(), user.getName(), user.getEmail());
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
