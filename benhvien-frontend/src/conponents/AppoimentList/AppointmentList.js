import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AppointmentList.css';
import { getAuthHeaders } from '../../utils/auth';

function AppointmentList() {
    const [appointments, setAppointments] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        fetchAppointments(signal);

        return () => {
            abortController.abort();
        };
    }, [navigate]);

    const fetchAppointments = (signal) => {
        const apiUrl = window.location.hostname === 'localhost'
            ? 'http://localhost:8080'
            : 'https://hopital-web-project.onrender.com';

        fetch(`${apiUrl}/api/appointments`, {
            headers: getAuthHeaders(), // Bắt buộc phải có token này để phân quyền
            signal
        })
            .then(response => {
                if (response.status === 401) {
                    navigate('/login');
                    return Promise.reject(new Error('Unauthorized'));
                }
                return response.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setAppointments(data);
                }
            })
            .catch(error => {
                if (error.name !== 'AbortError') {
                    console.error("Error fetching appointments:", error);
                }
            });
    };    return (
        <div className="appointment-container">
            <div className="appointment-list">
                <h1>Danh Sách Lịch Hẹn</h1>
                {appointments.length === 0 ? (<p>Chưa có lịch hẹn nào.</p>) : (
                    <div className="appointment-grid">
                        {Array.isArray(appointments) && appointments.map(app => (
                            <div key={app.id} className="appointment-card">
                                <p><strong>Bệnh nhân:</strong> {app.patientName}</p>
                                <p><strong>Bác sĩ:</strong> {app.doctorName} ({app.doctorSpeciality})</p>
                                <p><strong>Thời gian:</strong> {new Date(app.appointmentDate).toLocaleString('vi-VN')}</p>
                                <p><strong>Lý do:</strong> {app.reason}</p>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default AppointmentList;