import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

function AdminPage() {
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Vui lòng đăng nhập trước!');
            return navigate('/login');
        }

        // Gọi API Admin để kiểm tra quyền
        fetch('https://hopital-web-project.onrender.com/api/admin/dashboard', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Bạn không có quyền truy cập trang này!');
                }
                return response.text();
            })
            .then(data => {
                setMessage(data);
                setLoading(false);
            })
            .catch(err => {
                alert(err.message);
                navigate('/'); // Đá về trang chủ nếu không phải Admin
            });
    }, [navigate]);

    if (loading) return <div style={{ color: 'white', textAlign: 'center', marginTop: '50px' }}>Đang xác thực quyền Admin...</div>;

    return (
        <div style={{ padding: '30px', color: 'white' }}>
            <h1>🛡️ Trang Quản Trị Hệ Thống (Admin Dashboard)</h1>
            <p>{message}</p>
            <div style={{ display: 'flex', gap: '20px', marginTop: '20px' }}>
                <div style={{ background: '#333', padding: '20px', borderRadius: '8px', flex: 1 }}>
                    <h3>Quản lý Bác sĩ</h3>
                    <p>Thêm, sửa, xóa thông tin bác sĩ trong bệnh viện.</p>
                </div>
                <div style={{ background: '#333', padding: '20px', borderRadius: '8px', flex: 1 }}>
                    <h3>Quản lý Lịch hẹn</h3>
                    <p>Xem toàn bộ lịch hẹn khám bệnh của tất cả bệnh nhân.</p>
                </div>
            </div>
        </div>
    );
}

export default AdminPage;