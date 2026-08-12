import api from './axios';

export const getDosenWalis = async (page = 1, search = '') => {
    const response = await api.get(`/dosen-wali?page=${page}&search=${encodeURIComponent(search)}`);
    return response.data;
};

export const createDosenWali = async (data) => {
    const response = await api.post('/dosen-wali', data);
    return response.data;
};

export const updateDosenWali = async (id, data) => {
    const response = await api.put(`/dosen-wali/${id}`, data);
    return response.data;
};

export const deleteDosenWali = async (id) => {
    const response = await api.delete(`/dosen-wali/${id}`);
    return response.data;
};
