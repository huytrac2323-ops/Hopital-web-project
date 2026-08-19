package com.hopital.application.service.impl;

import com.hopital.application.dto.JwtAuthResponse;
import com.hopital.application.security.JwtTokenProvider;
import com.hopital.application.security.Role;
import com.hopital.application.security.User;
import com.hopital.application.dto.LoginDto;
import com.hopital.application.dto.RegisterDto;
import com.hopital.application.share.exception.HospitalAPIException;
import com.hopital.application.repository.RoleRepository;
import com.hopital.application.repository.UserRepository;
import com.hopital.application.service.AuthService;
import com.hopital.application.patient.Patient;
import com.hopital.application.patient.PatientRepository;

import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.HashSet;
import java.util.Set;

@Service
public class AuthServiceImpl implements AuthService {

    private static final Logger logger = LoggerFactory.getLogger(AuthServiceImpl.class);

    private AuthenticationManager authenticationManager;
    private UserRepository userRepository;
    private RoleRepository roleRepository;
    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;
    private PatientRepository patientRepository;

    public AuthServiceImpl(AuthenticationManager authenticationManager,
                           UserRepository userRepository,
                           RoleRepository roleRepository,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider jwtTokenProvider,
                           PatientRepository patientRepository) {
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
        this.roleRepository = roleRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.patientRepository = patientRepository;
    }

    @Override
    public JwtAuthResponse login(LoginDto loginDto) {

        Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(
                loginDto.getUsernameOrEmail(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);

        return new JwtAuthResponse(token);
    }

    @Override
    public String register(RegisterDto registerDto) {
        logger.info("Attempting to register user: {}", registerDto.getUsername());

        // add check for username exists in database
        logger.info("Checking if username {} already exists.", registerDto.getUsername());
        try {
            if(userRepository.existsByUsername(registerDto.getUsername())){
                logger.warn("Registration failed: Username {} is already exists!.", registerDto.getUsername());
                throw new HospitalAPIException(HttpStatus.BAD_REQUEST, "Username is already exists!.");
            }
            logger.info("Username {} is available.", registerDto.getUsername());
        } catch (Exception e) {
            logger.error("Error checking existence of username {}: {}", registerDto.getUsername(), e.getMessage(), e);
            throw new HospitalAPIException(HttpStatus.INTERNAL_SERVER_ERROR, "Error checking username availability.");
        }


        // add check for email exists in database
        logger.info("Checking if email {} already exists.", registerDto.getEmail());
        try {
            if(userRepository.existsByEmail(registerDto.getEmail())){
                logger.warn("Registration failed: Email {} is already exists!.", registerDto.getEmail());
                throw new HospitalAPIException(HttpStatus.BAD_REQUEST, "Email is already exists!.");
            }
            logger.info("Email {} is available.", registerDto.getEmail());
        } catch (Exception e) {
            logger.error("Error checking existence of email {}: {}", registerDto.getEmail(), e.getMessage(), e);
            throw new HospitalAPIException(HttpStatus.INTERNAL_SERVER_ERROR, "Error checking email availability.");
        }


        User user = new User();
        user.setName(registerDto.getUsername());
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName("ROLE_USER");
        if (userRole == null) {
            logger.info("ROLE_USER not found, creating it.");
            userRole = new Role();
            userRole.setName("ROLE_USER");
            roleRepository.save(userRole);
        }
        roles.add(userRole);
        user.setRoles(roles);

        try {
            logger.info("Saving new user: {}", user.getUsername());
            userRepository.save(user);
            logger.info("User {} saved successfully.", user.getUsername());
        } catch (Exception e) {
            logger.error("Error saving user {}: {}", user.getUsername(), e.getMessage(), e);
            throw new HospitalAPIException(HttpStatus.INTERNAL_SERVER_ERROR, "Error saving user.");
        }


        // Create a corresponding Patient entry
        Patient patient = new Patient();
        patient.setName(registerDto.getUsername());
        patient.setEmail(registerDto.getEmail());
        // You might want to set other default values or leave them null
        try {
            logger.info("Saving new patient for user: {}", patient.getName());
            patientRepository.save(patient);
            logger.info("Patient {} saved successfully.", patient.getName());
        } catch (Exception e) {
            logger.error("Error saving patient for user {}: {}", patient.getName(), e.getMessage(), e);
            // Consider rolling back user creation if patient creation fails, or handle appropriately
            throw new HospitalAPIException(HttpStatus.INTERNAL_SERVER_ERROR, "Error saving patient.");
        }

        logger.info("User {} registered successfully!.", registerDto.getUsername());
        return "User registered successfully!.";
    }
}