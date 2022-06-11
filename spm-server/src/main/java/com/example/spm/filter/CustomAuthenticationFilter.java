package com.example.spm.filter;

import com.example.spm.model.dto.BadCredentialsResponseDTO;
import com.example.spm.model.dto.LoginResponseDTO;
import com.example.spm.model.entity.AppUser;
import com.example.spm.service.AppUserService;
import com.example.spm.service.MyAppUserDetails;
import com.example.spm.utility.JwtTokenUtil;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationServiceException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

import static org.springframework.http.MediaType.APPLICATION_JSON_VALUE;


@Slf4j
public class CustomAuthenticationFilter extends UsernamePasswordAuthenticationFilter {

    private final AuthenticationManager authenticationManager;
    private final AppUserService userService;

    @Value("${jwt.secret}")
    private String jwtSecret;

    private final JwtTokenUtil jwtTokenUtil;
    private final ObjectMapper objectMapper = new ObjectMapper();

    public CustomAuthenticationFilter(
            JwtTokenUtil jwtTokenUtil,
            AuthenticationManager authenticationManager,
            AppUserService userService
    ) {
        this.jwtTokenUtil = jwtTokenUtil;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
    }

    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {
        String email = request.getParameter("email");
        String password = request.getParameter("password");
        if (email == null || password == null) {
            try {
                Map<String, String> requestMap =
                        objectMapper.readValue(request.getInputStream(), HashMap.class);
                email = requestMap.get("email");
                password = requestMap.get("password");
            } catch (IOException e) {
                throw new AuthenticationServiceException(e.getMessage(), e);
            }
        }
        AppUser user = userService.getUser(email);
        if (user == null)
            throw new AuthenticationServiceException("email or password is incorrect");
        MyAppUserDetails myUserDetails = new MyAppUserDetails(user);
        UsernamePasswordAuthenticationToken authenticationToken =
                    new UsernamePasswordAuthenticationToken(myUserDetails.getUsername(), password, myUserDetails.getAuthorities());
        return authenticationManager.authenticate(authenticationToken);
    }

    @Override
    protected void unsuccessfulAuthentication
            (HttpServletRequest request,
             HttpServletResponse response,
             AuthenticationException failed
            ) throws IOException, ServletException {

        BadCredentialsResponseDTO badCredentialsResponseDTO = BadCredentialsResponseDTO.builder()
                .timeStamp(LocalDateTime.now().toString())
                .message(failed.getMessage())
                .build();

        response.setContentType(APPLICATION_JSON_VALUE);
        response.setStatus(HttpStatus.UNAUTHORIZED.value());

        objectMapper.writeValue(response.getOutputStream(), badCredentialsResponseDTO);
    }

    @Override
    protected void successfulAuthentication(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain chain,
            Authentication authentication
    ) throws IOException, ServletException {

        MyAppUserDetails myAppUserDetails = (MyAppUserDetails) authentication.getPrincipal();
        String token = jwtTokenUtil.generateToken(myAppUserDetails);
        LoginResponseDTO loginResponseDTO = LoginResponseDTO
                .builder()
                .token(token)
                .user(myAppUserDetails.getUser())
                .build();
        response.setContentType(APPLICATION_JSON_VALUE);
        objectMapper.writeValue(response.getOutputStream(), loginResponseDTO);
    }
}
