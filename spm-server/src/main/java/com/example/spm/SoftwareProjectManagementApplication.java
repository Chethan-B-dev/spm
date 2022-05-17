package com.example.spm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

@SpringBootApplication
public class SoftwareProjectManagementApplication {

	// todo: https://www.toptal.com/spring/spring-security-tutorial for jwt auth

	public static void main(String[] args) {
		SpringApplication.run(SoftwareProjectManagementApplication.class, args);
	}

	@Bean
	public PasswordEncoder bCryptPasswordEncoder() {
		return new BCryptPasswordEncoder();
	}

}
