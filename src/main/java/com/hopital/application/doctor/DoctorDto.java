// src/main/java/com/hopital/application/dto/DoctorDto.java
package com.hopital.application.doctor;

import lombok.Data;

@Data // Lombok annotation for getters, setters, etc.
public class DoctorDto {
    private Long id;
    private String name;
    private String specialty;
    // Chỉ chứa các trường cần thiết cho client
}