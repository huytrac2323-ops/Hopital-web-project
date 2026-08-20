package com.hopital.application.dto;

import lombok.Data;

import java.util.Date; // Import Date

@Data
public class RegisterDto {
    private String username;
    private String password;
    private String email;

    // Thêm các trường thông tin bệnh nhân
    private Date dateOfBirth; // Sử dụng Date để khớp với Patient entity
    private String gender;
    private String address;
    private String phoneNumber;
    private String medicalHistory;

    // Phương thức getName() này có vẻ không cần thiết hoặc có thể được thay thế bằng getUsername()
    // Tạm thời giữ lại nếu có nơi khác sử dụng, nhưng nên xem xét lại
    public String getName() {
        return this.username; // Trả về username làm tên mặc định
    }
}