import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Home.css';

function Home() {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('token');

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="home-wrapper">
            {/* Khu vực Hero (Giới thiệu chính) */}
            <section className="hero-section">
                <div className="hero-content">
                    <h1>
                        Chăm Sóc Sức Khỏe <br/>
                        <span className="highlight">Toàn Diện & Tận Tâm</span>
                    </h1>
                    <p>
                        Đồng hành cùng sức khỏe của bạn với đội ngũ y bác sĩ hàng đầu và trang thiết bị hiện đại nhất. Đặt lịch khám trực tuyến nhanh chóng, tiện lợi.
                    </p>
                    <div className="hero-actions">
                        <Link to="/appointments" className="btn btn-primary">
                            📅 Đặt Lịch Hẹn Ngay
                        </Link>
                        {isAuthenticated ? (
                            <button onClick={handleLogout} className="btn btn-outline">
                                Đăng Xuất
                            </button>
                        ) : (
                            <Link to="/login" className="btn btn-outline">
                                Đăng Nhập
                            </Link>
                        )}
                    </div>
                </div>

                {/* Khu vực Ảnh minh họa */}
                <div className="hero-image">
                    {/* Bạn có thể thay thẻ div này bằng thẻ <img src="..." alt="Hospital" /> thực tế */}
                    <div className="image-placeholder"></div>
                </div>
            </section>

            {/* Khu vực Các tính năng/Dịch vụ nổi bật */}
            <section className="features-section">
                <div className="feature-card">
                    <div className="feature-icon">👨‍⚕️</div>
                    <h3>Đội Ngũ Chuyên Gia</h3>
                    <p>Y bác sĩ giàu kinh nghiệm, tận tâm với nghề và luôn đặt bệnh nhân lên hàng đầu.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">🏥</div>
                    <h3>Cơ Sở Hiện Đại</h3>
                    <p>Hệ thống trang thiết bị y tế tiên tiến, đạt chuẩn quốc tế, mang lại kết quả chính xác.</p>
                </div>
                <div className="feature-card">
                    <div className="feature-icon">⏱️</div>
                    <h3>Hỗ Trợ 24/7</h3>
                    <p>Hệ thống đặt lịch trực tuyến hoạt động liên tục, luôn sẵn sàng phục vụ bạn mọi lúc.</p>
                </div>
            </section>
        </div>
    );
}

export default Home;