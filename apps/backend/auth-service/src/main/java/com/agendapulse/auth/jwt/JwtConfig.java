package com.agendapulse.auth.jwt;

import org.springframework.boot.context.properties.ConfigurationProperties;
import lombok.Getter;
import lombok.Setter;

@Getter @Setter
@ConfigurationProperties(prefix = "jwt")
public class JwtConfig {
    private String  secret;     
    private Integer expiresMin; 
}