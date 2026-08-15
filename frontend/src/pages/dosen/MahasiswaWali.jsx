import React, { useEffect, useState } from 'react';
import { FiUsers } from 'react-icons/fi';

export default function MahasiswaWali() {
    const [mahasiswa, setMahasiswa] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchMahasiswaWali = async () => {
            try {
                const token = localStorage.getItem('token');

                const response = await fetch(
                    'http://127.0.0.1:8000/api/dosen/mahasiswa-wali',
                    {
                        headers: {
                            Accept: 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(
                        result.message || 'Gagal mengambil data mahasiswa wali.'
                    );
                }

                setMahasiswa(result.data || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchMahasiswaWali();
    }, []);

    return (
        <div>
            <div className="mb-4">
                <h4 className="fw-bold text-dark">Mahasiswa Wali</h4>
                <p className="text-muted">
                    Daftar mahasiswa yang berada di bawah bimbingan Anda.
                </p>
            </div>

            <div className="card-custom p-4">
                <div className="d-flex align-items-center mb-4">
                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-3">
                        <FiUsers className="fs-4" />
                    </div>

                    <div>
                        <h5 className="fw-bold mb-1">Daftar Mahasiswa Wali</h5>
                        <p className="text-muted mb-0 small">
                            Mahasiswa yang ditugaskan kepada Anda sebagai dosen wali.
                        </p>
                    </div>
                </div>

                {loading && (
                    <p className="text-muted">
                        Memuat data mahasiswa...
                    </p>
                )}

                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {!loading && !error && mahasiswa.length === 0 && (
                    <div className="text-center py-4">
                        <p className="text-muted mb-0">
                            Belum ada mahasiswa yang menjadi mahasiswa wali Anda.
                        </p>
                    </div>
                )}

                {!loading && !error && mahasiswa.length > 0 && (
                    <div className="table-responsive">
                        <table className="table table-hover align-middle">
                            <thead>
                                <tr>
                                    <th>No</th>
                                    <th>NIM</th>
                                    <th>Nama</th>
                                    <th>Program Studi</th>
                                    <th>Angkatan</th>
                                </tr>
                            </thead>

                            <tbody>
                                {mahasiswa.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{index + 1}</td>
                                        <td>{item.nim}</td>
                                        <td>{item.nama}</td>
                                        <td>{item.prodi}</td>
                                        <td>{item.angkatan}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}