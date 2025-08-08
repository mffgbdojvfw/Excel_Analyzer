

// import React, { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { registerUser } from '../api/api';
// import { useAuth } from '../context/AuthContext';
// import { UserPlus, Mail, Lock } from 'lucide-react';

// const RegisterPage = () => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const { setUser } = useAuth();
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const res = await registerUser({ name, email, password, role: 'user' });
//       const { token, user } = res.data;
//       localStorage.setItem('token', token);
//       localStorage.setItem('user', JSON.stringify(user));
//       setUser(user);
//       navigate('/upload');
//     } catch (err) {
//       alert(err?.response?.data?.message || 'Registration failed');
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-950 text-white px-4">
//       <form
//         onSubmit={handleSubmit}
//         className="bg-slate-900 w-full max-w-md shadow-xl p-8 rounded-2xl border border-slate-700 backdrop-blur-lg animate-fade-in"
//       >
//         <h2 className="text-3xl font-extrabold text-center text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-500 mb-6 flex items-center justify-center gap-2">
//           <UserPlus size={28} className="text-blue-400 animate-pulse" /> Register
//         </h2>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-cyan-300 mb-1 flex items-center gap-1">
//             <UserPlus size={16} /> Name
//           </label>
//           <input
//             type="text"
//             placeholder="Enter your name"
//             value={name}
//             onChange={e => setName(e.target.value)}
//             required
//             className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           />
//         </div>

//         <div className="mb-4">
//           <label className="block text-sm font-medium text-cyan-300 mb-1 flex items-center gap-1">
//             <Mail size={16} /> Email
//           </label>
//           <input
//             type="email"
//             placeholder="Enter your email"
//             value={email}
//             onChange={e => setEmail(e.target.value)}
//             required
//             className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           />
//         </div>

//         <div className="mb-6">
//           <label className="block text-sm font-medium text-cyan-300 mb-1 flex items-center gap-1">
//             <Lock size={16} /> Password
//           </label>
//           <input
//             type="password"
//             placeholder="Enter your password"
//             value={password}
//             onChange={e => setPassword(e.target.value)}
//             required
//             className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-gradient-to-r from-indigo-600 to-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-xl flex justify-center items-center gap-2 transition-all duration-300 hover:scale-105"
//         >
//           <UserPlus size={18} /> Register
//         </button>

//         <p className="mt-6 text-center text-sm text-gray-400">
//           Already have an account?{' '}
//           <Link to="/" className="text-blue-400 hover:underline font-medium">
//             Login
//           </Link>
//         </p>
//       </form>
//     </div>
//   );
// };

// export default RegisterPage;


import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../api/api';
import { useAuth } from '../context/AuthContext';
import { UserPlus, Mail, Lock } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { setUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await registerUser({ name, email, password, role: 'user' });
      const { token, user } = res.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(user));
      setUser(user);
      navigate('/upload');
    } catch (err) {
      alert(err?.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-950 text-white px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 w-full max-w-md shadow-xl p-8 rounded-2xl border border-slate-700 backdrop-blur-lg animate-fade-in"
      >
        {/* Title */}
        <h2 className="text-4xl font-extrabold text-center mb-6 relative pt-2 min-h-[56px]">
          <div className="flex items-center justify-center gap-2 leading-relaxed">
            <UserPlus size={28} className="text-purple-400 animate-pulse" />
            <span className="bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent leading-[1.3]">
              Register
            </span>
          </div>
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-cyan-300 mb-1 flex items-center gap-1">
            <UserPlus size={16} /> Name
          </label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-cyan-300 mb-1 flex items-center gap-1">
            <Mail size={16} /> Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-cyan-300 mb-1 flex items-center gap-1">
            <Lock size={16} /> Password
          </label>
          <input
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 bg-slate-800 text-white border border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-purple-600 to-blue-700 hover:to-blue-800 text-white font-semibold py-2 rounded-xl flex justify-center items-center gap-2 transition-all duration-300 hover:scale-105"
        >
          <UserPlus size={18} /> Register
        </button>

        {/* Link to Login */}
        <p className="mt-6 text-center text-sm text-gray-400">
          Already have an account?{' '}
          <Link to="/" className="text-blue-400 hover:underline font-medium">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default RegisterPage;
