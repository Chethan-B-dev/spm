package com.example.spm.repository;

import com.example.spm.model.entity.AppUser;
import com.example.spm.model.enums.UserRole;
import com.example.spm.model.enums.UserStatus;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppUserRepository extends JpaRepository<AppUser, Integer> {
    AppUser findByEmail (String email);
    Integer deleteByEmail (String email);
    List<AppUser> findAllByStatus (UserStatus userStatus);

    List<AppUser> findAllByStatusAndRoleNot (UserStatus userStatus, UserRole userRole);
    List<AppUser> findByRoleNot (UserRole userRole);

    List<AppUser> findAllByStatusAndRole (UserStatus userStatus, UserRole userRole, Pageable pageable);

    boolean existsById(Integer userId);

}
