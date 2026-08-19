package com.samsamoo.coordinator.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class PasswordConfig {

    // BCrypt로 비밀번호를 암호화/검증하기 위한 Bean.
    // spring-security-crypto 의존성만 있으면 되고, Spring Security 전체 설정(로그인 폼, 필터체인 등)은 켜지지 않는다.
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
