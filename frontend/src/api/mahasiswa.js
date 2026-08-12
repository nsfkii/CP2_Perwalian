import api from './axios';

export const getMahasiswas = async (page = 1, search = '') => {
    const response = await api.get(`/mahasiswa?page=${page}&search=${encodeURIComponent(search)}`);
    return response.data;
};

export const createMahasiswa = async (data) => {
    const response = await api.post('/mahasiswa', data);
    return response.data;
};

export const updateMahasiswa = async (id, data) => {
    const response = await api.put(`/mahasiswa/${id}`, data);
    return response.data;
};

export const deleteMahasiswa = async (id) => {
    const response = await api.delete(`/mahasiswa/${id}`);
    return response.data;
};

export const importMahasiswa = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    const response = await api.post('/mahasiswa/import', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });
    return response.data;
};
