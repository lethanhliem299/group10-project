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
      
      // Call API logout (optional)
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
          // Không có refresh token, logout
          store.dispatch(logout());
          return Promise.reject(error);
        }

        // Gọi API refresh token
        const response = await axios.post(`${API_URL}/auth/refresh`, {
          refreshToken: refreshToken,
        });

        const newAccessToken = response.data.accessToken;

        // Cập nhật access token mới vào Redux store và localStorage
        store.dispatch(updateAccessToken(newAccessToken));

        // Retry request gốc với token mới
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token cũng failed, logout user
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

  // Kiểm tra role (nếu có yêu cầu)
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

// Import pages
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
        {/* Public routes */}
        <Route 
          path="/login" 
          element={user ? <Navigate to="/dashboard" /> : <Login />} 
        />
        <Route 
          path="/register" 
          element={user ? <Navigate to="/dashboard" /> : <Register />} 
        />

        {/* Protected routes - Tất cả users đã login */}
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

        {/* Protected routes - Chỉ Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminPanel />
            </ProtectedRoute>
          }
        />

        {/* Other routes */}
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
      </Routes>
    </div>
  );
}

export default App;
```

---

## 📄 **Bước 8: Tạo Pages**

### 8.1. `src/pages/Login.jsx`
```javascript
import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      alert(message);
    }

    if (isSuccess || user) {
      navigate('/dashboard');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Login'}
        </button>
      </form>
    </div>
  );
}

export default Login;
```

### 8.2. `src/pages/Dashboard.jsx`
```javascript
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

