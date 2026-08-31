package com.hopital.application.doctor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/doctors")
@PreAuthorize("hasRole('ADMIN')")
public class DoctorAdminController {

    private final DoctorRepository doctorRepository;

    public DoctorAdminController(DoctorRepository doctorRepository) {
        this.doctorRepository = doctorRepository;
    }

    // 1. Lấy danh sách bác sĩ
    @GetMapping
    public List<Doctor> getAllDoctors() {
        return doctorRepository.findAll();
    }

    // 2. Thêm mới bác sĩ
    @PostMapping
    public ResponseEntity<Doctor> createDoctor(@RequestBody Doctor doctor) {
        Doctor savedDoctor = doctorRepository.save(doctor);
        return ResponseEntity.ok(savedDoctor);
    }

    // 3. Cập nhật thông tin bác sĩ
    @PutMapping("/{id}")
    public ResponseEntity<Doctor> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctorDetails) {
        Doctor doctor = doctorRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ có id: " + id));

        doctor.setName(doctorDetails.getName());
        doctor.setSpeciality(doctorDetails.getSpeciality());
        doctor.setPhoneNumber(doctorDetails.getPhoneNumber());

        Doctor updatedDoctor = doctorRepository.save(doctor);
        return ResponseEntity.ok(updatedDoctor);
    }

    // 4. Xóa bác sĩ
    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteDoctor(@PathVariable Long id) {
        doctorRepository.deleteById(id);
        return ResponseEntity.ok("Xóa bác sĩ thành công!");
    }
}