import React, { useEffect, useState } from 'react';
import { FiUsers, FiFileText } from 'react-icons/fi';

export default function MahasiswaWali() {
    const [mahasiswa, setMahasiswa] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // =========================================================
    // STATE HISTORI PERWALIAN
    // =========================================================
    const [showModal, setShowModal] = useState(false);
    const [mahasiswaTerpilih, setMahasiswaTerpilih] = useState(null);
    const [histori, setHistori] = useState([]);
    const [loadingHistori, setLoadingHistori] = useState(false);
    const [errorHistori, setErrorHistori] = useState('');

    // =========================================================
    // AMBIL DATA MAHASISWA WALI
    // =========================================================
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
                        result.message ||
                        'Gagal mengambil data mahasiswa wali.'
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

    // =========================================================
    // LIHAT CATATAN PERWALIAN MAHASISWA
    // =========================================================
    const handleLihatHistori = async (item) => {
        setMahasiswaTerpilih(item);
        setHistori([]);
        setErrorHistori('');
        setShowModal(true);
        setLoadingHistori(true);

        try {
            const token = localStorage.getItem('token');

            const response = await fetch(
                `http://127.0.0.1:8000/api/dosen/mahasiswa-wali/${item.id}/perwalian`,
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
                    result.message ||
                    'Gagal mengambil histori perwalian.'
                );
            }

            setHistori(result.data?.perwalian || []);
        } catch (err) {
            setErrorHistori(err.message);
        } finally {
            setLoadingHistori(false);
        }
    };

    // =========================================================
    // TUTUP MODAL
    // =========================================================
    const handleCloseModal = () => {
        setShowModal(false);
        setMahasiswaTerpilih(null);
        setHistori([]);
        setErrorHistori('');
    };

    // =========================================================
    // RENDER
    // =========================================================
    return (
        <div>

            {/* =================================================
                HEADER
            ================================================= */}
            <div className="mb-4">
                <h4 className="fw-bold text-dark">
                    Mahasiswa Wali
                </h4>

                <p className="text-muted">
                    Daftar mahasiswa yang berada di bawah bimbingan Anda.
                </p>
            </div>

            {/* =================================================
                CARD
            ================================================= */}
            <div className="card-custom p-4">

                <div className="d-flex align-items-center mb-4">

                    <div className="bg-primary bg-opacity-10 p-3 rounded-circle text-primary me-3">
                        <FiUsers className="fs-4" />
                    </div>

                    <div>
                        <h5 className="fw-bold mb-1">
                            Daftar Mahasiswa Wali
                        </h5>

                        <p className="text-muted mb-0 small">
                            Mahasiswa yang ditugaskan kepada Anda sebagai dosen wali.
                        </p>
                    </div>

                </div>

                {/* =================================================
                    LOADING
                ================================================= */}
                {loading && (
                    <p className="text-muted">
                        Memuat data mahasiswa...
                    </p>
                )}

                {/* =================================================
                    ERROR
                ================================================= */}
                {error && (
                    <div className="alert alert-danger">
                        {error}
                    </div>
                )}

                {/* =================================================
                    DATA KOSONG
                ================================================= */}
                {!loading && !error && mahasiswa.length === 0 && (
                    <div className="text-center py-4">

                        <p className="text-muted mb-0">
                            Belum ada mahasiswa yang menjadi mahasiswa wali Anda.
                        </p>

                    </div>
                )}

                {/* =================================================
                    TABEL MAHASISWA
                ================================================= */}
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
                                    <th className="text-center">
                                        Aksi
                                    </th>
                                </tr>
                            </thead>

                            <tbody>

                                {mahasiswa.map((item, index) => (
                                    <tr key={item.id}>

                                        <td>
                                            {index + 1}
                                        </td>

                                        <td>
                                            {item.nim || '-'}
                                        </td>

                                        <td>
                                            {item.nama || '-'}
                                        </td>

                                        <td>
                                            {item.prodi || '-'}
                                        </td>

                                        <td>
                                            {item.angkatan || '-'}
                                        </td>

                                        <td className="text-center">

                                            <button
                                                type="button"
                                                className="btn btn-sm btn-outline-primary"
                                                onClick={() =>
                                                    handleLihatHistori(item)
                                                }
                                            >
                                                <FiFileText className="me-1" />
                                                Catatan Perwalian
                                            </button>

                                        </td>

                                    </tr>
                                ))}

                            </tbody>

                        </table>

                    </div>
                )}

            </div>

            {/* =================================================
                MODAL CATATAN PERWALIAN
            ================================================= */}
            {showModal && (
                <div
                    className="modal fade show d-block"
                    tabIndex="-1"
                    style={{
                        backgroundColor: 'rgba(0, 0, 0, 0.5)'
                    }}
                >

                    <div className="modal-dialog modal-xl modal-dialog-centered">

                        <div className="modal-content">

                            {/* HEADER MODAL */}
                            <div className="modal-header">

                                <div>
                                    <h5 className="modal-title fw-bold">
                                        Catatan Perwalian
                                    </h5>

                                    {mahasiswaTerpilih && (
                                        <small className="text-muted">
                                            {mahasiswaTerpilih.nim} -{' '}
                                            {mahasiswaTerpilih.nama}
                                        </small>
                                    )}
                                </div>

                                <button
                                    type="button"
                                    className="btn-close"
                                    onClick={handleCloseModal}
                                ></button>

                            </div>

                            {/* BODY MODAL */}
                            <div className="modal-body">

                                {/* LOADING HISTORI */}
                                {loadingHistori && (
                                    <div className="text-center py-4">

                                        <div
                                            className="spinner-border text-primary"
                                            role="status"
                                        >
                                            <span className="visually-hidden">
                                                Loading...
                                            </span>
                                        </div>

                                        <p className="text-muted mt-2 mb-0">
                                            Memuat catatan perwalian...
                                        </p>

                                    </div>
                                )}

                                {/* ERROR HISTORI */}
                                {errorHistori && (
                                    <div className="alert alert-danger">
                                        {errorHistori}
                                    </div>
                                )}

                                {/* TIDAK ADA HISTORI */}
                                {!loadingHistori &&
                                    !errorHistori &&
                                    histori.length === 0 && (
                                        <div className="text-center py-4">

                                            <p className="text-muted mb-0">
                                                Belum ada catatan perwalian
                                                untuk mahasiswa ini.
                                            </p>

                                        </div>
                                    )}

                                {/* TABEL HISTORI */}
                                {!loadingHistori &&
                                    !errorHistori &&
                                    histori.length > 0 && (

                                        <div className="table-responsive">

                                            <table className="table table-hover align-middle">

                                                <thead>
                                                    <tr>
                                                        <th>No</th>
                                                        <th>Tanggal</th>
                                                        <th>Semester</th>
                                                        <th>Tahun Ajaran</th>
                                                        <th>Topik</th>
                                                        <th>Isi Perwalian</th>
                                                        <th>Status</th>
                                                    </tr>
                                                </thead>

                                                <tbody>

                                                    {histori.map((item, index) => (
                                                        <tr key={item.id || index}>

                                                            <td>
                                                                {index + 1}
                                                            </td>

                                                            <td>
                                                                {item.tanggal || '-'}
                                                            </td>

                                                            <td>
                                                                {item.semester || '-'}
                                                            </td>

                                                            <td>
                                                                {item.tahun_ajaran || '-'}
                                                            </td>

                                                            <td>
                                                                {item.topik || '-'}
                                                            </td>

                                                            <td>
                                                                {item.isi_perwalian || '-'}
                                                            </td>

                                                            <td>
                                                                {item.status || '-'}
                                                            </td>

                                                        </tr>
                                                    ))}

                                                </tbody>

                                            </table>

                                        </div>
                                    )}

                            </div>

                            {/* FOOTER MODAL */}
                            <div className="modal-footer">

                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={handleCloseModal}
                                >
                                    Tutup
                                </button>

                            </div>

                        </div>

                    </div>

                </div>
            )}

        </div>
    );
}