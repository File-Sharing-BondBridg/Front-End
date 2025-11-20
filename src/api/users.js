import axios from "axios";

const API_BASE_URL = process.env.REACT_APP_USER_SERVICE_URL || 'http://localhost:8084';
console.log("User Service API Base URL:", API_BASE_URL);

export async function syncUser(token) {
  try {
    const response = await axios.post(`${API_BASE_URL}/users/sync`, {}, { // Added empty object as data
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    
    console.log("User synced:", response.data);
    return response.data;
  } catch (err) {
    console.error("User sync failed:", err);
    throw err;
  }
}

export async function getUserInfo(token) {
  try {
    const response = await axios.get(`${API_BASE_URL}/users/me`, {
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    console.log("User info:", response.data);
    return response.data;
  } catch (err) {
    console.error("Get user info failed:", err);
    throw err;
  }
}

export async function deleteAccount(token) {
  try {
    const response = await axios.delete(`${API_BASE_URL}/users/me`, {
      headers: { "Authorization": `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.error("Account deletion failed:", err);
    throw err;
  }
}