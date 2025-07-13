package com.agendapulse.auth.security.filter;

import java.util.List;

import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.agendapulse.auth.jwt.TokenService;
import com.agendapulse.auth.security.CustomPrincipal;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jws;
import java.io.IOException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Component
public class JwtAuthFilter extends OncePerRequestFilter {
    
    private final TokenService tokenService;

    @Override
    protected void doFilterInternal(
            @NonNull HttpServletRequest req, 
            @NonNull HttpServletResponse res, 
            @NonNull FilterChain chain) throws ServletException, IOException {
        String header = req.getHeader("Authorization");
        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            if (tokenService.isValid(token)) {
                Jws<Claims> jws = tokenService.parseToken(token);
                String userId = jws.getPayload().getSubject();
                String email = jws.getPayload().get("email", String.class);

                CustomPrincipal principal = new CustomPrincipal(userId, email);

                UsernamePasswordAuthenticationToken auth =
                        new UsernamePasswordAuthenticationToken(
                                principal,         // the authenticated user details
                                null,  // usually the password, but null here since already authenticated
                                List.of()          // list of granted roles/authorities, empty in this case
                        );
                SecurityContextHolder.getContext().setAuthentication(auth);
            }
        }
        chain.doFilter(req, res);
    }

}
