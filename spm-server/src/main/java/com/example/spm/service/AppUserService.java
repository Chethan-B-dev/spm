package com.example.spm.service;

import com.example.spm.exception.UserNotLoggedInException;
import com.example.spm.model.dto.UserRegisterDTO;
import com.example.spm.model.entity.AppUser;
import com.example.spm.model.enums.UserStatus;
import com.example.spm.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
@RequiredArgsConstructor
@Primary
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AppUser saveUser(UserRegisterDTO userRegisterDTO) {
        AppUser user = AppUser.builder()
                .email(userRegisterDTO.getEmail())
                .username(userRegisterDTO.getUsername())
                .password(passwordEncoder.encode(userRegisterDTO.getPassword()))
                .status(UserStatus.VERIFIED)
                .phone(userRegisterDTO.getPhone())
                .role(userRegisterDTO.getUserRole())
                .build();
        log.info("Saving new user {} to the database", user.getEmail());
        return appUserRepository.save(user);
    }

    public List<AppUser> getPendingUsers() {
        return appUserRepository.findAllByStatus(UserStatus.UNVERIFIED);
    }

    public List<AppUser> getUsers() {
        return appUserRepository.findAll();
    }

    public AppUser getUser(String email) {
        log.info("Fetching user {}", email);
        return appUserRepository.findByEmail(email);
    }

    public boolean deleteUserByEmail(String email) {
        return appUserRepository.deleteByEmail(email).equals(1);
    }

    public static MyAppUserDetails checkIfUserIsLoggedIn(MyAppUserDetails myAppUserDetails) {
        if (myAppUserDetails == null)
            throw new UserNotLoggedInException("Please Log in");
        return myAppUserDetails;
    }

}
