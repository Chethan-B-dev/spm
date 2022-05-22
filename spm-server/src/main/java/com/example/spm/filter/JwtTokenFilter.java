package com.example.spm.filter;

import com.example.spm.utility.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

@Component
@RequiredArgsConstructor
@Slf4j
public class JwtTokenFilter extends OncePerRequestFilter {
    private final JwtTokenUtil jwtTokenUtil;
    private final UserDetailsService userDetailsService;

    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    // todo: handle access denied exception properly

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        String path = request.getServletPath();

        if (path.equals("/api/login") || path.equals("/api/auth/user/save")){
            chain.doFilter(request, response);
            return;
        }

        try {
            final String requestTokenHeader = request.getHeader("Authorization");

            String email = null;
            String jwtToken = null;
            // JWT Token is in the form "Bearer token". Remove Bearer word and get only the Token
            if (requestTokenHeader != null && requestTokenHeader.startsWith("Bearer ")) {
                jwtToken = requestTokenHeader.substring(7);
//                try {
                    email = jwtTokenUtil.getUsernameFromToken(jwtToken);
//                } catch (IllegalArgumentException e) {
//                    System.out.println("Unable to get JWT Token");
//                } catch (ExpiredJwtException e) {
//                    System.out.println("JWT Token has expired");
//                }
            }
            // Once we get the token validate it.
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                UserDetails userDetails = userDetailsService.loadUserByUsername(email);

                // if token is valid configure Spring Security to manually set authentication

                if (jwtTokenUtil.validateToken(jwtToken, userDetails)) {

                    UsernamePasswordAuthenticationToken usernamePasswordAuthenticationToken =
                            new UsernamePasswordAuthenticationToken(
                                    userDetails, null, userDetails.getAuthorities());

                    usernamePasswordAuthenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    // After setting the Authentication in the context, we specify
                    // that the current user is authenticated. So it passes the Spring Security Configurations successfully.
                    SecurityContextHolder.getContext().setAuthentication(usernamePasswordAuthenticationToken);
                }
            }
        } catch (Exception exception) {
            log.error(exception.getMessage());
        }
        chain.doFilter(request, response);
    }
}
