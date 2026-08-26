package com.hopital.application.appointment;

import com.hopital.application.doctor.Doctor;
import com.hopital.application.patient.Patient;
import com.hopital.application.patient.PatientRepository;
import com.hopital.application.doctor.DoctorRepository;
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
@CrossOrigin(origins = "https://hopital-frontend-71bc.onrender.com")
public class AppointmentController {

    @Autowired
    private AppointmentRepository appointmentRepository;
    @Autowired
    private PatientRepository patientRepository;
    @Autowired
    private DoctorRepository doctorRepository;

    @GetMapping
    public List<AppointmentDTO> getAllAppointments(Principal principal) {
        // Tìm bệnh nhân dựa trên tên đăng nhập của người dùng
        Patient patient = patientRepository.findByName(principal.getName())
                .orElseThrow(() -> new UsernameNotFoundException("Patient not found with name: " + principal.getName()));

        // Lấy danh sách lịch hẹn của bệnh nhân đó
        return appointmentRepository.findByPatient(patient).stream().map(appointment -> {
            Doctor doctor = appointment.getDoctor();
            return new AppointmentDTO(
                    appointment.getId(),
                    patient.getName(),
                    doctor != null ? doctor.getName() : "N/A",
                    doctor != null ? doctor.getSpeciality() : "N/A",
                    appointment.getAppointmentDate(),
                    appointment.getReason()
            );
        }).collect(Collectors.toList());
    }

    @PostMapping
    @Transactional
    public ResponseEntity<AppointmentDTO> createAppointment(@RequestBody AppointmentRequestDTO appointmentRequestDTO, Principal principal) {
        // 1. Tìm hoặc tạo mới bệnh nhân
        Optional<Patient> patientOptional = patientRepository.findByName(principal.getName());
        Patient patient;
        if (patientOptional.isPresent()) {
            patient = patientOptional.get();
        } else {
            Patient newPatient = new Patient();
            newPatient.setName(principal.getName());
            patient = patientRepository.save(newPatient);
        }

        // 2. Tìm bác sĩ
        Optional<Doctor> doctorOptional = doctorRepository.findById(appointmentRequestDTO.getDoctorId());
        if (doctorOptional.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }
        Doctor doctor = doctorOptional.get();

        // 3. Tạo lịch hẹn mới
        Appointment newAppointment = new Appointment();
        newAppointment.setPatient(patient);
        newAppointment.setDoctor(doctor);
        newAppointment.setAppointmentDate(appointmentRequestDTO.getAppointmentDate());
        newAppointment.setReason(appointmentRequestDTO.getReason());

        // 4. Lưu lịch hẹn
        Appointment savedAppointment = appointmentRepository.save(newAppointment);

        // 5. Chuyển đổi sang DTO để trả về
        AppointmentDTO appointmentDTO = new AppointmentDTO(
                savedAppointment.getId(),
                patient.getName(),
                doctor.getName(),
                doctor.getSpeciality(),
                savedAppointment.getAppointmentDate(),
                savedAppointment.getReason()
        );

        return ResponseEntity.ok(appointmentDTO);
    }
}