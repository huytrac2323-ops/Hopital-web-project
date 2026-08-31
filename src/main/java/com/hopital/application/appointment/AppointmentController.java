package com.hopital.application.appointment;


import com.hopital.application.doctor.Doctor;
import com.hopital.application.dto.AppointmentRequest;
import com.hopital.application.patient.Patient;
import com.hopital.application.patient.PatientRepository;
import com.hopital.application.doctor.DoctorRepository;
import com.hopital.application.service.AppointmentService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/appointments")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private DoctorRepository doctorRepository;
    @Autowired
    private AppointmentService appointmentService;

    @GetMapping
    public ResponseEntity<?> getAllAppointments(Principal principal) {
        if (principal == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chưa đăng nhập!");
        }

        // Kiểm tra xem user hiện tại có quyền ADMIN hay không thông qua Spring Security
        boolean isAdmin = org.springframework.security.core.context.SecurityContextHolder.getContext()
                .getAuthentication().getAuthorities().stream()
                .anyMatch(auth -> auth.getAuthority().equals("ROLE_ADMIN") || auth.getAuthority().equals("ADMIN"));

        List<Appointment> appointments;

        if (isAdmin) {
            // Admin được xem toàn bộ lịch hẹn của hệ thống
            appointments = appointmentRepository.findAll();
        } else {
            // User thường chỉ xem lịch hẹn của chính họ
            Patient patient = patientRepository.findByName(principal.getName()).orElse(null);
            if (patient == null) {
                return ResponseEntity.ok(List.of());
            }
            appointments = appointmentRepository.findByPatient(patient);
        }

        // Chuyển đổi sang DTO và trả về
        List<AppointmentDTO> result = appointments.stream().map(appointment -> {
            Doctor doctor = appointment.getDoctor();
            Patient p = appointment.getPatient();
            return new AppointmentDTO(
                    appointment.getId(),
                    p != null ? p.getName() : "N/A",
                    doctor != null ? doctor.getName() : "N/A",
                    doctor != null ? doctor.getSpeciality() : "N/A",
                    appointment.getAppointmentDate(),
                    appointment.getReason()
            );
        }).collect(Collectors.toList());

        return ResponseEntity.ok(result);
    }

    @PostMapping
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentRequest request, Principal principal) {
        try {
            // 1. Kiểm tra xem người dùng đã đăng nhập chưa
            if (principal == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Chưa đăng nhập!");
            }

            // 2. Tìm hoặc tự động tạo thông tin Patient khớp với tên tài khoản đang đăng nhập
            Patient patient = patientRepository.findByName(principal.getName())
                    .orElseGet(() -> {
                        Patient newPatient = new Patient();
                        newPatient.setName(principal.getName());
                        return patientRepository.save(newPatient);
                    });

            // 3. Tìm bác sĩ theo ID truyền lên từ form đặt lịch
            Doctor doctor = doctorRepository.findById(request.getDoctorId())
                    .orElseThrow(() -> new RuntimeException("Không tìm thấy bác sĩ với ID: " + request.getDoctorId()));

            // 4. Khởi tạo và gán đúng đối tượng Patient vừa tìm thấy vào lịch hẹn
            Appointment newAppointment = new Appointment();
            newAppointment.setPatient(patient); // Gắn đúng ID của user hiện tại thay vì số 18 cố định!
            newAppointment.setDoctor(doctor);
            newAppointment.setAppointmentDate(request.getAppointmentDate());
            newAppointment.setReason(request.getReason());

            // 5. Lưu vào CSDL
            Appointment savedAppointment = appointmentRepository.save(newAppointment);

            return ResponseEntity.ok(savedAppointment);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.internalServerError().body("Lỗi hệ thống: " + e.getMessage());
        }
    }


}