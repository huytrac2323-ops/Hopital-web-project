package com.hopital.application.patient;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Entity;
import jakarta.persistence.Table;
import jakarta.persistence.Id;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.SequenceGenerator;
import java.util.Date;

@Entity // Đánh dấu đây là một JPA Entity
@Table(name = "patients") // Tên bảng trong cơ sở dữ liệu
@Data // Tự động tạo getters, setters, toString, equals, hashCode
@NoArgsConstructor // Tự động tạo constructor không tham số
@AllArgsConstructor // Tự động tạo constructor với tất cả các tham số
public class Patient {

    @Id
    @GeneratedValue(
        strategy = GenerationType.SEQUENCE,
        generator = "patient_sequence"
    )
    @SequenceGenerator(
        name = "patient_sequence",
        sequenceName = "patient_sequence",
        allocationSize = 1
    )
    private Long id;
    private String name;
    private Date dateOfBirth;
    private String gender; // Thêm trường giới tính
    private String address;
    private String phoneNumber;
    private String email; // Thêm trường email
    private String medicalHistory; // Thêm trường lịch sử bệnh án
}