package com.example.spm.controller;

import com.example.spm.model.dto.UserRegisterDTO;
import com.example.spm.model.entity.AppUser;
import com.example.spm.service.AppUserService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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

    @GetMapping("/users")
//    @PreAuthorize("hasRole('ADMIN') or hasRole('MANAGER') or hasRole('EMPLOYEE')")
    public ResponseEntity<List<AppUser>> getUsers() {
        return ResponseEntity.ok().body(appUserService.getUsers());
    }

    @PostMapping("/user/save")
    public ResponseEntity<AppUser> saveUser(
            @RequestBody @Valid UserRegisterDTO userRegisterDTO,
            BindingResult bindingResult
    ) {
        if (bindingResult.hasFieldErrors()) bindingResult.getFieldErrors().forEach(System.out::println);
        return new ResponseEntity<>(appUserService.saveUser(userRegisterDTO), HttpStatus.CREATED);
    }

}
