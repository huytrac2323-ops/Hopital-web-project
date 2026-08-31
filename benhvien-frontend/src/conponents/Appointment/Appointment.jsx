import React, {useEffect, useState} from 'react';
import './AppointmentForm.css'; // File CSS tự tạo thêm để làm đẹp form
import { getAuthHeaders } from '../../utils/auth';


const API_URL = window.location.hostname === 'localhost'
    ? 'http://localhost:8080/api'
    : 'https://hopital-web-project.onrender.com/apii';

function AppointmentForm() {
    const [formData, setFormData] = useState({
        fullName: '',
        phone: '',
        identityNumber: '', // CCCD hoặc BHYT
        symptoms: '',
        doctorId: ''
    });

    const [errors, setErrors] = useState({});
    const [patientStatus, setPatientStatus] = useState(null); // 'NEW' hoặc 'EXISTING'
    const [isLoading, setIsLoading] = useState(false);
    const [doctors, setDoctors] = useState([]);
    const [appointmentDate, setAppointmentDate] = useState('');

    // Xử lý thay đổi dữ liệu trong form
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (errors[name]) {
            setErrors({ ...errors, [name]: '' });
        }
    };

    // Kiểm tra bệnh nhân cũ/mới khi rời chuột khỏi ô CCCD (onBlur)
    const handleCheckIdentity = async () => {
        if (!formData.identityNumber || formData.identityNumber.length < 9) return;

        setIsLoading(true);
        try {
            const response = await fetch(`${API_URL}/patients/check?cccd=${formData.identityNumber}`, {
                method: 'GET',
                headers: getAuthHeaders()
            });

            if (response.ok) {
                const data = await response.json();
                if (data.exists) {
                    setPatientStatus('EXISTING');
                    setFormData(prev => ({
                        ...prev,
                        fullName: data.fullName,
                        phone: data.phone
                    }));
                } else {
                    setPatientStatus('NEW');
                }
            } else if (response.status === 401) {
                alert("Phiên đăng nhập đã hết hạn, vui lòng đăng nhập lại!");
            }
        } catch (error) {
            console.error("Lỗi khi kiểm tra CCCD:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Hàm Validate dữ liệu trước khi gửi
    const validateForm = () => {
        let newErrors = {};
        const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
        const cccdRegex = /^[0-9]{9,12}$/;

        if (!formData.fullName.trim()) newErrors.fullName = "Vui lòng nhập họ và tên";
        if (!phoneRegex.test(formData.phone)) newErrors.phone = "Số điện thoại không hợp lệ";
        if (!cccdRegex.test(formData.identityNumber)) newErrors.identityNumber = "CCCD/BHYT phải từ 9-12 số";
        if (!formData.symptoms.trim()) newErrors.symptoms = "Vui lòng mô tả triệu chứng";
        if (!formData.doctorId) newErrors.doctorId = "Vui lòng chọn bác sĩ khám";

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Xử lý Gửi Form
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (validateForm()) {
            try {
                const response = await fetch(`${API_URL}/appointments`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        ...getAuthHeaders()
                    },
                    body: JSON.stringify({ ...formData, appointmentDate })
                });

                if (response.ok) {
                    alert("Đặt lịch thành công!");
                    setFormData({ fullName: '', phone: '', identityNumber: '', symptoms: '', doctorId: '' });
                    setAppointmentDate('');
                } else {
                    const errData = await response.text();
                    alert("Đặt lịch thất bại: " + errData);
                }
            } catch (error) {
                console.error("Lỗi hệ thống khi gửi lịch:", error);
            }
        }
    };

    // Lấy danh sách bác sĩ
    useEffect(() => {
        fetch(`${API_URL}/doctors`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                ...getAuthHeaders()
            }
        })
            .then(async res => {
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(text || 'Lỗi tải danh sách bác sĩ');
                }
                return res.json();
            })
            .then(data => {
                if (Array.isArray(data)) {
                    setDoctors(data);
                }
            })
            .catch(err => console.error("Lỗi tải danh sách bác sĩ:", err.message));
    }, []);

    return (
        <div className="booking-container">
            <h2>📝 Đăng Ký Lịch Khám</h2>
            <form onSubmit={handleSubmit} className="booking-form">

                <div className="form-group">
                    <label>Chọn Bác Sĩ Khám (*)</label>
                    <select
                        name="doctorId"
                        value={formData.doctorId}
                        onChange={handleChange}
                    >
                        <option value="">-- Chọn bác sĩ phụ trách --</option>
                        {doctors.map(doc => (
                            <option key={doc.id || doc.user_id} value={doc.id || doc.user_id}>
                                {doc.name || doc.username} {doc.speciality ? `(${doc.speciality})` : ''}
                            </option>
                        ))}
                    </select>

                    <label style={{ display: 'block', margin: '12px 0 8px 0', color: '#cbd5e1' }}>
                        Thời Gian Khám (*)
                    </label>
                    <input
                        type="datetime-local"
                        value={appointmentDate}
                        onChange={(e) => setAppointmentDate(e.target.value)}
                        required
                        style={{
                            width: '100%',
                            padding: '10px',
                            borderRadius: '6px',
                            backgroundColor: '#2a2a2a',
                            color: 'white',
                            border: '1px solid #444',
                            outline: 'none'
                        }}
                    />
                    {errors.doctorId && <small className="error-text">{errors.doctorId}</small>}

                    <label style={{ marginTop: '12px', display: 'block' }}>Số CCCD / BHYT (*)</label>
                    <input
                        type="text"
                        name="identityNumber"
                        value={formData.identityNumber}
                        onChange={handleChange}
                        onBlur={handleCheckIdentity}
                        placeholder="Nhập số CCCD hoặc Mã BHYT"
                    />
                    {isLoading && <small className="text-info">Đang kiểm tra hồ sơ...</small>}
                    {errors.identityNumber && <small className="error-text">{errors.identityNumber}</small>}
                </div>

                {patientStatus === 'EXISTING' && (
                    <div className="status-badge existing">🟢 Đã tìm thấy hồ sơ bệnh nhân cũ</div>
                )}
                {patientStatus === 'NEW' && (
                    <div className="status-badge new">🔵 Hồ sơ bệnh nhân mới</div>
                )}

                <div className="form-group">
                    <label>Họ và Tên (*)</label>
                    <input
                        type="text"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        placeholder="Nguyễn Văn A"
                        disabled={patientStatus === 'EXISTING'}
                    />
                    {errors.fullName && <small className="error-text">{errors.fullName}</small>}
                </div>

                <div className="form-group">
                    <label>Số Điện Thoại (*)</label>
                    <input
                        type="text"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="0901234567"
                        disabled={patientStatus === 'EXISTING'}
                    />
                    {errors.phone && <small className="error-text">{errors.phone}</small>}
                </div>

                <div className="form-group">
                    <label>Mô tả Triệu Chứng (*)</label>
                    <textarea
                        name="symptoms"
                        value={formData.symptoms}
                        onChange={handleChange}
                        rows="4"
                        placeholder="Ví dụ: Đau đầu, sốt cao liên tục 2 ngày..."
                    />
                    {errors.symptoms && <small className="error-text">{errors.symptoms}</small>}
                </div>

                <button type="submit" className="btn-submit">Xác Nhận Đặt Lịch</button>
            </form>
        </div>
    );
}

export default AppointmentForm;