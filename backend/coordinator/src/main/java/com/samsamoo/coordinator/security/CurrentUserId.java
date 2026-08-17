package com.samsamoo.coordinator.security;

import java.lang.annotation.ElementType;
import java.lang.annotation.Retention;
import java.lang.annotation.RetentionPolicy;
import java.lang.annotation.Target;

// 컨트롤러 메서드 파라미터에 @CurrentUserId Long userId 로 붙이면
// JwtAuthenticationFilter가 검증해서 넣어둔 userId를 자동으로 꺼내준다.
// 기존 @RequestHeader("X-User-Id") Long userId 를 대체한다.
@Target(ElementType.PARAMETER)
@Retention(RetentionPolicy.RUNTIME)
public @interface CurrentUserId {
}
