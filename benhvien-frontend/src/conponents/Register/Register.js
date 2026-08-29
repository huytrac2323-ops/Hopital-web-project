import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // 1. Thêm import này
import '../LoginForm/Login.css'; // Assuming Register will share similar styles
import './Register.css'; // Nhớ import file CSS

function Register() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const navigate = useNavigate(); // 2. Khởi tạo hàm navigate ở đây


    const handleRegister = async (e) => {
        e.preventDefault();

        const userData = { username, email, password };
        const apiUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:8080'
            : 'https://hopital-web-project.onrender.com';
        try {
            const response = await fetch(`${apiUrl}/api/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });

            if (response.ok) {
                alert('Đăng ký thành công!');
                navigate('/login');
            } else {
                alert('Đăng ký thất bại!');
            }
        } catch (error) {
            console.error('Lỗi kết nối:', error);
        }
    };



    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleRegister}>
                <h2>Register</h2>
                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="login-button">Register</button>
            </form>
        </div>
    );
}

export default Register;