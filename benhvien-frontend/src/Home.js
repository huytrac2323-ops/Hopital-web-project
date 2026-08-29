import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

function Home() {
    const [currentImage, setCurrentImage] = useState(0);

    const sliderImages = [
        "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1581594693702-fbdc51b2763b?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1551076805-e1869033e561?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80"
    ];

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

            {/* BÀI VIẾT MỞ RỘNG VỀ BỆNH VIỆN */}
            <section className="about-article">
                <div className="article-content">
                    <span className="article-badge">Về Chúng Tôi</span>
                    <h2>Tự Hào Là Điểm Tựa Sức Khỏe Vững Chắc Cho Cộng Đồng</h2>
                    <p>Thành lập với sứ mệnh "Chăm sóc sức khỏe toàn diện", <strong>SIS Hospital</strong> không ngừng nỗ lực vươn lên trở thành một trong những hệ thống y tế hàng đầu. Chúng tôi hiểu rằng, sức khỏe là tài sản quý giá nhất của mỗi con người. Vì vậy, mọi hoạt động của bệnh viện đều xoay quanh triết lý lấy người bệnh làm trung tâm.</p>
                    <p>Với hệ thống phòng khám đa khoa, chuyên khoa sâu cùng đội ngũ giáo sư, tiến sĩ, bác sĩ đầu ngành, SIS Hospital cam kết mang đến phác đồ điều trị cá thể hóa, tối ưu và an toàn nhất. Việc liên tục cập nhật công nghệ y khoa hiện đại, từ hệ thống chẩn đoán hình ảnh tiên tiến đến phòng mổ vô khuẩn chuẩn quốc tế, giúp chúng tôi đáp ứng được cả những ca bệnh phức tạp nhất.</p>
                    <p>Không gian bệnh viện được thiết kế theo tiêu chuẩn khách sạn cao cấp, mang lại cảm giác thư thái, thân thiện, giúp xua tan áp lực tâm lý khi đi khám chữa bệnh. Khách hàng đến với SIS Hospital không chỉ để chữa bệnh mà còn để phục hồi cả thể chất lẫn tinh thần.</p>

                    <div className="article-stats">
                        <div className="stat-item">
                            <strong>15+</strong>
                            <span>Năm Kinh Nghiệm</span>
                        </div>
                        <div className="stat-item">
                            <strong>500+</strong>
                            <span>Y Bác Sĩ</span>
                        </div>
                        <div className="stat-item">
                            <strong>1M+</strong>
                            <span>Khách Hàng</span>
                        </div>
                    </div>
                </div>
                <div className="article-image">
                    <img src="https://images.unsplash.com/photo-1516549655169-df83a0774514?ixlib=rb-1.2.1&auto=format&fit=crop&w=1000&q=80" alt="Đội ngũ y tế chuyên nghiệp" />
                </div>
            </section>
        </div>
    );
}

export default Home;