import React, { useState } from 'react';
import API from '../services/api';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false); // حالة التحميل لتعطيل الزرار أثناء الطلب
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
    
        try {
            const res = await API.post('/auth/signin', 
                { email, password }, 
                { headers: { 'Accept': 'application/json' } }
            );
    
            // سطر لمساعدتك في الـ Console لمعرفة البيانات القادمة من السيرفر بالتفصيل
            console.log("بيانات السيرفر المرتجعة:", res.data);
    
            if (res.data.token) {
                // 1. حفظ التوكن في الـ LocalStorage
                localStorage.setItem('token', res.data.token);
                
                // 2. حفظ بيانات المستخدم
                if (res.data.user) {
                    localStorage.setItem('username', res.data.user.username || "موظف ذكي");
                    
                    // 🔥 التعديل الذكي هنا: إذا كان res.data.user.email غير موجود (undefined)، خذ الـ email المتواجد في الـ state
                    localStorage.setItem('userEmail', res.data.user.email || email);
                } else {
                    // خطة بديلة تانية: لو السيرفر بعت التوكن بدون كائن user أصلاً
                    localStorage.setItem('username', email.split('@')[0]); // استخدام الجزء الأول من الإيميل كاسم
                    localStorage.setItem('userEmail', email);
                }
    
                // 3. توجيه الموظف لصفحة الحضور
                navigate('/attendance');
            }
        } catch (err) {
            console.error("Login Error:", err.response?.data);
            alert(err.response?.data?.message || "Invalid Email or Password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container d-flex align-items-center justify-content-center vh-100" dir="ltr">
            <div className="card p-4 shadow-lg border-0" style={{ width: '400px', borderRadius: '15px' }}>
                <div className="text-center mb-4">
                    <i className="bi bi-printer-fill text-primary" style={{ fontSize: '3rem' }}></i>
                    <h3 className="fw-bold mt-2">Smart Printer</h3>
                    <p className="text-muted">Employee Portal Login</p>
                </div>

                <form onSubmit={handleLogin}>
                    <div className="mb-3">
                        <label className="form-label">Email Address</label>
                        <input 
                            type="email" 
                            className="form-control form-control-lg" 
                            placeholder="name@company.com" 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                        />
                    </div>

                    <div className="mb-4">
                        <label className="form-label">Password</label>
                        <input 
                            type="password" 
                            className="form-control form-control-lg" 
                            placeholder="••••••••" 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button 
                        type="submit" 
                        className="btn btn-primary btn-lg w-100 shadow-sm" 
                        disabled={loading}
                    >
                        {loading ? (
                            <span className="spinner-border spinner-border-sm me-2"></span>
                        ) : (
                            'Sign In'
                        )}
                    </button>
                </form>

                <div className="text-center mt-4 text-muted small">
                    Forgot your password? Contact Admin.
                </div>
            </div>
        </div>
    );
};

export default Login;