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

@Service
@Slf4j
@RequiredArgsConstructor
public class AdminService {

    private final AppUserRepository appUserRepository;
    private final AppUserService appUserService;

    public AppUser getAdmin() {
        return appUserRepository
                .getAdmin().orElseThrow(() -> new UserNotFoundException("Admin not found"));
    }

    public List<AppUser> getAllUsers() {
        return appUserRepository.findByRoleNot(UserRole.ADMIN);
    }

    public List<AppUser> getPendingUsers() {
        return appUserRepository.findAllByStatusAndRoleNot(UserStatus.UNVERIFIED, UserRole.ADMIN);
    }

    public List<AppUser> getVerifiedUsers() {
        return appUserService.getVerifiedUsers();
    }


    @Transactional
    @Modifying
    public AppUser enableUser (Integer userId) {
        AppUser appUser = checkIfUserExists(userId);
        if (!appUser.getStatus().equals(UserStatus.DISABLED)) {
            throw new ActionNotAllowedException("that action is not allowed");
        }
        appUser.setStatus(UserStatus.UNVERIFIED);
        return appUserRepository.save(appUser);
    }

    @Transactional
    @Modifying
    public AppUser takeDecision(AdminDecisionDTO adminDecisionDTO) {
        AppUser appUser = checkIfUserExists(adminDecisionDTO.getUserId());
        if (adminDecisionDTO.getAdminDecision().equals(AdminDecision.APPROVE)) {
            appUser.setStatus(UserStatus.VERIFIED);
        } else {
            appUser.setStatus(UserStatus.DISABLED);
        }
        return appUserRepository.save(appUser);
    }

    public AppUser checkIfUserExists (Integer userId) {
        return appUserService.checkIfUserExists(userId);
    }

}
