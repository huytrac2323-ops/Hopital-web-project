package com.hopital.application.dto;

import lombok.Data;

import java.util.Date;

@Data
public class AppointmentRequest {
    private String fullName;
    private String phone;
    private String identityNumber; // CCCD hoặc BHYT
    private String symptoms;
    private Long doctorId;

    public String getReason() {
        return "";
    }

    public Date getAppointmentDate() {
        return null;
    }
}