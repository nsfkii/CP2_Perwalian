import api from './axios';

export const exportDosenPerwalian = async (
    format,
    mahasiswaId = ''
) => {
    const params = mahasiswaId
        ? `?mahasiswa_id=${encodeURIComponent(mahasiswaId)}`
        : '';

    const response = await api.get(
        `/dosen/rekap/export/${format}${params}`,
        {
            responseType: 'blob',
        }
    );

    const mime =
        format === 'excel'
            ? 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            : 'application/pdf';

    const ext = format === 'excel' ? 'xlsx' : 'pdf';

    const blob = new Blob([response.data], {
        type: mime,
    });

    const url = window.URL.createObjectURL(blob);

    const link = document.createElement('a');

    link.href = url;

    link.setAttribute(
        'download',
        mahasiswaId
            ? `histori_perwalian_mahasiswa.${ext}`
            : `histori_perwalian_dosen.${ext}`
    );

    document.body.appendChild(link);

    link.click();

    link.remove();

    window.URL.revokeObjectURL(url);
};