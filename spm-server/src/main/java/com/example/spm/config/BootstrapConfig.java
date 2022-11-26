package com.example.spm.config;

import com.example.spm.model.entity.AppUser;
import com.example.spm.model.enums.UserRole;
import com.example.spm.model.enums.UserStatus;
import com.example.spm.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import javax.transaction.Transactional;

@Configuration
@RequiredArgsConstructor
public class BootstrapConfig implements CommandLineRunner {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // Creating an admin if not already exists to login with admin/admin creds
        if (!appUserRepository.existsByUsername("admin") && !appUserRepository.existsByEmail("admin@test.com")) {
            AppUser admin = AppUser.builder()
                    .status(UserStatus.VERIFIED)
                    .role(UserRole.ADMIN)
                    .email("admin@test.com")
                    .username("admin")
                    .password(passwordEncoder.encode("admin"))
                    .build();
            appUserRepository.save(admin);
        }
    }
}
