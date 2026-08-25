package com.hopital.application.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "https://hopital-frontend-71bc.onrender.com")
public class AdminController {

    // API này chỉ Admin mới gọi được
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> getAdminDashboard() {
        return ResponseEntity.ok("Chào mừng bạn đến với trang quản trị Admin!");
    }
}