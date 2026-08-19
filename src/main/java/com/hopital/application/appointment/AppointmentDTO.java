package com.hopital.application.appointment;

import java.util.Date;

public class AppointmentDTO {
    private Long id;
    private String patientName;
    private String doctorName;
    private String doctorSpeciality;
    private Date appointmentDate;
    private String reason;

    // Constructors
    public AppointmentDTO() {
    }

    public AppointmentDTO(Long id, String patientName, String doctorName, String doctorSpeciality, Date appointmentDate, String reason) {
        this.id = id;
        this.patientName = patientName;
        this.doctorName = doctorName;
        this.doctorSpeciality = doctorSpeciality;
        this.appointmentDate = appointmentDate;
        this.reason = reason;
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getPatientName() {
        return patientName;
    }

    public void setPatientName(String patientName) {
        this.patientName = patientName;
    }

    public String getDoctorName() {
        return doctorName;
    }

    public void setDoctorName(String doctorName) {
        this.doctorName = doctorName;
    }

    public String getDoctorSpeciality() {
        return doctorSpeciality;
    }

    public void setDoctorSpeciality(String doctorSpeciality) {
        this.doctorSpeciality = doctorSpeciality;
    }

    public Date getAppointmentDate() {
        return appointmentDate;
    }

    public void setAppointmentDate(Date appointmentDate) {
        this.appointmentDate = appointmentDate;
    }

    public String getReason() {
        return reason;
    }

    public void setReason(String reason) {
        this.reason = reason;
    }
}