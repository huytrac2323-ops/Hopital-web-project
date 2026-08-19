package com.hopital.application.service;

import com.hopital.application.dto.JwtAuthResponse;
import com.hopital.application.dto.LoginDto;
import com.hopital.application.dto.RegisterDto;

public interface AuthService {
    String register(RegisterDto registerDto);
    JwtAuthResponse login(LoginDto loginDto);
}