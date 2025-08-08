

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminLogin } from '../api/api';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';
import { Lock, Mail, KeyRound, Menu } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const [showSidebar, setShowSidebar] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await adminLogin(email, password);
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      navigate('/dashboard');
    } catch (err) {
      alert(err?.response?.data?.message || 'Admin login failed');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f0f0f] via-[#1a1a1a] to-[#111827] text-white w-full relative overflow-hidden">
      {/* Sidebar Desktop */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Mobile Sidebar */}
      {showSidebar && (
        <>
          <div
            className="fixed inset-0 bg-black/40 z-40"
            onClick={() => setShowSidebar(false)}
          ></div>
          <div className="fixed top-0 left-0 h-full w-64 bg-[#0f172a] text-white shadow-lg z-50 transition-transform duration-300 transform translate-x-0">
            <Sidebar />
          </div>
        </>
      )}

      {/* Main Content */}
      <div className="flex flex-1 items-center justify-center px-6 py-12 relative">
        {/* Mobile Toggle */}
        <button
          onClick={() => setShowSidebar(true)}
          className="absolute top-4 left-4 md:hidden bg-white text-gray-800 shadow rounded-full p-2 z-20 transition hover:scale-105"
        >
          <Menu size={22} />
        </button>

        {/* Login Card */}
        <form
          onSubmit={handleLogin}
          className="w-full max-w-xl bg-slate-900/90 backdrop-blur-xl p-10 rounded-2xl border border-blue-700 shadow-xl animate-fade-in transition-all duration-500 transform hover:shadow-blue-500/30 hover:-translate-y-1"
        >
          <h2 className="text-4xl font-extrabold mb-8 text-blue-400 text-center flex items-center justify-center gap-3 tracking-tight animate-pulse">
            <Lock className="w-7 h-7" /> Admin Login
          </h2>

          <div className="mb-6 transition-all duration-300">
            <label className="block text-sm font-medium mb-2 text-slate-300 flex items-center gap-2">
              <Mail className="w-4 h-4" /> Email
            </label>
            <input
              type="email"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
              required
            />
          </div>

          <div className="mb-8 transition-all duration-300">
            <label className="block text-sm font-medium mb-2 text-slate-300 flex items-center gap-2">
              <KeyRound className="w-4 h-4" /> Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all duration-300"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-lg font-semibold text-lg transition duration-300 shadow hover:shadow-purple-500/40 transform hover:-translate-y-0.5"
          >
            Login as Admin
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminLoginPage;
