import api from './axios';

export const getRekapData = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const response = await api.get(`/rekap/perwalian${params ? `?${params}` : ''}`);
  return response; // return full axios response so callers can access response.data.summary
};

export const exportData = async (format) => {
  // format: 'excel' or 'pdf'
  const response = await api.get(`/rekap/perwalian/export/${format}`, {
    responseType: 'blob',
  });

  const mime = format === 'excel' ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' : 'application/pdf';
  const ext = format === 'excel' ? 'xlsx' : 'pdf';

  const blob = new Blob([response.data], { type: mime });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', `rekap_perwalian_stmik.${ext}`);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
