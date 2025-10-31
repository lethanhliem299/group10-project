import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Tạo axios instance
const axiosInstance = axios.create({
  baseURL: API_URL
});

// Flag để tránh gọi refresh nhiều lần
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });

  failedQueue = [];
};

// Request Interceptor - Tự động thêm accessToken vào header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log("📤 Request:", config.method?.toUpperCase(), config.url);
      console.log("🔑 Using token:", token.substring(0, 20) + "...");
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor - Tự động refresh token khi accessToken hết hạn
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 401 (Unauthorized) và chưa retry
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Nếu đang refresh, đợi cho refresh xong
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers.Authorization = `Bearer ${token}`;
            return axiosInstance(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const refreshToken = localStorage.getItem("refreshToken");

      if (!refreshToken) {
        console.error("❌ Không có refresh token, đăng xuất...");
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(error);
      }

      try {
        console.log("🔄 Access token hết hạn, đang refresh...");
        
        // Gọi API refresh token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: refreshToken
        });

        const newAccessToken = response.data.accessToken;

        // Lưu access token mới
        localStorage.setItem("accessToken", newAccessToken);
        
        console.log("✅ Refresh token thành công!");
        console.log("🔑 New token:", newAccessToken.substring(0, 20) + "...");

        // Cập nhật header cho request ban đầu
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

        // Process các request đang đợi
        processQueue(null, newAccessToken);

        isRefreshing = false;

        console.log("🔄 Retrying original request with new token...");
        // Retry request ban đầu với token mới
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("❌ Refresh token thất bại:", refreshError);
        processQueue(refreshError, null);
        isRefreshing = false;

        // Xóa tokens và chuyển về trang login
        localStorage.clear();
        window.location.href = "/";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

