# 🎨 Frontend Guide - Redux Toolkit & Protected Routes (SV2)

## 📌 **Nhiệm vụ của SV2 (Frontend Advanced):**

Xây dựng React Frontend với:
1. **Redux Toolkit** - State management nâng cao
2. **Protected Routes** - Chặn truy cập nếu chưa đăng nhập
3. **API Service** - Axios với auto refresh token
4. **Auth Flow** - Login, Register, Logout, Profile
5. **Role-based UI** - Hiển thị khác nhau theo role

---

## 🚀 **Bước 1: Setup Project**

### 1.1. Tạo React App (nếu chưa có)
```bash
cd group10-project
npx create-react-app frontend
cd frontend
```

### 1.2. Cài đặt dependencies
```bash
npm install @reduxjs/toolkit react-redux react-router-dom axios
```

**Các package:**
- `@reduxjs/toolkit` - Redux state management
- `react-redux` - React bindings cho Redux
- `react-router-dom` - Routing
- `axios` - HTTP client

---

## 🗂️ **Bước 2: Cấu trúc thư mục**

```
frontend/
├── src/
│   ├── app/
│   │   └── store.js                    # Redux store
│   ├── features/
│   │   └── auth/
│   │       ├── authSlice.js            # Auth reducer
│   │       └── authAPI.js              # API calls
│   ├── components/
│   │   ├── ProtectedRoute.jsx          # Protected route wrapper
│   │   ├── Navbar.jsx                  # Navigation bar
│   │   └── RoleBasedComponent.jsx      # Component theo role
│   ├── pages/
│   │   ├── Login.jsx                   # Login page
│   │   ├── Register.jsx                # Register page
│   │   ├── Profile.jsx                 # Profile page
│   │   ├── Dashboard.jsx               # Dashboard (user)
│   │   └── AdminPanel.jsx              # Admin panel
│   ├── services/
│   │   └── api.js                      # Axios instance + interceptors
│   ├── App.js                          # Main app component
│   └── index.js                        # Entry point
└── package.json
```

---

## 📝 **Bước 3: Redux Store Setup**

### 3.1. Tạo file `src/app/store.js`
```javascript
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});

export default store;
```

### 3.2. Wrap App với Provider trong `src/index.js`
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
```

---

## 🔐 **Bước 4: Auth Slice (Redux Toolkit)**

### Tạo file `src/features/auth/authSlice.js`
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://localhost:5000';

// Lấy user từ localStorage khi init
const user = JSON.parse(localStorage.getItem('user'));
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

const initialState = {
  user: user ? user : null,
  accessToken: accessToken ? accessToken : null,
  refreshToken: refreshToken ? refreshToken : null,
  isLoading: false,
  isSuccess: false,
  isError: false,
  message: '',
};

// Register User
export const register = createAsyncThunk(
  'auth/register',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/auth/register`, userData);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Login User
export const login = createAsyncThunk(
  'auth/login',
  async (userData, thunkAPI) => {
    try {
      const response = await axios.post(`${API_URL}/auth/login`, userData);
      
      // Lưu vào localStorage
      if (response.data.user) {
        localStorage.setItem('user', JSON.stringify(response.data.user));
      }
      if (response.data.accessToken) {
        localStorage.setItem('accessToken', response.data.accessToken);
      }
      if (response.data.refreshToken) {
        localStorage.setItem('refreshToken', response.data.refreshToken);
      }
      
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || error.message;
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Logout User
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, thunkAPI) => {
    try {
      const refreshToken = localStorage.getItem('refreshToken');
      
      // Call API logout
      if (refreshToken) {
        await axios.post(`${API_URL}/auth/logout`, { refreshToken });
      }
      
      // Clear localStorage
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      
      return true;
    } catch (error) {
      // Vẫn logout dù API fail
      localStorage.removeItem('user');
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      return true;
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false;
      state.isSuccess = false;
      state.isError = false;
      state.message = '';
    },
    updateAccessToken: (state, action) => {
      state.accessToken = action.payload;
      localStorage.setItem('accessToken', action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.message = 'Đăng ký thành công!';
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
      })
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isSuccess = true;
        state.user = action.payload.user;
        state.accessToken = action.payload.accessToken;
        state.refreshToken = action.payload.refreshToken;
        state.message = 'Đăng nhập thành công!';
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.message = action.payload;
        state.user = null;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.accessToken = null;
        state.refreshToken = null;
      });
  },
});

export const { reset, updateAccessToken } = authSlice.actions;
export default authSlice.reducer;
```

---

## 🌐 **Bước 5: API Service với Auto Refresh Token**

### Tạo file `src/services/api.js`
```javascript
import axios from 'axios';
import { store } from '../app/store';
import { updateAccessToken, logout } from '../features/auth/authSlice';

const API_URL = 'http://localhost:5000';

// Tạo axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Thêm access token vào header
api.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Auto refresh token khi expired
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Nếu lỗi 403 (token expired) và chưa retry
    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (!refreshToken) {
          store.dispatch(logout());
          return Promise.reject(error);
        }

        // Gọi API refresh token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: refreshToken,
        });

        const newAccessToken = response.data.accessToken;

        // Cập nhật access token mới
        store.dispatch(updateAccessToken(newAccessToken));

        // Retry request gốc với token mới
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token failed, logout user
        store.dispatch(logout());
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## 🛡️ **Bước 6: Protected Route Component**

### Tạo file `src/components/ProtectedRoute.jsx`
```javascript
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const { user, accessToken } = useSelector((state) => state.auth);

  // Chưa đăng nhập
  if (!user || !accessToken) {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra role
  if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
};

export default ProtectedRoute;
```

---

## 🗺️ **Bước 7: App Routes**

### Update file `src/App.js`
```javascript
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AdminPanel from './pages/AdminPanel';
import Unauthorized from './pages/Unauthorized';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" /> : <Register />} 
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

export default App;
```

---

## ✅ **Hoàn thành!**

Đây là hướng dẫn đầy đủ để SV2 implement Frontend với Redux Toolkit và Protected Routes!

**Activity 6: Redux & Protected Routes (SV2) - Complete!**
