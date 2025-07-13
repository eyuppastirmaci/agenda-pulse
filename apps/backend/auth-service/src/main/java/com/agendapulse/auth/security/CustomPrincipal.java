package com.agendapulse.auth.security;

import java.security.Principal;

public record CustomPrincipal(String userId, String email) implements Principal {
    @Override
    public String getName() {
        return userId;
    }
}