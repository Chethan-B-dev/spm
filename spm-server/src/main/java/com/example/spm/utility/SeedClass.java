package com.example.spm.utility;


import com.example.spm.repository.AppUserRepository;
import com.example.spm.service.AppUserService;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
public class SeedClass implements CommandLineRunner {

    private final AppUserService appUserService;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
//        UserRegisterDTO unverified = UserRegisterDTO
//                .builder()
//                .email("test@test2.com")
//                .password("test2")
//                .username("test2")
//                .phone("9591833072")
//                .userRole(UserRole.EMPLOYEE)
//                .build();
//
//        UserRegisterDTO disabled = UserRegisterDTO
//                .builder()
//                .email("disable@test.com")
//                .password("disable")
//                .username("disable")
//                .phone("9591833072")
//                .userRole(UserRole.EMPLOYEE)
//                .build();
//
//        appUserService.saveUser(disabled);
//
//        AppUser disabledUser = appUserService.saveUser(disabled);
//        disabledUser.setStatus(UserStatus.DISABLED);
//        appUserRepository.save(disabledUser);
//
//        UserRegisterDTO admin = UserRegisterDTO
//                .builder()
//                .email("admin@test.com")
//                .password("admin")
//                .username("admin")
//                .phone("9591833072")
//                .userRole(UserRole.ADMIN)
//                .build();
//
//        appUserService.saveUser(admin);
    }
}
