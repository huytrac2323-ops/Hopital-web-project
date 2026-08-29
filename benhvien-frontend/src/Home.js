import React, { useState, useEffect } from 'react'; // Bắt buộc phải có dòng này
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    // 1. Khai báo state BÊN TRONG hàm Home
    const [currentImage, setCurrentImage] = useState(0);

    // 2. Danh sách ảnh
    const sliderImages = [
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    ];

    // 3. Khai báo useEffect BÊN TRONG hàm Home
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentImage((prevIndex) => (prevIndex + 1) % sliderImages.length);
        }, 4000);
        return () => clearInterval(timer);
    }, [sliderImages.length]);



    return (
        <div className="home-wrapper">
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
                        <Link to="/book-appointment" className="btn btn-primary">
                            📅 Đặt Lịch Hẹn Ngay
                        </Link>
                        {/* Thêm nút Outline cho cân đối bố cục */}
                        <Link to="/services" className="btn btn-outline">
                            🩺 Tìm Hiểu Dịch Vụ
                        </Link>
                    </div>
                </div>

                <div className="hero-image">
                    <div className="hero-slider">
                        {sliderImages.map((img, index) => (
                            <img
                                key={index}
                                src={img}
                                alt={`SIS Hospital ${index}`}
                                className={`slider-image ${index === currentImage ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* Bổ sung tiêu đề cho khu vực tính năng */}
            <div className="features-header">
                <h2>Vì Sao Chọn SIS Hospital?</h2>
                <p>Chúng tôi mang đến dịch vụ y tế chuẩn quốc tế</p>
            </div>

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