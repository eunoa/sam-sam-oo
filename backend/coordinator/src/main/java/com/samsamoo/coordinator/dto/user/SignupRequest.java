package com.samsamoo.coordinator.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class SignupRequest {

    @NotBlank(message = "이름을 입력해주세요.")
    private String name;

    @NotBlank(message = "이메일을 입력해주세요.")
    @Email(message = "올바른 이메일 형식이 아닙니다.")
    private String email;

    @NotBlank(message = "비밀번호를 입력해주세요.")
    @Size(min = 8, message = "비밀번호는 8자 이상이어야 합니다.")
    private String password;

    @NotBlank(message = "사용 언어를 입력해주세요.")
    private String language;

    @NotBlank(message = "시간대를 입력해주세요.")
    private String timezone;

    protected SignupRequest() {
    }

    public SignupRequest(String name, String email, String password, String language, String timezone) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.language = language;
        this.timezone = timezone;
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
}
