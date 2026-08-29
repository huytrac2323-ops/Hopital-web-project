import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './Home'; // Đã xóa dòng import Home bị trùng lặp
import DoctorList from './conponents/DoctorList/DoctorList';
import AppointmentList from './conponents/AppoimentList/AppointmentList';
import Appointment from "./conponents/Appointment/Appointment";
import Login from './conponents/LoginForm/Login';
import Register from './conponents/Register/Register';
import AdminPage from './conponents/AdminPage';
import Layout from './conponents/Layout'; // Import component Layout mới
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  return (
      <Router>
        <div className="App">
          {/* Bọc toàn bộ Routes bên trong Layout */}
          {/* Đã xóa hoàn toàn thẻ <nav> và <main> cũ */}
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/appointments" element={<AppointmentList />} />
              <Route path="/book-appointment" element={<Appointment />} />
              <Route path="/login" element={<Login onLoginSuccess={handleLoginSuccess} />} />
              <Route path="/register" element={<Register />} />
              <Route path="/doctors" element={<DoctorList />} />
              <Route path="/admin" element={<AdminPage />} /></Routes>
            
          </Layout>
        </div>
      </Router>
  );
}

export default App;