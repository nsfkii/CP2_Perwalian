import React, { useState } from 'react';

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

    // Untuk buka/tutup password
    const [showPassword, setShowPassword] = useState(false);

    const { login } = useAuth();

    const navigate = useNavigate();

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

                // Redirect berdasarkan role
                if (res.data.user.role === 'admin') {
                    navigate('/admin/dashboard');
                } else if (res.data.user.role === 'dosen') {
                    navigate('/dosen/dashboard');
                } else {
                    navigate('/mahasiswa/dashboard');
                }
            }

        } catch (error) {

            toast.error(
                error.response?.data?.message ||
                'Terjadi kesalahan pada server'
            );

        } finally {

            setIsLoading(false);

        }
    };

    return (

        <div
            className="min-vh-100 d-flex justify-content-center align-items-center"
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


                        {/* TOMBOL MATA */}
                        <button
                            type="button"
                            onClick={() =>
                                setShowPassword(
                                    !showPassword
                                )
                            }
                            className="position-absolute border-0 bg-transparent p-0"
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
                        className="btn btn-primary-custom w-100 text-white"
                        disabled={isLoading}
                    >

                        {isLoading ? (

                            <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                                aria-hidden="true"
                            ></span>

                        ) : null}

                        {isLoading
                            ? 'Memproses...'
                            : 'Sign In'}

                    </button>

                </form>

            </div>

        </div>
    );
}