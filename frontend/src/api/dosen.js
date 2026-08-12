import api from './axios';

export const getDosens = async (page = 1, search = '') => {
  const response = await api.get(`/dosen?page=${page}&search=${encodeURIComponent(search)}`);
  return response.data;
};

export const createDosen = async (data) => {
  const response = await api.post('/dosen', data);
  return response.data;
};

export const updateDosen = async (id, data) => {
  const response = await api.put(`/dosen/${id}`, data);
  return response.data;
};

export const deleteDosen = async (id) => {
  const response = await api.delete(`/dosen/${id}`);
  return response.data;
};

export const importDosen = async (file) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post('/dosen/import', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};
