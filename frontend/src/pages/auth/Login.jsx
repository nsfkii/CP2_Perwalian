import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import api from '../../api/axios';
import {
    FiLock,
    FiMail,
    FiEye,
    FiEyeOff
} from 'react-icons/fi';

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [redirectTo, setRedirectTo] = useState(null);
    const { login } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (redirectTo) {
            navigate(redirectTo);
        }
    }, [redirectTo, navigate]);

    const onSubmit = async (data) => {
        setIsLoading(true);

        try {
            const res = await api.post('/login', data);

            if (res.data.success) {
                toast.success(res.data.message);

                login(
                    res.data.access_token,
                    res.data.user
                );

                await new Promise(resolve => setTimeout(resolve, 500));

                if (res.data.user.role === 'admin') {
                    setRedirectTo('/admin/dashboard');
                } else if (res.data.user.role === 'dosen') {
                    setRedirectTo('/dosen/dashboard');
                } else {
                    setRedirectTo('/mahasiswa/dashboard');
                }
            }

        } catch (error) {
            toast.error(
                error.response?.data?.message ||
                'Terjadi kesalahan pada server'
            );
            setIsLoading(false);
        }
    };

    return (
        <div
            className="min-vh-100 d-flex justify-content-center align-items-center position-relative"
            style={{
                backgroundColor: 'var(--bg-color)'
            }}
        >
            <div
                className="card-custom p-5 w-100"
                style={{
                    maxWidth: '420px'
                }}
            >
                <div className="text-center mb-4">
                    <h3
                        className="fw-bold"
                        style={{
                            color: 'var(--primary-color)'
                        }}
                    >
                        Sistem Perwalian
                    </h3>
                    <p className="text-muted small">
                        STMIK Bandung
                    </p>
                    <img
                        src="/logo.png"
                        alt="Logo STMIK Bandung"
                        style={{
                            width: '150px',
                            height: '150px',
                            objectFit: 'contain'
                        }}
                    />
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    {/* EMAIL */}
                    <div className="form-floating mb-3">
                        <input
                            type="email"
                            disabled={isLoading}
                            className={`form-control ${
                                errors.email
                                    ? 'is-invalid'
                                    : ''
                            }`}
                            id="floatingEmail"
                            placeholder="name@example.com"
                            {...register('email', {
                                required:
                                    'Email wajib diisi'
                            })}
                        />
                        <label htmlFor="floatingEmail">
                            <FiMail className="me-2" />
                            Email address
                        </label>
                        {errors.email && (
                            <div className="invalid-feedback">
                                {errors.email.message}
                            </div>
                        )}
                    </div>

                    {/* PASSWORD */}
                    <div className="form-floating mb-4 position-relative">
                        <input
                            type={
                                showPassword
                                    ? 'text'
                                    : 'password'
                            }
                            disabled={isLoading}
                            className={`form-control pe-5 ${
                                errors.password
                                    ? 'is-invalid'
                                    : ''
                            }`}
                            id="floatingPassword"
                            placeholder="Password"
                            {...register('password', {
                                required:
                                    'Password wajib diisi'
                            })}
                        />
                        <label htmlFor="floatingPassword">
                            <FiLock className="me-2" />
                            Password
                        </label>

                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                            className="position-absolute border-0 bg-transparent p-0"
                            disabled={isLoading}
                            style={{
                                right: '15px',
                                top: '50%',
                                transform:
                                    'translateY(-50%)',
                                zIndex: 5,
                                color: '#6c757d',
                                cursor: 'pointer'
                            }}
                            aria-label={
                                showPassword
                                    ? 'Sembunyikan password'
                                    : 'Tampilkan password'
                            }
                        >
                            {showPassword ? (
                                <FiEyeOff size={19} />
                            ) : (
                                <FiEye size={19} />
                            )}
                        </button>

                        {errors.password && (
                            <div className="invalid-feedback">
                                {errors.password.message}
                            </div>
                        )}
                    </div>

                    {/* LOGIN BUTTON */}
                    <button
                        type="submit"
                        className={`btn btn-primary-custom login-submit-btn w-100 text-white ${
                            isLoading ? 'is-loading' : ''
                        }`}
                        disabled={isLoading}
                        style={{
                            minHeight: '52px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center', 
                            fontSize: '16px',
                            fontWeight: '600',
                            position: 'relative',
                            backgroundColor: isLoading ? '#1a56db' : 'var(--primary-color)',
                            border: 'none',
                            padding: '0 20px'
                        }}
                    >
                        {isLoading ? (
                            <>
                                {/*  SPINNER WARNA BIRU MUDA / PUTIH */}
                                <div 
                                    className="spinner-border" 
                                    role="status"
                                    style={{
                                        width: '1.6rem',
                                        height: '1.6rem',
                                        borderWidth: '0.25em',
                                        animationDuration: '0.8s',
                                        //  WARNA BIRU MUDA / BIRU TERANG
                                        color: '#60A5FA',
                                        borderColor: '#60A5FA',
                                        borderRightColor: 'transparent'
                                    }}
                                >
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </>
                        ) : (
                            'Sign In'
                        )}
                    </button>

                    {/* Status Loading */}
                    {isLoading && (
                        <div style={{ 
                            marginTop: '12px', 
                            fontSize: '13px', 
                            color: '#2563EB',
                            textAlign: 'center',
                            fontWeight: '500',
                            animation: 'pulse 1.5s ease-in-out infinite'
                        }}>
                        </div>
                    )}
                </form>
            </div>

            <style>{`
                @keyframes pulse {
                    0%, 100% { opacity: 1; }
                    50% { opacity: 0.5; }
                }
            `}</style>
        </div>
    );
}