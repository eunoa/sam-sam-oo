package com.samsamoo.coordinator.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private static final String HEADER = "Authorization";
    private static final String PREFIX = "Bearer ";
    public static final String USER_ID_ATTRIBUTE = "userId";

    private final JwtTokenProvider jwtTokenProvider;
    private final TokenBlacklistService tokenBlacklistService;

    public JwtAuthenticationFilter(JwtTokenProvider jwtTokenProvider, TokenBlacklistService tokenBlacklistService) {
        this.jwtTokenProvider = jwtTokenProvider;
        this.tokenBlacklistService = tokenBlacklistService;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain) throws ServletException, IOException {

        String token = resolveToken(request);

        // 토큰이 없거나 잘못됐거나 로그아웃 처리된 토큰이면 여기서 요청을 막지는 않는다.
        // signup/login처럼 토큰이 필요 없는 API도 있기 때문에,
        // "이 API에 인증이 꼭 필요한가"는 @CurrentUserId를 쓰는 컨트롤러 쪽에서 판단한다.
        if (token != null && jwtTokenProvider.isValid(token) && !tokenBlacklistService.isBlacklisted(token)) {
            Long userId = jwtTokenProvider.getUserId(token);
            request.setAttribute(USER_ID_ATTRIBUTE, userId);
        }

        filterChain.doFilter(request, response);
    }

    private String resolveToken(HttpServletRequest request) {
        String header = request.getHeader(HEADER);
        if (header != null && header.startsWith(PREFIX)) {
            return header.substring(PREFIX.length());
        }
        return null;
    }
}
