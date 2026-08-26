package com.hopital.application.doctor;

import org.springframework.web.bind.annotation.*;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/doctors")
@CrossOrigin(origins = "https://hopital-frontend-71bc.onrender.com") // Cấu hình CORS của bạn
public class DoctorController {

    // (Giả sử bạn đã có Service và Repository)
    // @Autowired
    // private DoctorService doctorService;

    // 1. API Lấy danh sách (Bạn có thể đã có)
    @GetMapping
    public ResponseEntity<?> getAllDoctors() {
        // return ResponseEntity.ok(doctorService.findAll());
        return ResponseEntity.ok().build(); // Thay bằng code thực tế của bạn
    }

    // 2. API THÊM BÁC SĨ MỚI (Rất quan trọng, phải có @PostMapping)
    @PostMapping
    public ResponseEntity<?> addDoctor(@RequestBody Doctor doctor) {
        // doctorService.save(doctor);
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
        // doctorService.deleteById(id);
        return ResponseEntity.ok("Xóa thành công!");
    }
}