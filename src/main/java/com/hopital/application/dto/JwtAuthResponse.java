package com.hopital.application.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class JwtAuthResponse {
    private String accessToken;
    private String tokenType = "Bearer";

    // Constructor, getters, setters
    public JwtAuthResponse(String accessToken) {
        this.accessToken = accessToken;
    }

    // ⭐ BẮT BUỘC PHẢI CÓ DÒNG NÀY ĐỂ JAVA PHỤC VỤ DỮ LIỆU CHO FRONTEND:
    public String getAccessToken() {
        return accessToken;
    }

    public void setAccessToken(String accessToken) {
        this.accessToken = accessToken;
    }

    public String getTokenType() {
        return tokenType;
    }

    public void setTokenType(String tokenType) {
        this.tokenType = tokenType;
    }
}
