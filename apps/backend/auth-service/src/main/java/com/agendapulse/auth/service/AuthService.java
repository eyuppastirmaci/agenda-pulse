package com.agendapulse.auth.service;

import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.agendapulse.auth.domain.User;
import com.agendapulse.auth.jwt.TokenService;
import com.agendapulse.auth.repo.UserRepository;
import com.agendapulse.common.model.auth.AuthResponse;
import com.agendapulse.common.model.auth.LoginRequest;
import com.agendapulse.common.model.auth.SignupRequest;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository repo;
    private final PasswordEncoder encoder;
    private final TokenService tokenService;   

    public AuthResponse signup(SignupRequest dto) {

        if (repo.existsByEmail(dto.email()))
            throw new IllegalArgumentException("E-mail already registered.");

        User user = repo.save(                     
                        new User(null,
                                 dto.email(),
                                 encoder.encode(dto.password())));

        String token = tokenService.generateToken(
                user.getId().toString(),
                Map.of("email", user.getEmail()));

        return new AuthResponse(token);
    }

    public AuthResponse login(LoginRequest dto) {

        User user = repo.findByEmail(dto.email())
                        .orElseThrow(() -> new IllegalArgumentException("User Not Found!"));

        if (!encoder.matches(dto.password(), user.getPassword()))
            throw new IllegalArgumentException("Password incorrect.");

        String token = tokenService.generateToken(
                user.getId().toString(),
                Map.of("email", user.getEmail()));

        return new AuthResponse(token);
    }
}
