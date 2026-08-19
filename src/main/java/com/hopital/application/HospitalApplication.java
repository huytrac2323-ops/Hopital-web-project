package com.hopital.application;

import com.hopital.application.repository.RoleRepository;
import com.hopital.application.security.Role;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class HospitalApplication implements CommandLineRunner {

    public static void main(String[] args) {
        SpringApplication.run(HospitalApplication.class, args);
    }

    @Autowired
    private RoleRepository roleRepository;

    @Override
    public void run(String... args) throws Exception {
        // Kiểm tra xem vai trò ROLE_ADMIN đã tồn tại chưa
        Role adminRole = roleRepository.findByName("ROLE_ADMIN");
        if (adminRole == null) {
            // Nếu chưa, tạo mới và lưu vào DB
            Role newAdminRole = new Role();
            newAdminRole.setName("ROLE_ADMIN");
            roleRepository.save(newAdminRole);
        }

        // Kiểm tra xem vai trò ROLE_USER đã tồn tại chưa
        Role userRole = roleRepository.findByName("ROLE_USER");
        if (userRole == null) {
            // Nếu chưa, tạo mới và lưu vào DB
            Role newUserRole = new Role();
            newUserRole.setName("ROLE_USER");
            roleRepository.save(newUserRole);
        }
    }
}
