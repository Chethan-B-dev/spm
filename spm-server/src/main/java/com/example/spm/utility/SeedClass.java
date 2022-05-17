package com.example.spm.utility;


import com.example.spm.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SeedClass implements CommandLineRunner {

    private final AppUserService appUserService;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
//        AppUser appUser = AppUser.builder()
//                .email("chethanborigin@gmail1.com")
//                .password(passwordEncoder.encode("chethan"))
//                .phone("9591833072")
//                .role(UserRole.EMPLOYEE)
//                .username("Chethan B")
//                .status(UserStatus.VERIFIED)
//                .build();
//
//        appUserService.saveUser(appUser);
    }
}
