import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

export async function fetchFiles() {
  const res = await axios.get(`${API_BASE_URL}/files`);
  return res.data;
}

export async function uploadFile(file, onProgress) {
  const formData = new FormData();
  formData.append("file", file);

  await axios.post(`${API_BASE_URL}/upload`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (evt) => {
      if (evt.total) {
        const percent = Math.round((evt.loaded / evt.total) * 100);
        onProgress(percent);
      }
    },
  });
}

export async function deleteFile(id) {
  await axios.delete(`${API_BASE_URL}/files/${id}/delete`);
}

export async function createShare(id) {
  const res = await axios.post(`${API_BASE_URL}/files/${id}/share`);
  return res.data.share_url;
}
