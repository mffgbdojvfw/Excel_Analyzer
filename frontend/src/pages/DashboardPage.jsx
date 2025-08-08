
// import React, { useEffect, useState } from 'react';
// import Sidebar from '../components/Sidebar';
// import {
//   getAllFilesAdmin,
//   getAllUsers,
//   getSystemAlerts,
// } from '../api/api';
// import { useAuth } from '../context/AuthContext';
// import { useNavigate } from 'react-router-dom';
// import {
//   FileBarChart,
//   Users,
//   FileBarChart2,
// } from 'lucide-react';
// import {
//   LineChart,
//   Line,
//   XAxis,
//   YAxis,
//   Tooltip,
//   CartesianGrid,
//   ResponsiveContainer,
//   BarChart,
//   Bar,
// } from 'recharts';

// const Dashboard = () => {
//   const [fileCount, setFileCount] = useState(0);
//   const [userCount, setUserCount] = useState(0);
//   const [alerts, setAlerts] = useState([]);
//   const [uploadTrendData, setUploadTrendData] = useState([]);
//   const [signupTrendData, setSignupTrendData] = useState([]);
//   const [fileSizeData, setFileSizeData] = useState([]);
//   const [chartRange, setChartRange] = useState('weekly');
//   const [signupChartRange, setSignupChartRange] = useState('weekly');
//   const [systemOnline, setSystemOnline] = useState(true);
//   const { user } = useAuth();
//   const navigate = useNavigate();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const pingSystem = async () => {
//       try {
//         await getAllUsers(token);
//         setSystemOnline(true);
//       } catch (err) {
//         setSystemOnline(false);
//       }
//     };
//     pingSystem();
//     const interval = setInterval(pingSystem, 15000);
//     return () => clearInterval(interval);
//   }, []);

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     const fetchData = async () => {
//       try {
//         const fileRes = await getAllFilesAdmin(token);
//         const files = fileRes.data.files || [];
//         setFileCount(files.length);

//         const now = new Date();
//         const fileBuckets = {};
//         const sizeBuckets = {
//           '< 100 KB': 0,
//           '100–500 KB': 0,
//           '500KB – 1MB': 0,
//           '> 1MB': 0,
//         };

//         for (let i = 6; i >= 0; i--) {
//           const d = new Date(now);
//           d.setDate(now.getDate() - i);
//           const label = d.toLocaleDateString('en-US', { weekday: 'short' });
//           fileBuckets[label] = 0;
//         }

//         files.forEach((file) => {
//           const uploaded = new Date(file.uploadedAt);
//           const label = uploaded.toLocaleDateString('en-US', { weekday: 'short' });
//           if (label in fileBuckets) fileBuckets[label]++;

//           const sizeKB = file.size / 1024;
//           if (sizeKB < 100) sizeBuckets['< 100 KB']++;
//           else if (sizeKB < 500) sizeBuckets['100–500 KB']++;
//           else if (sizeKB < 1024) sizeBuckets['500KB – 1MB']++;
//           else sizeBuckets['> 1MB']++;
//         });

//         setUploadTrendData(Object.entries(fileBuckets).map(([day, uploads]) => ({ day, uploads })));
//         setFileSizeData(Object.entries(sizeBuckets).map(([bucket, count]) => ({ bucket, count })));

//         const userRes = await getAllUsers(token);
//         const users = userRes.data.users || [];
//         setUserCount(users.length);

//         const userBuckets = {};
//         if (signupChartRange === 'weekly') {
//           for (let i = 6; i >= 0; i--) {
//             const d = new Date(now);
//             d.setDate(now.getDate() - i);
//             const label = d.toLocaleDateString('en-US', { weekday: 'short' });
//             userBuckets[label] = 0;
//           }

//           users.forEach((u) => {
//             const created = new Date(u.createdAt);
//             const label = created.toLocaleDateString('en-US', { weekday: 'short' });
//             if (label in userBuckets) userBuckets[label]++;
//           });
//         } else if (signupChartRange === 'monthly') {
//           for (let i = 29; i >= 0; i--) {
//             const d = new Date(now);
//             d.setDate(now.getDate() - i);
//             const label = d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
//             userBuckets[label] = 0;
//           }

//           users.forEach((u) => {
//             const created = new Date(u.createdAt);
//             const label = created.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
//             if (label in userBuckets) userBuckets[label]++;
//           });
//         } else if (signupChartRange === 'yearly') {
//           for (let i = 11; i >= 0; i--) {
//             const d = new Date(now);
//             d.setMonth(now.getMonth() - i);
//             const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
//             userBuckets[label] = 0;
//           }

//           users.forEach((u) => {
//             const created = new Date(u.createdAt);
//             const label = created.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
//             if (label in userBuckets) userBuckets[label]++;
//           });
//         }

//         setSignupTrendData(Object.entries(userBuckets).map(([day, count]) => ({ day, count })));

//         const alertRes = await getSystemAlerts(token);
//         setAlerts(alertRes.data.alerts.slice(0, 3));
//       } catch (err) {
//         console.error('Dashboard load error:', err);
//       }
//     };

//     fetchData();
//   }, [chartRange, signupChartRange]);

//   return (
//     <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white">
//       <Sidebar />
//       <main className="w-full ml-0 lg:ml-64 px-4 sm:px-6 py-8 space-y-10 animate-fade-in">
//         {/* Header */}
//         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//           <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
//             📊 Dashboard Overview
//           </h1>
//           <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium bg-green-900 text-green-400 text-sm">
//             <span className="relative flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
//             </span>
//             Online
//           </span>
//         </div>

//         <p className="text-slate-400 text-sm sm:text-base">
//           Welcome back, <span className="font-semibold text-white">{user?.name}</span>!
//         </p>

//         {/* Info Cards */}
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
//           {[{
//             icon: <FileBarChart className="w-5 h-5 animate-pulse" />,
//             label: 'Files Uploaded',
//             value: fileCount,
//             bg: 'bg-blue-900/50',
//             color: 'text-blue-400',
//             border: 'border-blue-600',
//             valueColor: 'text-blue-500'
//           }, {
//             icon: <Users className="w-5 h-5 animate-pulse" />,
//             label: 'Total Users',
//             value: userCount,
//             bg: 'bg-indigo-900/50',
//             color: 'text-indigo-400',
//             border: 'border-indigo-500',
//             valueColor: 'text-indigo-500'
//           }].map(({ icon, label, value, bg, color, border, valueColor }) => (
//             <div key={label} className={`bg-slate-900 p-5 rounded-xl border ${border} shadow-md`}>
//               <div className={`flex items-center gap-3 mb-2 ${color}`}>
//                 <div className={`${bg} p-2 rounded-full`}>{icon}</div>
//                 <h2 className="text-lg font-medium">{label}</h2>
//               </div>
//               <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
//             </div>
//           ))}
//         </div>

//         {/* Upload Trend */}
//         <section className="bg-slate-900 p-5 rounded-xl border border-cyan-500/30 shadow-md">
//           <div className="flex justify-between items-center mb-3">
//             <h2 className="text-lg font-semibold text-cyan-400">📈 Upload Trend</h2>
//             <select
//               value={chartRange}
//               onChange={(e) => setChartRange(e.target.value)}
//               className="bg-slate-800 text-white border border-slate-600 rounded px-2 py-1 text-sm"
//             >
//               <option value="weekly">Weekly</option>
//               <option value="monthly">Monthly</option>
//               <option value="yearly">Yearly</option>
//             </select>
//           </div>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={uploadTrendData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
//                 <XAxis dataKey="day" stroke="#94a3b8" />
//                 <YAxis stroke="#94a3b8" allowDecimals={false} />
//                 <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
//                 <Line type="monotone" dataKey="uploads" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </section>

//         {/* Signup Trend */}
//         <section className="bg-slate-900 p-5 rounded-xl border border-emerald-500/30 shadow-md">
//           <div className="flex justify-between items-center mb-3">
//             <h2 className="text-lg font-semibold text-emerald-400">📅 User Signups</h2>
//             <select
//               value={signupChartRange}
//               onChange={(e) => setSignupChartRange(e.target.value)}
//               className="bg-slate-800 text-white border border-slate-600 rounded px-2 py-1 text-sm"
//             >
//               <option value="weekly">Weekly</option>
//               <option value="monthly">Monthly</option>
//               <option value="yearly">Yearly</option>
//             </select>
//           </div>
//           <div className="h-64">
//             <ResponsiveContainer width="100%" height="100%">
//               <LineChart data={signupTrendData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
//                 <XAxis dataKey="day" stroke="#94a3b8" />
//                 <YAxis stroke="#94a3b8" allowDecimals={false} />
//                 <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
//                 <Line type="monotone" dataKey="count" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} />
//               </LineChart>
//             </ResponsiveContainer>
//           </div>
//         </section>

//         {/* File Size Distribution */}
//         <section className="bg-slate-900 p-5 rounded-xl border border-fuchsia-500/30 shadow-md">
//           <h2 className="text-lg font-semibold text-fuchsia-400 mb-3 flex items-center gap-2">
//             <FileBarChart2 className="w-5 h-5" /> File Size Distribution
//           </h2>
//           <div className="h-72">
//             <ResponsiveContainer width="100%" height="100%">
//               <BarChart data={fileSizeData}>
//                 <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
//                 <XAxis dataKey="bucket" stroke="#94a3b8" />
//                 <YAxis stroke="#94a3b8" allowDecimals={false} />
//                 <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
//                 <Bar dataKey="count" fill="url(#fileGradient)" radius={[4, 4, 0, 0]} />
//                 <defs>
//                   <linearGradient id="fileGradient" x1="0" y1="0" x2="0" y2="1">
//                     <stop offset="0%" stopColor="#f0abfc" stopOpacity={1} />
//                     <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
//                   </linearGradient>
//                 </defs>
//               </BarChart>
//             </ResponsiveContainer>
//           </div>
//         </section>
//       </main>
//     </div>
//   );
// };

// export default Dashboard;




import React, { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import {
  getAllFilesAdmin,
  getAllUsers,
  getSystemAlerts,
} from '../api/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  FileBarChart,
  Users,
  FileBarChart2,
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from 'recharts';

const Dashboard = () => {
  const [fileCount, setFileCount] = useState(0);
  const [userCount, setUserCount] = useState(0);
  const [alerts, setAlerts] = useState([]);
  const [uploadTrendData, setUploadTrendData] = useState([]);
  const [signupTrendData, setSignupTrendData] = useState([]);
  const [fileSizeData, setFileSizeData] = useState([]);
  const [chartRange, setChartRange] = useState('weekly');
  const [signupChartRange, setSignupChartRange] = useState('weekly');
  const [systemOnline, setSystemOnline] = useState(true);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const pingSystem = async () => {
      try {
        await getAllUsers(token);
        setSystemOnline(true);
      } catch (err) {
        setSystemOnline(false);
      }
    };
    pingSystem();
    const interval = setInterval(pingSystem, 15000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const fetchData = async () => {
      try {
        const fileRes = await getAllFilesAdmin(token);
        const files = fileRes.data.files || [];
        setFileCount(files.length);

        const now = new Date();
        const fileBuckets = {};
        const sizeBuckets = {
          '< 100 KB': 0,
          '100–500 KB': 0,
          '500KB – 1MB': 0,
          '> 1MB': 0,
        };

        if (chartRange === 'weekly') {
          for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const label = d.toLocaleDateString('en-US', { weekday: 'short' });
            fileBuckets[label] = 0;
          }

          files.forEach((file) => {
            const uploaded = new Date(file.uploadedAt);
            const label = uploaded.toLocaleDateString('en-US', { weekday: 'short' });
            if (label in fileBuckets) fileBuckets[label]++;

            const sizeKB = file.size / 1024;
            if (sizeKB < 100) sizeBuckets['< 100 KB']++;
            else if (sizeKB < 500) sizeBuckets['100–500 KB']++;
            else if (sizeKB < 1024) sizeBuckets['500KB – 1MB']++;
            else sizeBuckets['> 1MB']++;
          });
        } else if (chartRange === 'monthly') {
          for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const label = d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
            fileBuckets[label] = 0;
          }

          files.forEach((file) => {
            const uploaded = new Date(file.uploadedAt);
            const label = uploaded.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
            if (label in fileBuckets) fileBuckets[label]++;

            const sizeKB = file.size / 1024;
            if (sizeKB < 100) sizeBuckets['< 100 KB']++;
            else if (sizeKB < 500) sizeBuckets['100–500 KB']++;
            else if (sizeKB < 1024) sizeBuckets['500KB – 1MB']++;
            else sizeBuckets['> 1MB']++;
          });
        } else if (chartRange === 'yearly') {
          for (let i = 11; i >= 0; i--) {
            const d = new Date(now);
            d.setMonth(now.getMonth() - i);
            const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            fileBuckets[label] = 0;
          }

          files.forEach((file) => {
            const uploaded = new Date(file.uploadedAt);
            const label = uploaded.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            if (label in fileBuckets) fileBuckets[label]++;

            const sizeKB = file.size / 1024;
            if (sizeKB < 100) sizeBuckets['< 100 KB']++;
            else if (sizeKB < 500) sizeBuckets['100–500 KB']++;
            else if (sizeKB < 1024) sizeBuckets['500KB – 1MB']++;
            else sizeBuckets['> 1MB']++;
          });
        }

        setUploadTrendData(Object.entries(fileBuckets).map(([day, uploads]) => ({ day, uploads })));
        setFileSizeData(Object.entries(sizeBuckets).map(([bucket, count]) => ({ bucket, count })));

        const userRes = await getAllUsers(token);
        const users = userRes.data.users || [];
        setUserCount(users.length);

        const userBuckets = {};
        if (signupChartRange === 'weekly') {
          for (let i = 6; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const label = d.toLocaleDateString('en-US', { weekday: 'short' });
            userBuckets[label] = 0;
          }

          users.forEach((u) => {
            const created = new Date(u.createdAt);
            const label = created.toLocaleDateString('en-US', { weekday: 'short' });
            if (label in userBuckets) userBuckets[label]++;
          });
        } else if (signupChartRange === 'monthly') {
          for (let i = 29; i >= 0; i--) {
            const d = new Date(now);
            d.setDate(now.getDate() - i);
            const label = d.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
            userBuckets[label] = 0;
          }

          users.forEach((u) => {
            const created = new Date(u.createdAt);
            const label = created.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
            if (label in userBuckets) userBuckets[label]++;
          });
        } else if (signupChartRange === 'yearly') {
          for (let i = 11; i >= 0; i--) {
            const d = new Date(now);
            d.setMonth(now.getMonth() - i);
            const label = d.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            userBuckets[label] = 0;
          }

          users.forEach((u) => {
            const created = new Date(u.createdAt);
            const label = created.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
            if (label in userBuckets) userBuckets[label]++;
          });
        }

        setSignupTrendData(Object.entries(userBuckets).map(([day, count]) => ({ day, count })));

        const alertRes = await getSystemAlerts(token);
        setAlerts(alertRes.data.alerts.slice(0, 3));
      } catch (err) {
        console.error('Dashboard load error:', err);
      }
    };

    fetchData();
  }, [chartRange, signupChartRange]);
    return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white">
      <Sidebar />
      <main className="w-full ml-0 lg:ml-64 px-4 sm:px-6 py-8 space-y-10 animate-fade-in">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-transparent bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text">
            📊 Dashboard Overview
          </h1>
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-medium bg-green-900 text-green-400 text-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-400"></span>
            </span>
            Online
          </span>
        </div>

        <p className="text-slate-400 text-sm sm:text-base">
          Welcome back, <span className="font-semibold text-white">{user?.name}</span>!
        </p>

        {/* Info Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[{
            icon: <FileBarChart className="w-5 h-5 animate-pulse" />,
            label: 'Files Uploaded',
            value: fileCount,
            bg: 'bg-blue-900/50',
            color: 'text-blue-400',
            border: 'border-blue-600',
            valueColor: 'text-blue-500'
          }, {
            icon: <Users className="w-5 h-5 animate-pulse" />,
            label: 'Total Users',
            value: userCount,
            bg: 'bg-indigo-900/50',
            color: 'text-indigo-400',
            border: 'border-indigo-500',
            valueColor: 'text-indigo-500'
          }].map(({ icon, label, value, bg, color, border, valueColor }) => (
            <div key={label} className={`bg-slate-900 p-5 rounded-xl border ${border} shadow-md`}>
              <div className={`flex items-center gap-3 mb-2 ${color}`}>
                <div className={`${bg} p-2 rounded-full`}>{icon}</div>
                <h2 className="text-lg font-medium">{label}</h2>
              </div>
              <p className={`text-3xl font-bold ${valueColor}`}>{value}</p>
            </div>
          ))}
        </div>

        {/* Upload Trend */}
        <section className="bg-slate-900 p-5 rounded-xl border border-cyan-500/30 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-cyan-400">📈 Upload Trend</h2>
            <select
              value={chartRange}
              onChange={(e) => setChartRange(e.target.value)}
              className="bg-slate-800 text-white border border-slate-600 rounded px-2 py-1 text-sm"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={uploadTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Line type="monotone" dataKey="uploads" stroke="#38bdf8" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Signup Trend */}
        <section className="bg-slate-900 p-5 rounded-xl border border-emerald-500/30 shadow-md">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-semibold text-emerald-400">📅 User Signups</h2>
            <select
              value={signupChartRange}
              onChange={(e) => setSignupChartRange(e.target.value)}
              className="bg-slate-800 text-white border border-slate-600 rounded px-2 py-1 text-sm"
            >
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={signupTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="day" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip contentStyle={{ backgroundColor: '#1e293b', borderColor: '#334155' }} />
                <Line type="monotone" dataKey="count" stroke="#34d399" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* File Size Distribution */}
        <section className="bg-slate-900 p-5 rounded-xl border border-fuchsia-500/30 shadow-md">
          <h2 className="text-lg font-semibold text-fuchsia-400 mb-3 flex items-center gap-2">
            <FileBarChart2 className="w-5 h-5" /> File Size Distribution
          </h2>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fileSizeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
                <XAxis dataKey="bucket" stroke="#94a3b8" />
                <YAxis stroke="#94a3b8" allowDecimals={false} />
                <Tooltip
  contentStyle={{
    backgroundColor: 'rgba(39, 39, 42, 0.9)', // dark with transparency
    border: '1px solid #f472b6',             // soft pink border
    borderRadius: '8px',
    boxShadow: '0 0 10px rgba(244, 114, 182, 0.3)', // pink glow
    color: '#fce7f3', // text pink-100
  }}
  cursor={{ fill: 'rgba(255, 255, 255, 0.05)' }} // subtle hover line
/>

               <Bar
  dataKey="count"
  fill="url(#fileGradient)"
  radius={[2,2, 0, 0]}
  barSize={60} // ⬅️ Decrease bar width
  activeBar={{
    fill: 'url(#fileGradient)',
    stroke: '#f0abfc',
    strokeWidth: 1,
    filter: 'drop-shadow(0 0 8px #f0abfc90)',
  }}
/>

                <defs>
                  <linearGradient id="fileGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#f0abfc" stopOpacity={1} />
                    <stop offset="100%" stopColor="#a855f7" stopOpacity={0.8} />
                  </linearGradient>
                </defs>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
