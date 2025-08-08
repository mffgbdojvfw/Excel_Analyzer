
// import React, { useEffect, useState } from 'react';
// import Sidebar from '../components/Sidebar';
// import { getAllUsers, getUserUploadCounts } from '../api/api';
// import { Users, BarChart,Plus,Ban,Trash2,FileText, } from 'lucide-react';

// const AdminPanel = () => {
//   const [users, setUsers] = useState([]);
//   const [uploadCounts, setUploadCounts] = useState([]);
//   const token = localStorage.getItem('token');

//   useEffect(() => {
//     fetchUsers();
//     fetchUploadCounts();
//   }, []);

//   const fetchUsers = async () => {
//     try {
//       const res = await getAllUsers(token);
//       setUsers(res.data.users);
//     } catch (err) {
//       console.error('Error fetching users', err);
//     }
//   };

//   const fetchUploadCounts = async () => {
//     try {
//       const res = await getUserUploadCounts(token);
//       setUploadCounts(res.data.data);
//     } catch (err) {
//       console.error('Error fetching upload counts:', err);
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white font-sans">
//       <Sidebar />
//       <main className="ml-20 lg:ml-64 w-full px-6 py-10 space-y-10 animate-fade-in">
//         <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-8 flex items-center gap-3 tracking-tight">
//           🛠️ Admin Control Panel
//         </h1>

//         {/* 📋 User Management */}
//         <section className="bg-slate-900 p-6 rounded-2xl border border-indigo-500/30 shadow-md shadow-indigo-500/10">
//           <div className="flex items-center mb-4 gap-2 text-indigo-300">
//             <Users className="w-6 h-6 animate-pulse" />
//             <h2 className="text-xl font-bold">User Management</h2>
//           </div>
//           <table className="min-w-full text-sm text-left border border-slate-700 rounded-xl overflow-hidden">
//             <thead className="bg-indigo-800 text-white">
//               <tr>
//                 <th className="px-4 py-3">Name</th>
//                 <th className="px-4 py-3">Email</th>
//                 <th className="px-4 py-3">Status</th>
//               </tr>
//             </thead>
//             <tbody className="bg-slate-800 text-white">
//               {users.map((u) => (
//                 <tr key={u._id} className="border-b border-slate-700 hover:bg-indigo-900/40 transition">
//                   <td className="px-4 py-3">{u.name}</td>
//                   <td className="px-4 py-3">{u.email}</td>
//                   <td className="px-4 py-3">
//                     <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${u.active ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'}`}>
//                       {u.active ? 'Active' : 'Inactive'}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>

//         {/* 📊 Upload Counts */}
//         <section className="bg-slate-900 p-6 rounded-2xl border border-cyan-500/30 shadow-md shadow-cyan-500/10">
//           <div className="flex items-center mb-4 gap-2 text-cyan-300">
//             <BarChart className="w-6 h-6 animate-pulse" />
//             <h2 className="text-xl font-bold">Uploads Per User</h2>
//           </div>
//           <table className="min-w-full text-sm text-left border border-slate-700 rounded-xl overflow-hidden">
//             <thead className="bg-cyan-800 text-white">
//               <tr>
//                 <th className="px-4 py-3">Name</th>
//                 <th className="px-4 py-3">Email</th>
//                 <th className="px-4 py-3">Upload Count</th>
//               </tr>
//             </thead>
//             <tbody className="bg-slate-800 text-white">
//               {uploadCounts.map((user) => (
//                 <tr key={user.userId} className="border-b border-slate-700 hover:bg-cyan-900/30 transition">
//                   <td className="px-4 py-3">{user.name}</td>
//                   <td className="px-4 py-3">{user.email}</td>
//                   <td className="px-4 py-3 font-semibold text-cyan-400">{user.count}</td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </section>

//         {/* 🧭 Admin Quick Actions */}
// <section className="mb-10">
//   <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
//     🧭 Admin Quick Actions
//   </h2>
//   <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
//     {/* ➕ Add New Admin */}
//     <button
//       onClick={() => alert('Add Admin triggered')}
//       className="bg-sky-900/50 hover:bg-sky-800 text-sky-300 hover:text-white border border-sky-500 px-4 py-3 rounded-xl flex flex-col items-center shadow-md hover:shadow-sky-500/20 transition"
//     >
//       <Plus className="w-6 h-6 mb-1" />
//       <span className="text-sm font-semibold">Add Admin</span>
//     </button>

//     {/* 🚫 Deactivate All Users */}
//     <button
//       onClick={() => alert('Deactivate All Users triggered')}
//       className="bg-red-900/50 hover:bg-red-800 text-red-300 hover:text-white border border-red-500 px-4 py-3 rounded-xl flex flex-col items-center shadow-md hover:shadow-red-500/20 transition"
//     >
//       <Ban className="w-6 h-6 mb-1" />
//       <span className="text-sm font-semibold">Deactivate All</span>
//     </button>

//     {/* 🧹 Clear Alerts */}
//     <button
//       onClick={() => alert('Clear Alerts triggered')}
//       className="bg-yellow-900/50 hover:bg-yellow-800 text-yellow-300 hover:text-white border border-yellow-500 px-4 py-3 rounded-xl flex flex-col items-center shadow-md hover:shadow-yellow-500/20 transition"
//     >
//       <Trash2 className="w-6 h-6 mb-1" />
//       <span className="text-sm font-semibold">Clear Alerts</span>
//     </button>

