package com.agendapulse.auth.controller;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;

import com.agendapulse.auth.service.AuthService;
import com.agendapulse.common.model.auth.AuthResponse;
import com.agendapulse.common.model.auth.LoginRequest;
import com.agendapulse.common.model.auth.SignupRequest;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;

    @PostMapping("/signup")
    public AuthResponse signup(@Valid @RequestBody SignupRequest dto) {
        return authService.signup(dto);
    }

    @PostMapping("/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest dto) {
        return authService.login(dto);
    }
}