import api from './axios';

export const getPerwalians = async (page = 1, search = '', dosenId = '') => {
    const params = new URLSearchParams({
        page: String(page),
        search,
    });

    if (dosenId) {
        params.set('dosen_id', String(dosenId));
    }

    const response = await api.get(`/perwalian?${params.toString()}`);
    return response.data;
};

export const createPerwalian = async (data) => {
    const response = await api.post('/perwalian', data);
    return response.data;
};

export const updatePerwalian = async (id, data) => {
    const response = await api.put(`/perwalian/${id}`, data);
    return response.data;
};

export const deletePerwalian = async (id) => {
    const response = await api.delete(`/perwalian/${id}`);
    return response.data;
};
