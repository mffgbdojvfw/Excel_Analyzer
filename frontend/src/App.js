import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './routes/PrivateRoute';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/DashboardPage';
import AdminPanel from './pages/AdminPanel';
import ExcelUpload from './pages/ExcelUpload';
import FileHistory from './pages/FileHistory';
import Settings from './pages/Settings';
import UserProfile from './pages/UserProfile';
import RegisterPage from './pages/RegisterPage';
import FileInsight from './pages/FileInsight';
import AdminLoginPage from './pages/AdminLoginPage';
import AdminSettings from './pages/AdminSettings';
document.body.classList.add('dark'); 
const App = () => (
  <AuthProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
        <Route path="/register" element={<RegisterPage/>} />
        <Route path="/adminpanel" element={<AdminPanel />} />
        <Route path="/upload"
 element={<PrivateRoute><ExcelUpload /></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><FileHistory /></PrivateRoute>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><UserProfile /></PrivateRoute>} />
        <Route path="/filehistory" element={<FileHistory />} />
        <Route path="/insight/:id" element={<FileInsight />} />
        <Route path="/admin-login" element={<AdminLoginPage />} />
        <Route path="/admin/settings" element={<AdminSettings />} />
      </Routes>
    </Router>
  </AuthProvider>
);

export default App;

