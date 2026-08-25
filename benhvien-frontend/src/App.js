import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Home from './Home'; // Import trang chủ mới
import DoctorList from './conponents/DoctorList/DoctorList';
import AppointmentList from './conponents/AppoimentList/AppointmentList';
import Login from './conponents/LoginForm/Login';
import Register from './conponents/Register/Register';
import './App.css';
import AdminPage from './conponents/AdminPage'; // Import trang vừa tạo

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token); // Set isLoggedIn to true if token exists, false otherwise
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); // Xóa token khỏi localStorage
    setIsLoggedIn(false); // Cập nhật trạng thái đăng nhập
    window.location.href = '/login'; // Điều hướng về trang đăng nhập
  };

  return (
    <Router>
      <div className="App">
        <nav className="navbar">
          <div className="nav-brand">
            <Link to="/">Bệnh Viện</Link>
          </div>
          <ul className="nav-links">
            <li>
              <Link to="/">Trang Chủ</Link>
            </li>
            <li>
              <Link to="/appointments">Đặt Lịch</Link>
            </li>
            {isLoggedIn ? (
              <>
                <li>
                  <Link to="/doctors">Bác Sĩ</Link>
                </li>
                <li>
                  <a href="#" onClick={handleLogout}>Đăng Xuất</a>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/login">Đăng Nhập</Link>
                </li>
                <li>
                  <Link to="/register">Đăng Ký</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        <main className="container">
          <Routes>
            {/* Route mặc định bây giờ là trang chủ */}
            <Route path="/" element={<Home />} />

            {/* Các route khác */}
            <Route path="/appointments" element={<AppointmentList />} />
            <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />
            
            {/* Các route được bảo vệ (cần logic bảo vệ trong thực tế) */}
            <Route path="/doctors" element={<DoctorList />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
      </div>
    </Router>


  );

}

export default App;