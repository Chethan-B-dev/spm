package com.example.spm.config;

import com.example.spm.filter.CustomAuthenticationFilter;
import com.example.spm.filter.JwtAuthenticationEntryPoint;
import com.example.spm.filter.JwtTokenFilter;
import com.example.spm.model.enums.UserRole;
import com.example.spm.service.AppUserService;
import com.example.spm.utility.JwtTokenUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.util.Set;

import static org.springframework.security.config.http.SessionCreationPolicy.STATELESS;

@Configuration
@RequiredArgsConstructor
@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    public static final Set<String> whiteListUrls =
            Set.of("/api/login", "/api/auth/**", "/api/shared/get-admin");
    private final JwtTokenFilter jwtTokenFilter;
    private final UserDetailsService userDetailsService;
    private final PasswordEncoder passwordEncoder;
    private final AppUserService userService;
    private final JwtTokenUtil jwtTokenUtil;
    private final JwtAuthenticationEntryPoint jwtAuthenticationEntryPoint;

    @Override
    protected void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.userDetailsService(userDetailsService).passwordEncoder(passwordEncoder);
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        CustomAuthenticationFilter customAuthenticationFilter = new CustomAuthenticationFilter(jwtTokenUtil,
                authenticationManagerBean(), userService);
        customAuthenticationFilter.setFilterProcessesUrl("/api/login");
        http.cors();
        http.csrf().disable();
        http.exceptionHandling().authenticationEntryPoint(jwtAuthenticationEntryPoint);
        http.sessionManagement().sessionCreationPolicy(STATELESS);
        http.authorizeRequests().antMatchers(whiteListUrls.toArray(new String[]{})).permitAll();
        http.authorizeRequests().antMatchers("/api/shared/get-admin").permitAll();
        http.authorizeRequests().antMatchers("/api/admin/**")
                .hasAnyAuthority(UserRole.ADMIN.name());
        http.authorizeRequests().antMatchers("/api/manager/**")
                .hasAnyAuthority(UserRole.MANAGER.name(), UserRole.ADMIN.name());
        http.authorizeRequests().antMatchers("/api/employee/**")
                .hasAnyAuthority(UserRole.EMPLOYEE.name(), UserRole.ADMIN.name());
        http.authorizeRequests().antMatchers("/api/shared/**")
                .hasAnyAuthority(UserRole.EMPLOYEE.name(), UserRole.MANAGER.name(), UserRole.ADMIN.name());
        http.authorizeRequests().anyRequest().authenticated();
        http.addFilter(customAuthenticationFilter);
        http.addFilterBefore(jwtTokenFilter, UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    @Override
    public AuthenticationManager authenticationManagerBean() throws Exception {
        return super.authenticationManagerBean();
    }
}
