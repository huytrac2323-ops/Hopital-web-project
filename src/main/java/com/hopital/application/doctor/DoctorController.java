package com.hopital.application.doctor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/doctors")
public class DoctorController {

    @Autowired
    private DoctorService doctorService;

    @GetMapping("")
    public ResponseEntity<?> getAllDoctors() {
        return ResponseEntity.ok(doctorService.findAll());
    }

    // 2. API THÊM BÁC SĨ MỚI (Rất quan trọng, phải có @PostMapping)
    @PostMapping
    public ResponseEntity<?> addDoctor(@RequestBody Doctor doctor) {
        doctorService.save(doctor);
        return ResponseEntity.ok("Thêm bác sĩ thành công!"); // Thay bằng code thực tế
    }

    // 3. API SỬA BÁC SĨ (@PutMapping)
    @PutMapping("/{id}")
    public ResponseEntity<?> updateDoctor(@PathVariable Long id, @RequestBody Doctor doctor) {
        // Xử lý cập nhật...
        return ResponseEntity.ok("Sửa thành công!");
    }

    // 4. API XÓA BÁC SĨ (@DeleteMapping)
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteDoctor(@PathVariable Long id) {
        doctorService.deleteById(id);
        return ResponseEntity.ok("Xóa thành công!");
    }
}