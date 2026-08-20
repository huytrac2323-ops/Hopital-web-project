import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Register.css'; // Import file CSS

function Register() {
    // State cho thông tin đăng nhập
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // State cho thông báo
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        setMessage('');

        const registrationData = {
            username,
            email,
            password
        };

        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(registrationData),
            });

            if (response.ok) {
                setIsSuccess(true);
                setMessage('Đăng ký thành công! Đang chuyển hướng đến Đăng nhập...');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                const errorText = await response.text();
                setIsSuccess(false);
                setMessage(`Đăng ký thất bại: ${errorText}`);
            }
        } catch (error) {
            setIsSuccess(false);
            setMessage(`Lỗi kết nối: ${error.message}`);
        }
    };

    return (
        <div className="register-wrapper">
            <div className="register-container">
                <div className="register-header">
                    <h2>Tạo Tài Khoản Mới</h2>
                    <p>Vui lòng điền đầy đủ thông tin bên dưới</p>
                </div>

                <form className="register-form" onSubmit={handleRegister}>
                    {message && (
                        <div className={`message ${isSuccess ? 'success-message' : 'error-message'}`}>
                            {isSuccess ? '✅' : '⚠️'} {message}
                        </div>
                    )}

                    <div className="form-group">
                        <label>Tên đăng nhập</label>
                        <input type="text" placeholder="Nhập tên đăng nhập..." value={username} onChange={(e) => setUsername(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input type="email" placeholder="Nhập địa chỉ email..." value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>

                    <div className="form-group">
                        <label>Mật khẩu</label>
                        <input type="password" placeholder="Tạo mật khẩu..." value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div>

                    <button type="submit" className="register-button">Đăng Ký</button>

                    <div className="register-footer">
                        <p>Đã có tài khoản? <Link to="/login" className="login-link">Đăng nhập ngay</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;