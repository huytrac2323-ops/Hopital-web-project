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
import org.springframework.transaction.annotation.Transactional;

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
    @Transactional
    public String register(RegisterDto registerDto) {
        logger.info("Attempting to register user: {}", registerDto.getUsername());

        // add check for username exists in database
        if(userRepository.existsByUsername(registerDto.getUsername())){
            throw new HospitalAPIException(HttpStatus.BAD_REQUEST, "Username is already exists!.");
        }

        // add check for email exists in database
        if(userRepository.existsByEmail(registerDto.getEmail())){
            throw new HospitalAPIException(HttpStatus.BAD_REQUEST, "Email is already exists!.");
        }

        User user = new User();
        user.setName(registerDto.getUsername());
        user.setUsername(registerDto.getUsername());
        user.setEmail(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));

        Set<Role> roles = new HashSet<>();
        Role userRole = roleRepository.findByName("ROLE_USER");

        // Nếu quyền không tồn tại, tạo và lưu nó trước
        if (userRole == null) {
            logger.info("ROLE_USER not found, creating it.");
            userRole = new Role();
            userRole.setName("ROLE_USER");
            roleRepository.save(userRole);
        }
        
        roles.add(userRole);
        user.setRoles(roles);

        userRepository.save(user);

        // Create a corresponding Patient entry with full details
        Patient patient = new Patient();
        patient.setName(registerDto.getUsername());
        patient.setEmail(registerDto.getEmail());
        patient.setDateOfBirth(registerDto.getDateOfBirth());
        patient.setGender(registerDto.getGender());
        patient.setAddress(registerDto.getAddress());
        patient.setPhoneNumber(registerDto.getPhoneNumber());
        patient.setMedicalHistory(registerDto.getMedicalHistory());

        patientRepository.save(patient);

        logger.info("User {} registered successfully!.", registerDto.getUsername());
        return "User registered successfully!.";
    }
}