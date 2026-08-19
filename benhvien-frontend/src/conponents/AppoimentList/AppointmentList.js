import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AppointmentList.module.css'; // CSS riêng cho component này
import { getAuthHeaders } from '../../utils/auth'; // Import a helper to get auth headers

function AppointmentList() {
    // State for the list of appointments
    const [appointments, setAppointments] = useState([]);
    // State for the list of doctors to populate the dropdown
    const [doctors, setDoctors] = useState([]);

    // State for the form fields
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [appointmentDate, setAppointmentDate] = useState('');
    const [reason, setReason] = useState('');

    const navigate = useNavigate();

    // Load doctor and appointment data when the component mounts
    useEffect(() => {
        const abortController = new AbortController();
        const signal = abortController.signal;

        // Fetch doctors
        fetch('http://localhost:8080/api/doctors', { headers: getAuthHeaders(), signal })
            .then(response => {
                if (response.status === 401) {
                    navigate('/login');
                    return Promise.reject(new Error('Unauthorized'));
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    setDoctors(data);
                }
            })
            .catch(error => {
                if (error.name !== 'AbortError') {
                    console.error("Error fetching doctors:", error);
                }
            });

        // Fetch existing appointments
        fetchAppointments(signal);

        // Cleanup function to abort fetch on unmount
        return () => {
            abortController.abort();
        };
    }, [navigate]);

    const fetchAppointments = (signal) => {
        fetch('http://localhost:8080/api/appointments', { headers: getAuthHeaders(), signal })
            .then(response => {
                if (response.status === 401) {
                    navigate('/login');
                    return Promise.reject(new Error('Unauthorized'));
                }
                return response.json();
            })
            .then(data => {
                if (data) {
                    setAppointments(data);
                }
            })
            .catch(error => {
                if (error.name !== 'AbortError') {
                    console.error("Error fetching appointments:", error);
                }
            });
    };

    // Handler for form submission
    const handleSubmit = (event) => {
        event.preventDefault();
        if (!selectedDoctor || !appointmentDate) {
            alert("Vui lòng điền đầy đủ thông tin bắt buộc.");
            return;
        }

        const newAppointmentRequest = {
            doctorId: parseInt(selectedDoctor),
            appointmentDate: appointmentDate,
            reason: reason,
        };

        fetch('http://localhost:8080/api/appointments', {
            method: 'POST',
            headers: getAuthHeaders(), // Use authenticated headers
            body: JSON.stringify(newAppointmentRequest),
        })
        .then(response => {
            if (response.status === 401) {
                navigate('/login');
                return Promise.reject(new Error('Unauthorized'));
            }
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (data) {
                console.log('Appointment created:', data);
                // Refresh the appointment list after a successful creation
                fetchAppointments();
            }
        })
        .catch(error => {
            if (error.name !== 'AbortError') {
                console.error("Error creating appointment:", error);
            }
        });

        // Reset form after submission
        setSelectedDoctor('');
        setAppointmentDate('');
        setReason('');
    };

    return (
        <div className="appointment-container">
            {/* Appointment booking form */}
            <div className="appointment-form-card">
                <h1>Đặt Lịch Hẹn Mới</h1>
                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Chọn Bác Sĩ:</label>
                        <select value={selectedDoctor} onChange={e => setSelectedDoctor(e.target.value)} required>
                            <option value="">-- Chọn bác sĩ --</option>
                            {Array.isArray(doctors) && doctors.map(d => (
                                <option key={d.id} value={d.id}>{d.name} ({d.speciality})</option>
                            ))}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Ngày & Giờ Hẹn:</label>
                        <input type="datetime-local" value={appointmentDate} onChange={e => setAppointmentDate(e.target.value)} required />
                    </div>
                    <div className="form-group">
                        <label>Lý Do Khám:</label>
                        <textarea value={reason} onChange={e => setReason(e.target.value)} placeholder="Mô tả ngắn gọn triệu chứng..." />
                    </div>
                    <button type="submit" className="submit-btn">Đặt Lịch</button>
                </form>
            </div>

            {/* List of booked appointments */}
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