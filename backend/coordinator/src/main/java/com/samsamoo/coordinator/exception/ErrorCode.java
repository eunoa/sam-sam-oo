package com.samsamoo.coordinator.exception;

import org.springframework.http.HttpStatus;

public enum ErrorCode {

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자를 찾을 수 없습니다."),
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 사용 중인 이메일입니다."),
    INVALID_PASSWORD(HttpStatus.UNAUTHORIZED, "비밀번호가 일치하지 않습니다."),
    PROJECT_NOT_FOUND(HttpStatus.NOT_FOUND, "프로젝트를 찾을 수 없습니다."),
    PROJECT_MEMBER_NOT_FOUND(HttpStatus.NOT_FOUND, "프로젝트 팀원을 찾을 수 없습니다."),
    NOT_PROJECT_LEADER(HttpStatus.FORBIDDEN, "팀장만 수행할 수 있는 작업입니다."),
    ALREADY_PROJECT_MEMBER(HttpStatus.CONFLICT, "이미 프로젝트에 참여 중인 사용자입니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED, "로그인이 필요합니다."),
    MEETING_NOT_FOUND(HttpStatus.NOT_FOUND, "회의를 찾을 수 없습니다."),
    MEETING_SUMMARY_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 생성된 회의 요약이 있습니다."),
    AI_TASK_SUGGESTION_NOT_FOUND(HttpStatus.NOT_FOUND, "AI 업무 제안을 찾을 수 없습니다."),
    TASK_NOT_FOUND(HttpStatus.NOT_FOUND, "업무를 찾을 수 없습니다."),
    UNSUPPORTED_LANGUAGE(HttpStatus.BAD_REQUEST, "지원하지 않는 언어입니다."),
    MEETING_SUMMARY_NOT_FOUND(HttpStatus.NOT_FOUND, "회의 요약을 찾을 수 없습니다.");

    private final HttpStatus status;
    private final String message;

    ErrorCode(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }

    public HttpStatus getStatus() {
        return status;
    }

    public String getMessage() {
        return message;
    }
}
