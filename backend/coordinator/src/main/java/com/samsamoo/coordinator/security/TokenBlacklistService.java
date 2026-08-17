package com.samsamoo.coordinator.security;

import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
public class TokenBlacklistService {

    // JWT는 서버가 상태를 안 가지는 방식이라, 로그아웃했다고 토큰 자체가 무효화되지는 않는다.
    // 그래서 "로그아웃한 토큰 목록"을 서버가 따로 기억해뒀다가, 요청이 오면 확인하는 방식으로 흉내낸다.
    // TODO: 서버가 여러 대로 늘어나면(스케일 아웃) 메모리 대신 Redis 같은 공유 저장소로 옮겨야 함
    private final Map<String, Date> blacklist = new ConcurrentHashMap<>();

    public void blacklist(String token, Date expiresAt) {
        blacklist.put(token, expiresAt);
    }

    public boolean isBlacklisted(String token) {
        Date expiresAt = blacklist.get(token);
        if (expiresAt == null) {
            return false;
        }
        if (expiresAt.before(new Date())) {
            // 어차피 자연 만료된 토큰이면 굳이 계속 들고 있을 필요 없음
            blacklist.remove(token);
            return false;
        }
        return true;
    }
}
