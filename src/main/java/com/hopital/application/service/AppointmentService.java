package com.hopital.application.service;

import com.hopital.application.appointment.Appointment;
import com.hopital.application.doctor.Doctor;
import com.hopital.application.doctor.DoctorRepository;
import com.hopital.application.patient.Patient;
import com.hopital.application.dto.AppointmentRequest;
import com.hopital.application.appointment.AppointmentRepository;
import com.hopital.application.patient.PatientRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class AppointmentService {

    @Autowired
    private PatientRepository patientRepository;

    @Autowired
    private AppointmentRepository appointmentRepository;

    @Autowired
    private DoctorRepository doctorRepository;

    // @Transactional đảm bảo nếu lỗi xảy ra giữa chừng, toàn bộ dữ liệu sẽ được rollback (hoàn tác)
    @Transactional
    public Appointment createAppointment(AppointmentRequest request) {

        // 1. Kiểm tra bệnh nhân đã tồn tại qua CCCD/BHYT chưa
        Optional<Patient> existingPatient = patientRepository.findByIdentityNumber(request.getIdentityNumber());
        Patient patient;

        if (existingPatient.isPresent()) {
            // Nếu là bệnh nhân cũ, lấy thông tin ra sử dụng
            patient = existingPatient.get();
        } else {
            patient = new Patient();
            patient.setName(request.getFullName()); // Sửa lại thành setName
            patient.setPhoneNumber(request.getPhone()); // Sửa lại thành setPhoneNumber
            patient.setIdentityNumber(request.getIdentityNumber());
            patient = patientRepository.save(patient);
        }

        // 2. Tạo lịch hẹn mới và liên kết với bệnh nhân
        Appointment appointment = new Appointment();
        appointment.setPatient(patient);
        appointment.setReason(request.getSymptoms());
        appointment.setAppointmentDate(new java.util.Date(System.currentTimeMillis() + 86400000L));
        appointment.setStatus("PENDING"); // Trạng thái chờ xác nhận

        if (request.getDoctorId() != null) {
            Doctor doctor = doctorRepository.findById(request.getDoctorId()).orElse(null);
            appointment.setDoctor(doctor);
        }
        // 3. Lưu lịch hẹn vào bảng appointments
        return appointmentRepository.save(appointment);
    }
}