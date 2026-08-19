// src/main/java/com/hopital/application/service/DoctorService.java
package com.hopital.application.doctor;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DoctorService {

    @Autowired
    private DoctorRepository doctorRepository;

    public List<Doctor> getAllDoctors() {
        // Có thể thêm các logic nghiệp vụ ở đây trong tương lai
        return doctorRepository.findAll();
    }

    public Doctor createDoctor(Doctor doctor) {
        // Ví dụ: kiểm tra xem bác sĩ đã tồn tại chưa, validate dữ liệu, v.v.
        return doctorRepository.save(doctor);
    }
}