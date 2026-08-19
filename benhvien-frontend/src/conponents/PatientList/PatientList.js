import React, { useState, useEffect } from 'react';
import './PatientList.css'; // File CSS để trang trí
import { getAuthHeaders } from '../../utils/auth'; // Import a helper to get auth headers
import { useNavigate } from 'react-router-dom';

// Component PatientList
function PatientList() {
    // Sử dụng 'useState' để lưu trữ danh sách bệnh nhân
    const [patients, setPatients] = useState([]);
    const navigate = useNavigate();

    // Sử dụng 'useEffect' để tải dữ liệu khi component được render lần đầu
    useEffect(() => {
        fetch('http://localhost:8080/api/patients', { headers: getAuthHeaders() }) // Gọi API từ backend Spring Boot
            .then(response => {
                if (response.status === 401) {
                    navigate('/login');
                    return;
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    setPatients(data);
                }
            })
            .catch(error => console.error("Error fetching patients:", error));
    }, [navigate]); // Mảng rỗng `[]` đảm bảo useEffect chỉ chạy 1 lần

    return (
        <div className="patient-list-container">
            <h1>Danh Sách Bệnh Nhân</h1>
            {/* Thêm nút hoặc form để thêm bệnh nhân mới nếu cần */}
            <div className="patient-grid">
                {Array.isArray(patients) && patients.map(patient => (
                    <div key={patient.id} className="patient-card">
                        <h3>{patient.name}</h3>
                        <p>ID: {patient.id}</p>
                        <p>Ngày sinh: {patient.dateOfBirth ? new Date(patient.dateOfBirth).toLocaleDateString() : 'N/A'}</p>
                        <p>Giới tính: {patient.gender}</p>
                        <p>Địa chỉ: {patient.address}</p>
                        <p>Số điện thoại: {patient.phoneNumber}</p>
                        <p>Email: {patient.email}</p>
                        <p>Lịch sử bệnh án: {patient.medicalHistory}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}
export default PatientList;