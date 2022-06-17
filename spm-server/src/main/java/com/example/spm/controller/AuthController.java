package com.example.spm.controller;

import com.example.spm.model.dto.EditProfileDTO;
import com.example.spm.model.dto.UserRegisterDTO;
import com.example.spm.model.entity.AppUser;
import com.example.spm.service.AdminService;
import com.example.spm.service.AppUserService;
import com.example.spm.service.ManagerService;
import com.example.spm.service.MyAppUserDetails;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import javax.validation.Valid;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Slf4j
@RequestMapping("/api/auth")
public class AuthController {

    private final AppUserService appUserService;
    private final ManagerService managerService;
    private final AdminService adminService;

    @GetMapping("/users")
    public ResponseEntity<List<AppUser>> getUsers() {
        return ResponseEntity.ok().body(appUserService.getUsers());
    }

    @PostMapping("/user/save")
    public ResponseEntity<AppUser> saveUser(
            @RequestBody @Valid final UserRegisterDTO userRegisterDTO,
            BindingResult bindingResult
    ) {
        managerService.handleValidationErrors(bindingResult);
        return new ResponseEntity<>(
                appUserService.saveUser(userRegisterDTO),
                HttpStatus.CREATED
        );
    }

    @PutMapping("/user/edit")
    public ResponseEntity<AppUser> saveUser(
            @RequestBody @Valid final EditProfileDTO editProfileDTO,
            @AuthenticationPrincipal MyAppUserDetails myAppUserDetails
    ) {
        MyAppUserDetails loggedInUser = AppUserService.checkIfUserIsLoggedIn(myAppUserDetails);
        return new ResponseEntity<>(
                appUserService.editProfile(editProfileDTO, loggedInUser),
                HttpStatus.CREATED
        );
    }

}
