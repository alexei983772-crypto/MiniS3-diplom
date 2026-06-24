import axios from "axios";

const API = "http://localhost:3000";

// 🔐 instance с токеном
const api = axios.create({
  baseURL: API,
});

// автоматически подставляет токен
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ---------- AUTH ----------

export const register = async (email, password) => {
  const res = await axios.post(`${API}/auth/register`, {
    email,
    password,
  });
  return res.data;
};

export const login = async (email, password) => {
  const res = await axios.post(`${API}/auth/login`, {
    email,
    password,
  });

  // 🔥 сохраняем токен
  localStorage.setItem("token", res.data.token);

  return res.data;
};

export const logout = () => {
  localStorage.removeItem("token");
};

// ---------- FILES ----------

export const getFiles = async () => {
  const res = await api.get("/files");
  return res.data;
};

export const uploadFile = async (file, bucketId) => {
  const formData = new FormData();

  formData.append("file", file);
  formData.append("bucketId", bucketId);

  const res = await api.post("/files/upload", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
export const downloadFile = async (id, filename) => {
  console.log("DOWNLOAD START");
  console.log("ID:", id);
  console.log("FILENAME:", filename);

  try {
    const res = await api.get(`/files/${id}`, {
      responseType: "blob",
    });

    console.log("RESPONSE:", res);
    console.log("RESPONSE DATA:", res.data);
    console.log("HEADERS:", res.headers);

    const blob = new Blob([res.data]);

    console.log("BLOB:", blob);
    console.log("BLOB SIZE:", blob.size);
    console.log("BLOB TYPE:", blob.type);

    const url = window.URL.createObjectURL(blob);

    console.log("OBJECT URL:", url);

    const a = document.createElement("a");

    a.href = url;
    a.download = filename;

    console.log("ANCHOR:", a);
    console.log("ANCHOR DOWNLOAD:", a.download);

    document.body.appendChild(a);

    console.log("CLICKING DOWNLOAD...");

    a.click();

    console.log("DOWNLOAD CLICKED");

    document.body.removeChild(a);

    window.URL.revokeObjectURL(url);

    console.log("CLEANUP DONE");
  } catch (err) {
    console.error("DOWNLOAD ERROR:", err);
  }
};

// ---------- BUCKETS ----------
/*
export const createBucket = async (name, userId) => {
  const res = await api.post("/buckets", {
    name,
    userId,
  });
  return res.data;
};
*/

export const createBucket = async (name) => {
  const res = await api.post("/buckets", { name });
  return res.data;
};

export const getBuckets = async () => {
  const res = await api.get("/buckets");
  return res.data;
};

export const getFilesByBucket = async (bucketId) => {
  const res = await api.get(`/files/bucket/${bucketId}`);
  return res.data;
};

export const deleteFile = async (fileId) => {
  const res = await api.delete(`/files/${fileId}`);
  return res.data;
};

export const deleteBucket = async (bucketId) => {
  const res = await api.delete(`/buckets/${bucketId}`);
  return res.data;
};

// GET bucket stats (files, chunks, size, quota)
export const getBucketStats = async (bucketId) => {
  const res = await api.get(`/buckets/${bucketId}/fileStats`);
  return res.data;
};

export const renameBucket = async (bucketId, name) => {
  const res = await api.put(`/buckets/${bucketId}`, { name });
  return res.data;
};

// ---------- PROFILE ----------

export const getProfile = async () => {
  const res = await api.get("/users/me");
  return res.data;
};

export const getUserStats = async () => {
  const res = await api.get("/users/stats");
  return res.data;
};

export const changePassword = async (
  oldPassword,
  newPassword
) => {
  const res = await api.put(
    "/users/password",
    {
      oldPassword,
      newPassword,
    }
  );

  return res.data;
};

export const getNodes = async () => {
  const res = await api.get("/nodes");
  return res.data;
};

export const getDistribution = async (bucketId) => {
  const res = await api.get(
    `/nodes/distribution/${bucketId}`
  );

  return res.data;
};

export const verifyEmail = async (email, code) => {
  const res = await api.post("/auth/verify-email", {
    email,
    code,
  });

  return res.data;
};