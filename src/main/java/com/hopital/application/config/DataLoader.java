package com.hopital.application.config;

import com.hopital.application.repository.RoleRepository;
import com.hopital.application.security.Role;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    private final RoleRepository roleRepository;

    public DataLoader(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public void run(String... args) throws Exception {
        if (roleRepository.findByName("ROLE_USER") == null) {
            roleRepository.save(new Role(null, "ROLE_USER"));
        }
        if (roleRepository.findByName("ROLE_ADMIN") == null) {
            roleRepository.save(new Role(null, "ROLE_ADMIN"));
        }
    }
}