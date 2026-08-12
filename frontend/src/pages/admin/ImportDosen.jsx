import React, { useState } from 'react';
import { Card, Button, Form, Alert, Table } from 'react-bootstrap';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import { FiArrowLeft, FiUploadCloud } from 'react-icons/fi';
import { importDosen } from '../../api/dosen';

export default function ImportDosen() {
    const [file, setFile] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState(null);

    const handleFileChange = (e) => setFile(e.target.files[0]);

    const handleImport = async (e) => {
        e.preventDefault();
        if (!file) return toast.warning("Silakan pilih file terlebih dahulu");

        setIsLoading(true);
        setResult(null);

        try {
            const res = await importDosen(file);
            toast.success(res.message);
            setResult(res.data);
        } catch (error) {
            toast.error(error.response?.data?.message || "Gagal melakukan import");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="container-fluid">
            <div className="mb-4 d-flex align-items-center">
                <Link to="/admin/dosen" className="btn btn-light me-3">
                    <FiArrowLeft /> Kembali
                </Link>
                <div>
                    <h4 className="fw-bold text-dark mb-0">Import Data Dosen</h4>
                    <p className="text-muted small mb-0">Unggah file Excel (.xlsx, .csv) untuk menambahkan data secara langsung</p>
                </div>
            </div>

            <div className="row">
                <div className="col-md-6">
                    <Card className="card-custom border-0 shadow-sm mb-4">
                        <Card.Body className="p-4">
                            <Form onSubmit={handleImport}>
                                <div className="text-center p-5 border rounded-3 mb-4" style={{ backgroundColor: '#f8fafc', borderStyle: 'dashed !important' }}>
                                    <FiUploadCloud className="fs-1 text-primary mb-3" />
                                    <h5>Pilih File Excel</h5>
                                    <p className="text-muted small mb-4">Pastikan format kolom sesuai: <b>nidn</b>, <b>nama</b>, <b>email</b>, <b>no_hp.</b></p>
                                    <Form.Control type="file" accept=".xlsx, .xls, .csv" onChange={handleFileChange} />
                                </div>
                                <Button type="submit" className="btn-primary-custom w-100" disabled={isLoading || !file}>
                                    {isLoading ? 'Memproses Import...' : 'Mulai Import Data'}
                                </Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>

                <div className="col-md-6">
                    {result && (
                        <Card className="card-custom border-0 shadow-sm">
                            <Card.Body className="p-4">
                                <h5 className="fw-bold mb-3">Ringkasan Hasil Import</h5>
                                <div className="d-flex justify-content-between mb-2">
                                    <span>Total Baris Diproses:</span>
                                    <span className="fw-bold">{result.total_rows}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-2 text-success">
                                    <span>Berhasil Diimport:</span>
                                    <span className="fw-bold">{result.success_rows}</span>
                                </div>
                                <div className="d-flex justify-content-between mb-4 text-danger">
                                    <span>Gagal Diimport:</span>
                                    <span className="fw-bold">{result.failed_rows}</span>
                                </div>

                                {result.failed_rows > 0 && (
                                    <>
                                        <Alert variant="warning" className="small">
                                            Beberapa data gagal diimport. Berikut detailnya:
                                        </Alert>
                                        <div className="table-responsive" style={{ maxHeight: '200px' }}>
                                            <Table size="sm" bordered hover>
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Baris</th>
                                                        <th>NIDN</th>
                                                        <th>Keterangan Error</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {result.errors.map((err, idx) => (
                                                        <tr key={idx}>
                                                            <td>{err.row}</td>
                                                            <td>{err.nidn}</td>
                                                            <td className="text-danger">{err.error}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </Table>
                                        </div>
                                    </>
                                )}
                            </Card.Body>
                        </Card>
                    )}
                </div>
            </div>
        </div>
    );
}
