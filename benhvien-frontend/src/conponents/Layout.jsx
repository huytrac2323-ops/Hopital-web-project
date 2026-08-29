import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Layout.css';

function Layout({ children }) {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('token');

    // Khai báo state lưu tên hiển thị của người dùng
    const [displayName, setDisplayName] = useState('User');

    // Thêm state lưu danh sách chuyên khoa
    const [specialties, setSpecialties] = useState([]);

    // Lấy tên người dùng từ localStorage khi load trang
    useEffect(() => {
        const storedName = localStorage.getItem('username');
        if (storedName) {
            setDisplayName(storedName);
        }
    }, []);

    // Tự động gọi API lấy danh sách chuyên khoa khi load trang
    useEffect(() => {
        // Tự động lấy URL tùy theo môi trường Local hoặc Render
        const apiUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:8080'
            : 'https://hopital-web-project.onrender.com';

        // Lấy danh sách bác sĩ để lọc ra các chuyên khoa
        fetch(`${apiUrl}/api/doctors`)
            .then(res => res.json())
            .then(data => {
                if (Array.isArray(data)) {
                    // Lọc ra danh sách chuyên khoa không bị trùng lặp
                    const uniqueSpecs = [...new Set(data.map(doc => doc.speciality).filter(Boolean))];
                    setSpecialties(uniqueSpecs);
                }
            })
            .catch(err => console.error("Lỗi tải chuyên khoa:", err));
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('username'); // Xóa luôn tên khi đăng xuất
        navigate('/login');
    };

    return (
        <div className="app-layout">
            <div className="main-wrapper">

                {/* 1. THANH THÔNG TIN PHÍA TRÊN (Địa chỉ, Giờ làm việc, Hotline) */}
                <div className="top-info-bar">
                    <span>📍 Địa chỉ: Số 3, Tăng Bạt Hổ, P12, Q5, TP.HCM</span>
                    <span>⏰ Làm việc: 06h00 - 15h00 ( Chủ Nhật 06h00 - 12h00 )</span>
                    <span>📞 HOTLINE: 02871020303</span>
                </div>

                {/* Header (Navbar ngang chính) */}
                <header className="top-header">
                    <div className="header-logo">
                        <h2>🏥 SIS Hospital</h2>
                    </div>

                    <div className="header-search">
                        <input type="text" placeholder="Tìm kiếm bác sĩ, dịch vụ..." />
                    </div>

                    <nav className="header-nav">
                        <Link to="/" className="nav-item">Trang Chủ</Link>
                        <Link to="/book-appointment" className="nav-item">Đặt Lịch Khám</Link>
                        <Link to="/appointments" className="nav-item">Danh Sách Lịch Hẹn</Link>
                        <div className="nav-dropdown">
                            <Link to="/doctors" className="nav-item">Đội Ngũ Bác Sĩ ▾</Link>
                            <div className="dropdown-content">
                                {specialties.length > 0 ? (
                                    specialties.map((spec, index) => (
                                        <Link key={index} to={`/doctors?specialty=${encodeURIComponent(spec)}`}>
                                            {spec}
                                        </Link>
                                    ))
                                ) : (
                                    <span className="dropdown-empty">Đang tải...</span>
                                )}
                            </div>
                        </div>
                        <Link to="/services" className="nav-item">Dịch Vụ Y Tế</Link>
                        {isAuthenticated && <Link to="/admin" className="nav-item admin-link">Quản Trị</Link>}
                    </nav>

                    <div className="header-user">
                        {isAuthenticated ? (
                            <div className="user-info">
                                <span>Xin chào, {displayName}</span>
                                <button onClick={handleLogout} className="btn-logout">Đăng Xuất</button>
                            </div>
                        ) : (
                            <div className="auth-buttons">
                                <Link to="/login" className="btn-login">Đăng Nhập</Link>
                                <Link to="/register" className="btn-register">Đăng Ký</Link>
                            </div>
                        )}
                    </div>
                </header>

                {/* 2. KHUNG BANNER HÌNH ẢNH CHẠY VÀ CHỮ NỔI */}
                <div className="main-banner">
                    {/* Lớp hình ảnh chạy nền */}
                    <div className="banner-slider">
                        <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=1200&auto=format&fit=crop" alt="Bác sĩ 1" />
                        <img src="https://images.pexels.com/photos/3845129/pexels-photo-3845129.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Bác sĩ 2" />
                        <img src="https://images.pexels.com/photos/40568/medical-appointment-doctor-healthcare-40568.jpeg?auto=compress&cs=tinysrgb&w=1200" alt="Bác sĩ 3" />
                        <img src="https://images.unsplash.com/photo-1537368910025-700350fe46c7?q=80&w=1200&auto=format&fit=crop" alt="Bác sĩ 1" />
                    </div>

                    {/* Lớp chữ tĩnh nổi lên trên */}
                    <div className="banner-overlay-content">
                        <h1>Gói khám Tầm soát<br />CHUYÊN KHOA TIÊU HÓA</h1>
                        <p>Chỉ có: <strong>1.880.000đ</strong></p>
                        <span className="banner-hotline">Liên hệ Hotline (028) 7102 0303</span>
                    </div>
                </div>
                {/* Nội dung trang */}
                <main className="page-content">
                    {children}
                </main>

                {/* Footer */}
                <footer className="app-footer">
                    <div className="footer-content">
                        <p>© 2026 Hospital Management System. All rights reserved.</p>
                        <div className="footer-links">
                            <Link to="/terms">Điều khoản</Link>
                            <Link to="/privacy">Bảo mật</Link>
                            <Link to="/contact">Liên hệ hỗ trợ</Link>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default Layout;