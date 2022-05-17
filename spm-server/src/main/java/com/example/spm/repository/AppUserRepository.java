package com.example.spm.repository;

import com.example.spm.model.entity.AppUser;
import com.example.spm.model.enums.UserStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AppUserRepository extends JpaRepository<AppUser, Integer> {
    AppUser findByEmail (String email);
    Integer deleteByEmail (String email);

    List<AppUser> findAllByStatus (UserStatus userStatus);
}
