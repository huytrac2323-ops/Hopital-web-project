import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import './DoctorList.css'; // File CSS ở bước 2

function DoctorList() {
    const [doctors, setDoctors] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Lấy tham số specialty từ URL (nếu có)
    const [searchParams] = useSearchParams();
    const specialtyParam = searchParams.get('specialty');

    useEffect(() => {
        setIsLoading(true);
        // Tự động nhận diện domain (Localhost hoặc Render)
        const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:8080';

        fetch(`${apiUrl}/api/doctors`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Nếu có tham số chuyên khoa trên URL -> Lọc danh sách
                    if (specialtyParam) {
                        const filtered = data.filter(doc => doc.speciality === specialtyParam);
                        setDoctors(filtered);
                    } else {
                        // Nếu không có tham số (Click vào chữ Đội Ngũ Bác Sĩ) -> Hiển thị tất cả
                        setDoctors(data);
                    }
                }
            })
            .catch(err => console.error("Lỗi tải danh sách bác sĩ:", err))
            .finally(() => setIsLoading(false));
    }, [specialtyParam]); // useEffect sẽ chạy lại mỗi khi bấm vào chuyên khoa khác

    return (
        <div className="doctor-page-container">
            <h2 className="page-title">
                {specialtyParam ? `Chuyên khoa: ${specialtyParam}` : 'Tất Cả Bác Sĩ'}
            </h2>

            {isLoading ? (
                <p>Đang tải danh sách bác sĩ...</p>
            ) : (
                <div className="doctor-grid">
                    {doctors.length > 0 ? (
                        doctors.map(doc => (
                            <div key={doc.id} className="doctor-card">
                                <div className="doctor-avatar">👨‍⚕️</div>
                                <h3>{doc.name}</h3>
                                <p className="specialty-tag">{doc.speciality}</p>
                                <div className="doctor-info">
                                    <p><strong>Điện thoại:</strong> {doc.phone || 'Đang cập nhật'}</p>
                                    <p><strong>Kinh nghiệm:</strong> {doc.experience || '5 năm'} trong nghề</p>
                                </div>
                                <Link to="/book-appointment" className="btn-book-direct">
                                    Đặt Lịch Khám
                                </Link>
                            </div>
                        ))
                    ) : (
                        <div className="empty-state">
                            <p>Hiện chưa có bác sĩ nào thuộc chuyên khoa này.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}

export default DoctorList;