package com.example.spm.service;

import com.example.spm.exception.ActionNotAllowedException;
import com.example.spm.exception.UserNotFoundException;
import com.example.spm.exception.UserNotLoggedInException;
import com.example.spm.model.dto.EditProfileDTO;
import com.example.spm.model.dto.PagedData;
import com.example.spm.model.dto.UserRegisterDTO;
import com.example.spm.model.entity.AppUser;
import com.example.spm.model.enums.UserDesignation;
import com.example.spm.model.enums.UserRole;
import com.example.spm.model.enums.UserStatus;
import com.example.spm.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.*;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import javax.validation.ValidationException;
import java.util.List;
import java.util.Objects;

@Service
@Slf4j
@RequiredArgsConstructor
@Primary
public class AppUserService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public AppUser saveUser(UserRegisterDTO userRegisterDTO) {

        if (userRegisterDTO.getUserRole() != null && userRegisterDTO.getUserRole().equals(UserRole.ADMIN))
            throw new ActionNotAllowedException("Cannot register as an admin");

        checkIfEmailAlreadyExists(userRegisterDTO.getEmail());

        AppUser user = AppUser.builder()
                .email(userRegisterDTO.getEmail())
                .username(userRegisterDTO.getUsername())
                .password(passwordEncoder.encode(userRegisterDTO.getPassword()))
                .status(userRegisterDTO.getUserRole() != UserRole.ADMIN ? UserStatus.UNVERIFIED : UserStatus.VERIFIED)
                .phone(userRegisterDTO.getPhone())
                .role(userRegisterDTO.getUserRole())
                .build();

        log.info("Saving new user {} to the database", user.getEmail());

        return appUserRepository.save(user);
    }

    public AppUser getUser(String email) {
        log.info("Fetching user {}", email);
        return appUserRepository.findByEmail(email);
    }

    public List<AppUser> getVerifiedUsers() {
        return appUserRepository.findAllByStatusAndRoleNot(UserStatus.VERIFIED, UserRole.ADMIN);
    }

    public AppUser checkIfUserExists (Integer userId) {
        return appUserRepository
                .findById(userId)
                .orElseThrow(() -> new UserNotFoundException("user with id " + userId + " not found"));
    }

    @Transactional
    @Modifying
    public AppUser setDesignation(Integer userId, UserDesignation designation) {
        AppUser user = checkIfUserExists(userId);
        user.setDesignation(designation);
        return appUserRepository.save(user);
    }

    public AppUser getUserById(Integer id) {
        return appUserRepository.findById(id).orElseThrow(() -> new UserNotFoundException("user not found"));
    }

    public boolean deleteUserByEmail(String email) {
        return appUserRepository.deleteByEmail(email).equals(1);
    }

    public static MyAppUserDetails checkIfUserIsLoggedIn(MyAppUserDetails myAppUserDetails) {
        if (Objects.isNull(myAppUserDetails))
            throw new UserNotLoggedInException("Please Log in");
        return myAppUserDetails;
    }

    public void checkIfEmailAlreadyExists(String email) {
        if (appUserRepository.existsByEmail(email))
            throw new ActionNotAllowedException("User with the email '" + email + "' already exists");
    }

    public static void checkIfUserIsManager(MyAppUserDetails myAppUserDetails) {
        if (!myAppUserDetails.getUser().getRole().equals(UserRole.MANAGER))
            throw new ActionNotAllowedException("Only a Manager can perform this action");
    }

    public PagedData<AppUser> getPagedVerifiedEmployees(int pageNumber, int pageSize) {
        Pageable paging = PageRequest.of(pageNumber, pageSize, Sort.by("id").ascending());
        Page<AppUser> employees = appUserRepository.findAllByStatusAndRole(UserStatus.VERIFIED, UserRole.EMPLOYEE, paging);
        return PagedData
                .<AppUser>builder()
                .data(employees.getContent())
                .totalPages(employees.getTotalPages())
                .currentPage(pageNumber)
                .build();
    }

    public List<AppUser> getAllUsersWithSearchKey(String searchKey) {
        return appUserRepository.getAllUsersWithSearchKey(searchKey);
    }

    @Transactional
    @Modifying
    public AppUser editProfile(EditProfileDTO editProfileDTO, MyAppUserDetails loggedInUser) {
        AppUser user = loggedInUser.getUser();

        // if a user with the same name exists throw an error
        final boolean hasChangedUsername = !user.getUsername().equalsIgnoreCase(editProfileDTO.getUsername());
        if (hasChangedUsername && appUserRepository.existsByUsername(editProfileDTO.getUsername())) {
            throw new ActionNotAllowedException("A user with the username '" + editProfileDTO.getUsername() + "' already exists.");
        }

        user.setUsername(editProfileDTO.getUsername());

        // phone number validation should be 10 digits
        if (editProfileDTO.getPhone().length() == 10) {
            user.setPhone(editProfileDTO.getPhone());
        } else {
            throw new ValidationException("Phone number has to be 10 digits");
        }

        if (!Objects.isNull(editProfileDTO.getImage())) {
            user.setImage(editProfileDTO.getImage());
        }
        user.setDesignation(editProfileDTO.getDesignation());
        return appUserRepository.save(user);
    }
}
