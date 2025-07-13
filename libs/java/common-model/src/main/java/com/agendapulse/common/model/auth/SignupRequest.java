package com.agendapulse.common.model.auth; 

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record SignupRequest(
        @Email @NotBlank(message = "Email must not be empty.") String email, 
        @Size(min = 6, message = "Password must be at least 6 characters long.") String password) { 
    
}