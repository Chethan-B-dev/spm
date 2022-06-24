package com.example.spm.repository;

import com.example.spm.model.entity.AppUser;
import com.example.spm.model.enums.UserRole;
import com.example.spm.model.enums.UserStatus;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AppUserRepository extends JpaRepository<AppUser, Integer> {
    AppUser findByEmail (String email);
    Integer deleteByEmail (String email);
    List<AppUser> findAllByStatus (UserStatus userStatus);

    List<AppUser> findAllByStatusAndRoleNot (UserStatus userStatus, UserRole userRole);
    List<AppUser> findByRoleNot (UserRole userRole);

    Page<AppUser> findAllByStatusAndRole (UserStatus userStatus, UserRole userRole, Pageable pageable);

    boolean existsById(Integer userId);

    boolean existsByEmail(String email);

    @Query(
            value = "SELECT * FROM app_user a WHERE LOWER(a.username) LIKE %:searchKey%",
            nativeQuery = true)
    List<AppUser> getAllUsersWithSearchKey(String searchKey);

//    List<AppUser> findAllByUsernameContaining(String searchKey);
}
