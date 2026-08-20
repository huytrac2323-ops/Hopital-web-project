import React, { useState, useEffect } from 'react';
import '../PatientList/PatientList.css'; // Tái sử dụng CSS từ PatientList cho giao diện tương đồng
import { getAuthHeaders } from '../../utils/auth'; // Import a helper to get auth headers
import { useNavigate } from 'react-router-dom';

// Component DoctorList
function DoctorList() {
    // Sử dụng 'useState' để lưu trữ danh sách bác sĩ
    const [doctors, setDoctors] = useState([]);
    const navigate = useNavigate();

    // Sử dụng 'useEffect' để tải dữ liệu khi component được render lần đầu
    useEffect(() => {
        fetch(`${process.env.REACT_APP_API_URL}/api/doctors`, { headers: getAuthHeaders() }) // Gọi API từ backend Spring Boot
            .then(response => {
                if (response.status === 401) {
                    navigate('/login');
                    return;
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    setDoctors(data);
                }
            })
            .catch(error => console.error("Error fetching doctors:", error));
    }, [navigate]); // Mảng rỗng `[]` đảm bảo useEffect chỉ chạy 1 lần

    return (
        // Tái sử dụng các class CSS từ PatientList để có giao diện nhất quán
        <div className="patient-list-container">
            <h1>Danh Sách Bác Sĩ</h1>
            <div className="patient-grid">
                {Array.isArray(doctors) && doctors.map(doctor => (
                    <div key={doctor.id} className="patient-card">
                        <h2>{doctor.name}</h2>
                        <p><strong>Chuyên khoa:</strong> {doctor.speciality}</p>
                        <p><strong>Số điện thoại:</strong> {doctor.phoneNumber}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default DoctorList;