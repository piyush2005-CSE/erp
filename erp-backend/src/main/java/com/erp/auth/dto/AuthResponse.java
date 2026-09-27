package com.erp.auth.dto;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class AuthResponse {
    private String accessToken;
    private String refreshToken;
    private UserDto user;

    @Data
    @Builder
    public static class UserDto {
        private Long id;
        private String username;
        private String email;
        private String firstName;
        private String lastName;
        private String avatarUrl;
        private List<String> roles;
        private List<String> permissions;
    }
}
