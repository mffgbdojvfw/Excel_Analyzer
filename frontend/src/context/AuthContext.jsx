
import React, { createContext, useEffect, useState, useContext } from 'react';
import { loginUser } from '../api/api';

const AuthContext = createContext();

// Utility to fix relative image URL
const fixUserImage = (user) => {
  if (user?.profileImage && !user.profileImage.startsWith('http')) {
    return {
      ...user,
      profileImage: `https://excel-analyzer-ddbp.onrender.com${user.profileImage}`,
    };
  }
  return user;
};

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);

  // useEffect(() => {
  //   const storedToken = localStorage.getItem('token');
  //   const storedUser = localStorage.getItem('user');
  //   if (storedToken && storedUser) {
  //     setToken(storedToken);
  //     setUser(fixUserImage(JSON.parse(storedUser))); // ✅ Patch here
  //   }
  //   setAuthLoading(false);
  // }, []);

   useEffect(() => {
  const storedToken = localStorage.getItem('token');
  const storedUser = localStorage.getItem('user');
  if (storedToken && storedUser) {
    const parsedUser = JSON.parse(storedUser);
    if (parsedUser.profileImage && !parsedUser.profileImage.startsWith('http')) {
      parsedUser.profileImage = `https://excel-analyzer-ddbp.onrender.com${parsedUser.profileImage}`;
    }
    setToken(storedToken);
    setUser(parsedUser);
  }
  setAuthLoading(false);
}, []);


  // const login = async (email, password) => {
  //   try {
  //     const res = await loginUser(email, password);
  //     const { token, user } = res.data;
  //     const fixedUser = fixUserImage(user); // ✅ Patch here

  //     setToken(token);
  //     setUser(fixedUser);
  //     localStorage.setItem('token', token);
  //     localStorage.setItem('user', JSON.stringify(fixedUser));
  //     return true;
  //   } catch (err) {
  //     console.error('Login failed:', err);
  //     return false;
  //   }
  // };
  const login = async (email, password) => {
  try {
    const res = await loginUser(email, password);
    const { token, user } = res.data;

    // FIX: Ensure full image URL
    if (user.profileImage && !user.profileImage.startsWith('http')) {
      user.profileImage = `https://excel-analyzer-ddbp.onrender.com${user.profileImage}`;
    }

    setToken(token);
    setUser(user);
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user)); // ✅ Store with full URL

    return true;
  } catch (err) {
    console.error('Login failed:', err);
    return false;
  }
};


  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/';
  };

  const updateUser = (newData) => {
  const updated = { ...user, ...newData };

  // FIX: full URL on update
  if (updated.profileImage && !updated.profileImage.startsWith('http')) {
    updated.profileImage = `https://excel-analyzer-ddbp.onrender.com${updated.profileImage}`;
  }

  setUser(updated);
  localStorage.setItem('user', JSON.stringify(updated));
};


  return (
    <AuthContext.Provider value={{ token, user, login, logout, setUser, updateUser, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
