package com.example.spm.service;

import com.example.spm.exception.ActionNotAllowedException;
import com.example.spm.exception.UserNotFoundException;
import com.example.spm.model.dto.AdminDecisionDTO;
import com.example.spm.model.entity.AppUser;
import com.example.spm.model.enums.AdminDecision;
import com.example.spm.model.enums.UserRole;
import com.example.spm.model.enums.UserStatus;
import com.example.spm.repository.AppUserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Slf4j
@RequiredArgsConstructor
public class AdminService {

    private final AppUserRepository appUserRepository;

    public List<AppUser> getAllUsers() {
        return appUserRepository.findByRoleNot(UserRole.ADMIN);
    }

    public List<AppUser> getPendingUsers() {
        return appUserRepository.findAllByStatusAndRoleNot(UserStatus.UNVERIFIED, UserRole.ADMIN);
    }

    public List<AppUser> getVerifiedUsers() {
        return appUserRepository.findAllByStatusAndRoleNot(UserStatus.VERIFIED, UserRole.ADMIN);
    }

    @Transactional
    @Modifying
    public void deleteUser (Integer userId) {
        AppUser appUser = checkIfUserExists(userId);
        // todo: delete all things he is part of like projects, tasks and stuff
        // todo: research about CASCADE.REMOVE and orphanRemoval in JPA
        appUserRepository.delete(appUser);
    }

    @Transactional
    public AppUser enableUser (Integer userId) {
        AppUser appUser = checkIfUserExists(userId);
        if (!appUser.getStatus().equals(UserStatus.DISABLED)) {
            throw new ActionNotAllowedException("that action is not allowed");
        }
        appUser.setStatus(UserStatus.UNVERIFIED);
        return appUserRepository.save(appUser);
    }

    @Transactional
    public AppUser takeDecision(AdminDecisionDTO adminDecisionDTO) {
        AppUser appUser = checkIfUserExists(adminDecisionDTO.getUserId());
        if (adminDecisionDTO.getAdminDecision().equals(AdminDecision.APPROVE)) {
            appUser.setStatus(UserStatus.VERIFIED);
        } else {
            appUser.setStatus(UserStatus.DISABLED);
        }
        return appUserRepository.save(appUser);
    }

    private AppUser checkIfUserExists (Integer userId) {
        Optional<AppUser> userOptional = appUserRepository.findById(userId);
        if (userOptional.isEmpty())
            throw new UserNotFoundException("user with id " + userId + " not found");
        return userOptional.get();
    }

}
