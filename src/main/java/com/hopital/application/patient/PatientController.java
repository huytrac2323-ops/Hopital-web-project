package com.hopital.application.patient;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/patients") // Base URL cho các API liên quan đến bệnh nhân
@CrossOrigin(origins = "http://localhost:3000") // Cho phép React frontend truy cập
public class PatientController {

    @Autowired
    private PatientRepository patientRepository;

    @GetMapping // Xử lý yêu cầu GET để lấy tất cả bệnh nhân
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    @GetMapping("/{id}") // Xử lý yêu cầu GET để lấy bệnh nhân theo ID
    public ResponseEntity<Patient> getPatientById(@PathVariable Long id) {
        Optional<Patient> patient = patientRepository.findById(id);
        return patient.map(ResponseEntity::ok)
                      .orElseGet(() -> ResponseEntity.notFound().build());
    }

    @PostMapping // Xử lý yêu cầu POST để thêm bệnh nhân mới
    public Patient createPatient(@RequestBody Patient patient) {
        return patientRepository.save(patient);
    }

    @PutMapping("/{id}") // Xử lý yêu cầu PUT để cập nhật bệnh nhân
    public ResponseEntity<Patient> updatePatient(@PathVariable Long id, @RequestBody Patient patientDetails) {
        Optional<Patient> patient = patientRepository.findById(id);
        if (patient.isPresent()) {
            Patient existingPatient = patient.get();
            existingPatient.setName(patientDetails.getName());
            existingPatient.setDateOfBirth(patientDetails.getDateOfBirth());
            existingPatient.setGender(patientDetails.getGender());
            existingPatient.setAddress(patientDetails.getAddress());
            existingPatient.setPhoneNumber(patientDetails.getPhoneNumber());
            existingPatient.setEmail(patientDetails.getEmail());
            existingPatient.setMedicalHistory(patientDetails.getMedicalHistory());
            // Cập nhật các trường khác nếu có

            Patient updatedPatient = patientRepository.save(existingPatient);
            return ResponseEntity.ok(updatedPatient);
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/{id}") // Xử lý yêu cầu DELETE để xóa bệnh nhân
    public ResponseEntity<HttpStatus> deletePatient(@PathVariable Long id) {
        try {
            patientRepository.deleteById(id);
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}