package com.example.spm.filter;

import com.example.spm.model.dto.GeneralAuthExceptionDTO;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.Serializable;
import java.time.LocalDateTime;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;

@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint, Serializable {

    private static final long serialVersionUID = -7858869558953243875L;

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException {
        response.setContentType(APPLICATION_JSON_VALUE);
        response.setStatus(HttpStatus.UNAUTHORIZED.value());
        GeneralAuthExceptionDTO generalExceptionResponseDTO = GeneralAuthExceptionDTO
                .builder()
                .error("User not authenticated or JWT is expired")
                .timestamp(LocalDateTime.now().toString())
                .build();
        new ObjectMapper().writeValue(response.getOutputStream(), generalExceptionResponseDTO);
    }
}