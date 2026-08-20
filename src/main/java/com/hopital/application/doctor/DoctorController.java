package com.hopital.application.doctor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "https://hopital-frontend-71bc.onrender.com")
public class DoctorController {

    @Autowired
    private DoctorService doctorService; // <-- Gọi Service thay vì Repository

    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorService.getAllDoctors();
    }

    @PostMapping
    public Doctor createDoctor(@RequestBody Doctor doctor) {
        return doctorService.createDoctor(doctor);
    }

    // Bạn có thể thêm các phương thức PUT, DELETE, GET by ID tương tự
}