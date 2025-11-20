import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080/api';
console.log("API Base URL:", API_BASE_URL);

export async function fetchFiles(token) {
  const res = await axios.get(`${API_BASE_URL}/files`, {

    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data;
}

export async function uploadFile(file, onProgress, token) {
  const formData = new FormData();
  formData.append("file", file);

  await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: { Authorization: `Bearer ${token}` },
    onUploadProgress: (evt) => {
      if (evt.total) {
        const percent = Math.round((evt.loaded / evt.total) * 100);
        onProgress(percent);
      }
    },
  });
}

export async function deleteFile(id, token) {
  await axios.delete(`${API_BASE_URL}/files/${id}/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
}

export async function createShare(id, token) {
  const res = await axios.post(`${API_BASE_URL}/files/${id}/share`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return res.data.share_url;
}
