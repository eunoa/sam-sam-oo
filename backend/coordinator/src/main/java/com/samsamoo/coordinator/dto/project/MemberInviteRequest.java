package com.samsamoo.coordinator.dto.project;

public class MemberInviteRequest {

    private String email;

    protected MemberInviteRequest() {
    }

    public MemberInviteRequest(String email) {
        this.email = email;
    }

    public String getEmail() {
        return email;
    }
}