function Dashboard() {
  const { user } = useSelector((state) => state.auth);

  return (
    <div className="dashboard">
      <h2>Dashboard</h2>
      <p>Xin chào, {user?.name}!</p>
      <p>Role: {user?.role}</p>

      <div className="dashboard-links">
        <Link to="/profile">My Profile</Link>
        
        {user?.role === 'admin' && (
          <Link to="/admin">Admin Panel</Link>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
```

### 8.3. `src/pages/Profile.jsx`
```javascript
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import api from '../services/api';

function Profile() {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await api.get('/auth/profile');
        setProfile(response.data);
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="profile">
      <h2>My Profile</h2>
      {profile && (
        <div>
          <p><strong>Name:</strong> {profile.name}</p>
          <p><strong>Email:</strong> {profile.email}</p>
          <p><strong>Role:</strong> {profile.role}</p>
          {profile.avatar && (
            <img src={profile.avatar} alt="Avatar" width="200" />
          )}
        </div>
      )}
    </div>
  );
}

export default Profile;
```

### 8.4. `src/pages/AdminPanel.jsx`
```javascript
import { useEffect, useState } from 'react';
import api from '../services/api';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await api.get('/api/admin/users');
        setUsers(response.data.users);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-panel">
      <h2>Admin Panel - User Management</h2>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Role</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user._id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.role}</td>
              <td>{user.isActive ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AdminPanel;
```

---

## 🧭 **Bước 9: Navbar Component**

### Tạo file `src/components/Navbar.jsx`
```javascript
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../features/auth/authSlice';

function Navbar() {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-brand">
        <Link to="/">User Management System</Link>
      </div>
      
      <div className="nav-links">
        {user ? (
          <>
            <Link to="/dashboard">Dashboard</Link>
            <Link to="/profile">Profile</Link>
            {user.role === 'admin' && (
              <Link to="/admin">Admin Panel</Link>
            )}
            <button onClick={handleLogout}>Logout</button>
            <span>Welcome, {user.name}</span>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
```

---

## ✅ **Bước 10: Testing**

### 10.1. Test Authentication Flow
1. **Register** → Tạo user mới
2. **Login** → Redirect to Dashboard
3. **View Profile** → API call tự động thêm token
4. **Logout** → Clear token, redirect to Login

### 10.2. Test Protected Routes
1. Chưa login → Try access `/dashboard` → Redirect to `/login`
2. Login as User → Try access `/admin` → Redirect to `/unauthorized`
3. Login as Admin → Access `/admin` → Success

### 10.3. Test Auto Refresh Token
1. Login → Lấy access token (expires 15 phút)
2. Đợi token expires (hoặc manually delete trong localStorage)
3. Call API `/auth/profile`
4. → Auto refresh token
5. → Retry API với token mới
6. → Success

---

## 🎨 **Bước 11: Styling (Optional)**

### Tạo file `src/App.css`
```css
.navbar {
  background-color: #333;
  padding: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.navbar a {
  color: white;
  text-decoration: none;
  margin: 0 1rem;
}

.navbar button {
  background-color: #f44336;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  cursor: pointer;
}

.login-container, .dashboard, .profile, .admin-panel {
  max-width: 800px;
  margin: 2rem auto;
  padding: 2rem;
}

input {
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 1rem;
}

button {
  background-color: #4CAF50;
  color: white;
  padding: 0.7rem 1.5rem;
  border: none;
  cursor: pointer;
}

button:disabled {
  background-color: #ccc;
}

table {
  width: 100%;
  border-collapse: collapse;
}

table th, table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

table th {
  background-color: #4CAF50;
  color: white;
}
```

---

## 🚀 **Bước 12: Run Frontend**

```bash
cd frontend
npm start
```

Frontend sẽ chạy tại: `http://localhost:3000`

---

## 📦 **Package.json**

```json
{
  "name": "frontend",
  "version": "0.1.0",
  "dependencies": {
    "@reduxjs/toolkit": "^2.0.1",
    "axios": "^1.6.2",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-redux": "^9.0.4",
    "react-router-dom": "^6.21.1",
    "react-scripts": "5.0.1"
  },
  "scripts": {
    "start": "react-scripts start",
    "build": "react-scripts build",
    "test": "react-scripts test",
    "eject": "react-scripts eject"
  }
}
```

---

## 🎯 **Tổng kết - SV2 đã hoàn thành:**

✅ **Redux Toolkit:**
- Redux store setup
- Auth slice với async thunks (register, login, logout)
- State management cho user, tokens, loading, error

✅ **API Service:**
- Axios instance với interceptors
- Auto attach access token to requests
- Auto refresh token khi expired
- Retry failed requests với token mới

✅ **Protected Routes:**
- ProtectedRoute component
- Kiểm tra authentication
- Kiểm tra role-based authorization
- Redirect chưa login về `/login`
- Redirect không có quyền về `/unauthorized`

✅ **Pages:**
- Login, Register, Dashboard, Profile, AdminPanel
- Integration với Redux
- API calls với auto token refresh

✅ **Components:**
- Navbar với conditional rendering theo user role
- Role-based UI components

---

## 📝 **Git Commands cho SV2:**

```bash
# Checkout branch
git checkout -b feature/redux-protected

# Add files
git add frontend/

# Commit
git commit -m "feat: Add Redux Toolkit & Protected Routes

- Setup Redux store with auth slice
- Implement login, register, logout with async thunks
- Create API service with auto refresh token interceptor
- Implement ProtectedRoute component with role-based access
- Create pages: Login, Register, Dashboard, Profile, AdminPanel
- Create Navbar with conditional rendering
- Add routing with React Router
- Add styling

Activity 6: Redux & Protected Routes (SV2)"

# Push
git push origin feature/redux-protected
```

---

## 🔥 **Demo Flow:**

1. **Register** → `/register`
2. **Login** → `/login` → Redirect `/dashboard`
3. **Dashboard** → Hiển thị thông tin user, link Profile, Admin (nếu admin)
4. **Profile** → API call `/auth/profile` với auto token
5. **Admin Panel** → Chỉ admin truy cập được
6. **Access Token Expired** → Auto refresh → Retry API → Success
7. **Logout** → Clear tokens → Redirect `/login`

---

**✅ Hoàn thành Activity 6!**