//     {/* 📊 Export Report */}
//     <button
//       onClick={() => alert('Export Report triggered')}
//       className="bg-green-900/50 hover:bg-green-800 text-green-300 hover:text-white border border-green-500 px-4 py-3 rounded-xl flex flex-col items-center shadow-md hover:shadow-green-500/20 transition"
//     >
//       <FileText className="w-6 h-6 mb-1" />
//       <span className="text-sm font-semibold">Export Report</span>
//     </button>
//   </div>
// </section>

//       </main>
//     </div>
//   );
// };

// export default AdminPanel;




import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { getAllUsers, getUserUploadCounts } from '../api/api';
import { Users, BarChart, Plus, LayoutDashboard, History, FileText } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
const AdminPanel = () => {
  const [users, setUsers] = useState([]);
  const [uploadCounts, setUploadCounts] = useState([]);
  const token = localStorage.getItem('token');
  const navigate = useNavigate()
  useEffect(() => {
    fetchUsers();
    fetchUploadCounts();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await getAllUsers(token);
      setUsers(res.data.users);
    } catch (err) {
      console.error('Error fetching users', err);
    }
  };

  const fetchUploadCounts = async () => {
    try {
      const res = await getUserUploadCounts(token);
      setUploadCounts(res.data.data);
    } catch (err) {
      console.error('Error fetching upload counts:', err);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white font-sans">
      <Sidebar />
      <main className="w-full px-4 py-10 space-y-10 transition-all duration-300 lg:ml-64">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-600 mb-8 flex items-center gap-3 tracking-tight">
          🛠️ Admin Control Panel
        </h1>

        

        {/* 📋 User Management */}
        <section className="bg-slate-900 p-6 rounded-2xl border border-indigo-500/30 shadow-md shadow-indigo-500/10 overflow-x-auto">
          <div className="flex items-center mb-4 gap-2 text-indigo-300">
            <Users className="w-6 h-6 animate-pulse" />
            <h2 className="text-xl font-bold">User Management</h2>
          </div>
          <table className="min-w-full text-sm text-left border border-slate-700 rounded-xl overflow-hidden">
            <thead className="bg-indigo-800 text-white">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 text-white">
              {users.map((u) => (
                <tr key={u._id} className="border-b border-slate-700 hover:bg-indigo-900/40 transition">
                  <td className="px-4 py-3">{u.name}</td>
                  <td className="px-4 py-3">{u.email}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                        u.active ? 'bg-green-900 text-green-400' : 'bg-red-900 text-red-400'
                      }`}
                    >
                      {u.active ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 📊 Upload Counts */}
        <section className="bg-slate-900 p-6 rounded-2xl border border-cyan-500/30 shadow-md shadow-cyan-500/10 overflow-x-auto">
          <div className="flex items-center mb-4 gap-2 text-cyan-300">
            <BarChart className="w-6 h-6 animate-pulse" />
            <h2 className="text-xl font-bold">Uploads Per User</h2>
          </div>
          <table className="min-w-full text-sm text-left border border-slate-700 rounded-xl overflow-hidden">
            <thead className="bg-cyan-800 text-white">
              <tr>
                <th className="px-4 py-3">Name</th>
                <th className="px-4 py-3">Email</th>
                <th className="px-4 py-3">Upload Count</th>
              </tr>
            </thead>
            <tbody className="bg-slate-800 text-white">
              {uploadCounts.map((user) => (
                <tr key={user.userId} className="border-b border-slate-700 hover:bg-cyan-900/30 transition">
                  <td className="px-4 py-3">{user.name}</td>
                  <td className="px-4 py-3">{user.email}</td>
                  <td className="px-4 py-3 font-semibold text-cyan-400">{user.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        {/* 🧭 Admin Navigation */}  
<section className="mb-10">
  <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
    🧭 Admin Navigation
  </h2>
  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
     <div
      onClick={() => navigate('/dashboard')}
      className="cursor-pointer bg-emerald-900/50 hover:bg-emerald-800 text-emerald-300 hover:text-white border border-emerald-500 px-4 py-5 rounded-xl flex flex-col items-center shadow-md hover:shadow-emerald-500/30 transition"
    >
      <LayoutDashboard className="w-6 h-6 mb-2" />
      <span className="text-sm font-semibold">Dashboard</span>
    </div>

    <div
      onClick={() => navigate('/upload')}
      className="cursor-pointer bg-blue-900/50 hover:bg-blue-800 text-blue-300 hover:text-white border border-blue-500 px-4 py-5 rounded-xl flex flex-col items-center shadow-md hover:shadow-blue-500/30 transition"
    >
      <BarChart className="w-6 h-6 mb-2" />
      <span className="text-sm font-semibold">Upload Stats</span>
    </div>

    <div
      onClick={() => navigate('/admin')}
      className="cursor-pointer bg-yellow-900/50 hover:bg-yellow-800 text-yellow-300 hover:text-white border border-yellow-500 px-4 py-5 rounded-xl flex flex-col items-center shadow-md hover:shadow-yellow-500/30 transition"
    >
      <History className="w-6 h-6 mb-2" />
      <span className="text-sm font-semibold">File History</span>
    </div>

   

    <div
      onClick={() => navigate('/profile')}
      className="cursor-pointer bg-indigo-900/50 hover:bg-indigo-800 text-indigo-300 hover:text-white border border-indigo-500 px-4 py-5 rounded-xl flex flex-col items-center shadow-md hover:shadow-indigo-500/30 transition"
    >
      <Users className="w-6 h-6 mb-2" />
      <span className="text-sm font-semibold">User-Profile</span>
    </div>
  </div>
</section>

      </main>
    </div>
  );
};

export default AdminPanel;



