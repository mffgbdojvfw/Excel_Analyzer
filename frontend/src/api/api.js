

import axios from 'axios';

const API_BASE = 'http://localhost:5678/api'; // Make sure this matches your backend port

// -------------------- AUTH --------------------

export const loginUser = (email, password) =>
  axios.post(`${API_BASE}/auth/login`, { email, password });

export const registerUser = ({name, email, password, role }) =>
  axios.post(`${API_BASE}/auth/register`, { name, email, password, role});


export const adminLogin = (email, password) =>
  axios.post(`${API_BASE}/auth/admin-login`, { email, password });

// ✅ Admin Update Email/Password
export const updateAdminCredentials = (newEmail, newPassword, token) =>
  axios.patch(
    `${API_BASE}/auth/admin/update-credentials`,
    { newEmail, newPassword },
    {
      headers: { Authorization: `Bearer ${token}` },
    }
  );



// -------------------- USER: Upload + History --------------------

export const uploadExcelFile = (file, token) => {
  const formData = new FormData();
  formData.append('file', file);

  return axios.post(`${API_BASE}/uploads/excel`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const getFileHistory = (token) =>
  axios.get(`${API_BASE}/uploads/history`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const getParsedDataById = (id, token) =>
  axios.get(`${API_BASE}/uploads/${id}/data`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// -------------------- INSIGHT --------------------

export const generateInsight = (id, token) =>
  axios.post(`${API_BASE}/insights/${id}`, null, {
    headers: { Authorization: `Bearer ${token}` },
  });

// -------------------- ADMIN --------------------

export const getAllFilesAdmin = (token) =>
  axios.get(`${API_BASE}/admin/files`, {
    headers: { Authorization: `Bearer ${token}` },
  });

export const deleteFileAdmin = (id, token) =>
  axios.delete(`${API_BASE}/admin/files/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });


// ✅ -------------------- NEW ADMIN APIs --------------------

// 1. Get All Users
export const getAllUsers = (token) =>
  axios.get(`${API_BASE}/admin/users`, {
    headers: { Authorization: `Bearer ${token}` },
  });


// // 2. Toggle User Status (active/inactive)
// export const toggleUserStatus = (id, token) =>
//   axios.patch(`${API_BASE}/admin/users/${id}/status`, null, {
//     headers: { Authorization: `Bearer ${token}` },
//   });

export const getUserUploadCounts = (token) =>
  axios.get(`${API_BASE}/admin/users/upload-counts`, {
    headers: { Authorization: `Bearer ${token}` },
  });


// 3. Get Insight Logs per User
export const getInsightUsageLogs = (token) =>
  axios.get(`${API_BASE}/admin/insights/logs`, {
    headers: { Authorization: `Bearer ${token}` },
  });

// 4. Get System Alerts
export const getSystemAlerts = (token) =>
  axios.get(`${API_BASE}/admin/system/alerts`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  
export const getBase64FileById = (id, token) =>
  axios.get(`${API_BASE}/uploads/${id}/base64`, {
    headers: { Authorization: `Bearer ${token}` },
  });  


export const getUserSignupStats = (token) =>
axios.get(`${API_BASE}/admin/users/stats`, {
  headers: { Authorization: `Bearer ${token}` },
  });



export const uploadProfileImage = (file, token) => {
  const formData = new FormData();
  formData.append('image', file);

  return axios.patch(`${API_BASE}/auth/update-profile-image`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'multipart/form-data',
    },
  });
};


export const deleteProfileImage = (token) => {
  return axios.delete(`${API_BASE}/auth/delete-profile`, {
    headers: { Authorization: `Bearer ${token}` }
  });
};


export const deleteUserFile = (id, token) =>
  axios.delete(`${API_BASE}/uploads/history/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
