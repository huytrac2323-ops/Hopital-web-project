package com.hopital.application.appointment;

import com.hopital.application.patient.Patient;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Long> {
    @Query("SELECT a FROM Appointment a JOIN FETCH a.patient JOIN FETCH a.doctor")
    List<Appointment> findAllWithPatientAndDoctor();

    List<Appointment> findByPatient(Patient patient);
}