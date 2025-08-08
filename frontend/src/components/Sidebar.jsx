
import React, { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Home,
  UploadCloud,
  Settings,
  User,
  FileText,
  Shield,
  LogOut,
  Lock,
  Menu,
  X
} from 'lucide-react';

const navLinks = [
  { to: '/dashboard', label: 'Dashboard', icon: Home, roles: ['admin'] },
  { to: '/adminpanel', label: 'Admin Panel', icon: Shield, roles: ['admin'] },
  { to: '/upload', label: 'Excel Upload', icon: UploadCloud, roles: ['admin', 'user'] },
  { to: '/history', label: 'File History', icon: FileText, roles: ['admin', 'user'] },
  { to: '/admin/settings', label: 'Admin Settings', icon: Settings, roles: ['admin'] },
  { to: '/profile', label: 'User Profile', icon: User, roles: ['admin', 'user'] },
  { to: '/admin-login', label: 'Admin Login', icon: Lock, roles: ['user'] },
];

const Sidebar = () => {
  const { logout, user } = useAuth();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();

  const toggleSidebar = () => setCollapsed(!collapsed);
  const toggleMobileSidebar = () => setMobileOpen(!mobileOpen);

  const linkStyle = (isActive) =>
    `group flex items-center gap-3 px-4 py-2 rounded-md text-sm font-semibold transition-all duration-300 relative ${
      isActive
        ? 'bg-gradient-to-r from-sky-500 to-purple-600 text-white shadow-md scale-[1.02]'
        : 'text-slate-300 hover:bg-slate-800/80 hover:text-sky-300'
    }`;

  return (
    <>
      {/* 📱 Mobile Hamburger */}
      <button
        onClick={toggleMobileSidebar}
        className="lg:hidden fixed top-4 left-4 z-50 bg-black/70 backdrop-blur text-white p-2 rounded-md shadow"
      >
        <Menu size={22} />
      </button>

      {/* 📱 Mobile Sidebar Overlay */}
      {mobileOpen && (
        <div
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
        />
      )}

      {/* 🧱 Sidebar */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full transition-all duration-300 bg-[#0f0f0f] border-r border-gray-800 text-white px-3 py-6 flex flex-col
        ${collapsed ? 'w-20' : 'w-64'}
        ${mobileOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0`}
      >
        {/* ❌ Close Button (Mobile only) */}
        <div className="lg:hidden flex justify-end mb-4">
          <button onClick={toggleMobileSidebar}>
            <X size={24} />
          </button>
        </div>

        {/* 🪩 Logo */}
        <h2
          className={`text-center font-extrabold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 ${
            collapsed ? 'text-xl' : 'text-3xl'
          } transition-all`}
        >
          {collapsed ? '📊' : '📊 Excel Platform'}
        </h2>

        {/* 🔗 Navigation Links */}
        <nav className="flex flex-col gap-3 flex-grow">
          {navLinks.map(({ to, label, icon: Icon, roles }) =>
            roles.includes(user?.role) ? (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) => linkStyle(isActive)}
                onClick={() => setMobileOpen(false)} // close on click
              >
                <div className="flex items-center gap-3 relative">
                  <Icon size={20} className="text-cyan-400" />
                  {!collapsed && <span>{label}</span>}
                  {collapsed && (
                    <span className="absolute left-12 bg-black px-2 py-1 rounded text-xs opacity-0 group-hover:opacity-100 transition-all duration-300 z-50">
                      {label}
                    </span>
                  )}
                </div>
                {location.pathname === to && (
                  <span className="absolute left-0 top-0 h-full w-1 bg-sky-400 rounded-r-md animate-pulse" />
                )}
              </NavLink>
            ) : null
          )}
        </nav>

        {/* ⚙️ Footer Actions */}
        <div className="space-y-2 mt-6">
          <button
            onClick={logout}
            className="w-full flex items-center gap-2 px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-900/30 rounded-lg transition duration-300 text-sm"
          >
            <LogOut size={20} /> {!collapsed && 'Logout'}
          </button>

          {/* Desktop Collapse Toggle */}
         {/* Collapse Toggle - Always visible */}
<button
  onClick={toggleSidebar}
  className="w-full px-3 py-2 bg-slate-800/40 text-white rounded-md text-xs hover:bg-slate-700 transition"
>
  {collapsed ? '▶ Expand Sidebar' : '◀ Collapse Sidebar'}
</button>


        </div>
      </aside>
    </>
  );
};

export default Sidebar;
