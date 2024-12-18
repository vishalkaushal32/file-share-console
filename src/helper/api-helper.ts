
import axios from 'axios';

export const UPLOAD_URI = import.meta.env.VITE_UPLOAD_URI
export const DOWNLOAD_URI = import.meta.env.VITE_DOWNLOAD_URI



export const uploadFiles = async (files: File[], onUploadProgress: (progress: number) => void) => {
  const formData = new FormData();

  files.forEach(file => {
    formData.append("files", file);
  });

  try {
    const response = await axios.post(UPLOAD_URI, formData, {
      headers: { "Content-Type": "multipart/form-data" },
      onUploadProgress: (event) => {
        const progress = Math.round((event.loaded / event.total) * 100);
        onUploadProgress(progress);
      },
    });

    return response.data;
  } catch (error) {
    alert("File upload failed");
    throw error;
  }
};

export const downloadFile = async (passphrase: string, onDownloadProgress: (progress: number) => void): Promise<void> => {
  try {
    const response = await axios.get(DOWNLOAD_URI + `?passphrase=${passphrase}`, {
      responseType: 'blob',
      onDownloadProgress: (event) => {
        const progress = Math.round((event.loaded / event.total) * 100);
        onDownloadProgress(progress);
      },
    });

    const blob = new Blob([response.data]);
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'downloaded_file');
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  } catch (error: any) {
    alert(`Error during download: ${error.message}`);
    throw error;
  }
};
