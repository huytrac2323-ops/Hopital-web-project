import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [activeTab, setActiveTab] = useState('doctors'); // 'doctors' hoặc 'appointments'

    // State cho Form thêm/sửa Bác sĩ
    const [formData, setFormData] = useState({ id: null, name: '', specialty: '', email: '', phoneNumber: '' });
    const [isEditing, setIsEditing] = useState(false);

    const navigate = useNavigate();
    const [showForm, setShowForm] = useState(false);
    const [editingDoctorId, setEditingDoctorId] = useState(null);
    const [doctorForm, setDoctorForm] = useState({ name: '', speciality: '', phoneNumber: '' });
    const token = localStorage.getItem('token');
    const API_BASE = 'https://hopital-web-project.onrender.com/api';
    useEffect(() => {
        if (!token) {
            navigate('/login');
            return;
        }
        fetchDoctors();
        fetchAppointments();
    }, [token, navigate]);

    // Lấy danh sách bác sĩ
    const fetchDoctors = () => {
        fetch(`${API_BASE}/doctors`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setDoctors(data))
            .catch(err => console.error("Lỗi lấy danh sách bác sĩ:", err));
    };

    // Lấy danh sách lịch hẹn
    const fetchAppointments = () => {
        fetch(`${API_BASE}/appointments`, {
            headers: { 'Authorization': `Bearer ${token}` }
        })
            .then(res => res.json())
            .then(data => setAppointments(data))
            .catch(err => console.error("Lỗi lấy danh sách lịch hẹn:", err));
    };

    // Thêm hoặc Cập nhật Bác sĩ
    const handleSaveDoctor = async (e) => {
        e.preventDefault();
        const method = editingDoctorId ? 'PUT' : 'POST';
        const url = editingDoctorId ? `${API_BASE}/doctors/${editingDoctorId}` : `${API_BASE}/doctors`;

        await fetch(url, {
            method: method,
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(doctorForm)
        });
        alert('Lưu bác sĩ thành công!');
        setShowForm(false);
        setActiveTab(''); setTimeout(() => setActiveTab('doctors'), 0); // Mẹo nhỏ để reload lại danh sách
    };

    // Hàm Xóa Bác sĩ
    const handleDeleteDoctor = async (id) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa bác sĩ này?')) return;
        await fetch(`${API_BASE}/doctors/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
        });
        setActiveTab(''); setTimeout(() => setActiveTab('doctors'), 0);
    };

    // Hàm mở Form điền sẵn dữ liệu để Sửa
    const handleEditClick = (doc) => {
        setEditingDoctorId(doc.id);
        setDoctorForm({ name: doc.name, speciality: doc.speciality, phoneNumber: doc.phoneNumber });
        setShowForm(true);
    };

    return (
        <div style={{ padding: '30px', color: 'white', background: '#121212', minHeight: '100vh' }}>
            <h1>🛡️ Trang Quản Trị Hệ Thống (Admin Dashboard)</h1>

            {/* Menu chuyển tab */}
            <div style={{ margin: '20px 0', display: 'flex', gap: '10px' }}>
                <button
                    onClick={() => setActiveTab('doctors')}
                    style={{ padding: '10px 20px', background: activeTab === 'doctors' ? '#007bff' : '#333', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
                    👨‍⚕️ Quản lý Bác sĩ
                </button>
                <button
                    onClick={() => setActiveTab('appointments')}
                    style={{ padding: '10px 20px', background: activeTab === 'appointments' ? '#007bff' : '#333', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
                    📅 Xem Lịch Hẹn
                </button>
                <button
                    onClick={() => navigate('/')}
                    style={{ marginLeft: 'auto', padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '5px' }}>
                    🏠 Về Trang Chủ
                </button>
            </div>

            {/* TAB 1: QUẢN LÝ BÁC SĨ */}
            {activeTab === 'doctors' && (
                <div>
                    <h2>Quản lý danh sách Bác sĩ</h2>

                    {/* Form Thêm / Sửa */}
                    <form onSubmit={handleSaveDoctor} style={{ background: '#1e1e1e', padding: '20px', borderRadius: '8px', marginBottom: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                        <h3>{isEditing ? 'Sửa thông tin Bác sĩ' : 'Thêm Bác sĩ mới'}</h3>
                        <div style={{ gridColumn: 'span 2' }}></div>
                        <input type="text" placeholder="Tên bác sĩ" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required style={{ padding: '10px' }} />
                        <input type="text" placeholder="Chuyên khoa" value={formData.specialty} onChange={e => setFormData({...formData, specialty: e.target.value})} required style={{ padding: '10px' }} />
                        <input type="email" placeholder="Email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required style={{ padding: '10px' }} />
                        <input type="text" placeholder="Số điện thoại" value={formData.phoneNumber} onChange={e => setFormData({...formData, phoneNumber: e.target.value})} required style={{ padding: '10px' }} />
                        <div style={{ gridColumn: 'span 2', display: 'flex', gap: '10px' }}>
                            <button type="submit" style={{ padding: '10px 20px', background: '#28a745', color: 'white', border: 'none', cursor: 'pointer' }}>
                                {isEditing ? 'Cập nhật' : 'Thêm mới'}
                            </button>
                            {isEditing && (
                                <button type="button" onClick={() => { setIsEditing(false); setFormData({ id: null, name: '', specialty: '', email: '', phoneNumber: '' }); }} style={{ padding: '10px 20px', background: '#6c757d', color: 'white', border: 'none', cursor: 'pointer' }}>
                                    Hủy
                                </button>
                            )}
                        </div>
                    </form>

                    {/* Bảng hiển thị Bác sĩ */}
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1e1e1e' }}>
                        <thead>
                        <tr style={{ background: '#333', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>ID</th>
                            <th style={{ padding: '10px' }}>Tên</th>
                            <th style={{ padding: '10px' }}>Chuyên khoa</th>
                            <th style={{ padding: '10px' }}>Email</th>
                            <th style={{ padding: '10px' }}>Số điện thoại</th>
                            <th style={{ padding: '10px' }}>Thao tác</th>
                        </tr>
                        </thead>
                        <tbody>
                        {doctors.map(doc => (
                            <tr key={doc.id} style={{ borderBottom: '1px solid #333' }}>
                                <td style={{ padding: '10px' }}>{doc.id}</td>
                                <td style={{ padding: '10px' }}>{doc.name}</td>
                                <td style={{ padding: '10px' }}>{doc.specialty}</td>
                                <td style={{ padding: '10px' }}>{doc.email}</td>
                                <td style={{ padding: '10px' }}>{doc.phoneNumber}</td>
                                <td style={{ padding: '10px' }}>
                                    <button onClick={() => handleEditClick(doc)} style={{ marginRight: '10px', padding: '5px 10px', background: '#ffc107', border: 'none', cursor: 'pointer' }}>Sửa</button>
                                    <button onClick={() => handleDeleteDoctor(doc.id)} style={{ padding: '5px 10px', background: '#dc3545', color: 'white', border: 'none', cursor: 'pointer' }}>Xóa</button>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* TAB 2: XEM LỊCH HẸN */}
            {activeTab === 'appointments' && (
                <div>
                    <h2>Danh sách Lịch hẹn toàn hệ thống</h2>
                    <table style={{ width: '100%', borderCollapse: 'collapse', background: '#1e1e1e', marginTop: '20px' }}>
                        <thead>
                        <tr style={{ background: '#333', textAlign: 'left' }}>
                            <th style={{ padding: '10px' }}>ID</th>
                            <th style={{ padding: '10px' }}>Bệnh nhân</th>
                            <th style={{ padding: '10px' }}>Bác sĩ khám</th>
                            <th style={{ padding: '10px' }}>Thời gian</th>
                            <th style={{ padding: '10px' }}>Triệu chứng / Ghi chú</th>
                        </tr>
                        </thead>
                        <tbody>
                        {appointments.map(app => (
                            <tr key={app.id} style={{ borderBottom: '1px solid #333' }}>
                                <td style={{ padding: '10px' }}>{app.id}</td>
                                <td style={{ padding: '10px' }}>{app.patientName || app.name || 'N/A'}</td>
                                <td style={{ padding: '10px' }}>{app.doctorName || app.doctor?.name || 'N/A'}</td>
                                <td style={{ padding: '10px' }}>{app.appointmentDate || app.date || 'N/A'}</td>
                                <td style={{ padding: '10px' }}>{app.medicalHistory || app.notes || 'Không có'}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}

export default AdminPage;