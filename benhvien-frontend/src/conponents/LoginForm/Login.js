import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Login.css';

function Login({ onLoginSuccess }) {
    const [usernameOrEmail, setUsernameOrEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();
        setError('');

        fetch('https://hopital-web-project.onrender.com/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ usernameOrEmail, password })
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Tên đăng nhập hoặc mật khẩu không đúng.');
                }
                return response.json();
            })
            .then(data => {
                if (data && data.accessToken) {
                    localStorage.setItem('token', data.accessToken);
                    console.log('Login successful');
                    if (onLoginSuccess) {
                        onLoginSuccess();
                    }
                    navigate('/appointments');
                } else {
                    throw new Error('Không nhận được token xác thực từ server.');
                }
            })
            .catch(error => {
                console.error('Login request error:', error);
                setError(error.message || 'Đã xảy ra lỗi kết nối. Vui lòng thử lại.');
            });
    };

    return (
        <div className="login-wrapper">
            <div className="login-container">
                {/* Phần Header của Form */}
                <div className="login-header">
                    <h2>Đăng Nhập</h2>
                    <p>Chào mừng bạn quay lại hệ thống</p>
                </div>

                <form className="login-form" onSubmit={handleLogin}>
                    {/* Hiển thị lỗi có style rõ ràng hơn */}
                    {error && <div className="error-message">⚠️ {error}</div>}

                    <div className="form-group">
                        <label htmlFor="username">Tên đăng nhập hoặc Email</label>
                        <input
                            type="text"
                            id="username"
                            placeholder="Nhập tài khoản..."
                            value={usernameOrEmail}
                            onChange={(e) => setUsernameOrEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Nhập mật khẩu..."
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="login-button">Đăng Nhập</button>

                    {/* Phần Footer nhỏ để điều hướng */}
                    <div className="login-footer">
                        <Link to="/" className="back-link">← Quay lại Trang Chủ</Link>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Login;