package com.hopital.application.doctor;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "doctors")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Doctor {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name; // Thêm trường name cho khớp database

    @Column(name = "speciality")
    private String speciality; // Khớp với cột speciality trong DBeaver

    @Column(name = "phone_number")
    private String phoneNumber; // Khớp với cột phone_number trong DBeaver

    // Đã lược bỏ trường email vì trong database không có cột này
}