
// import React, { useRef, useState } from 'react';
// import Sidebar from '../components/Sidebar';
// import { useAuth } from '../context/AuthContext';
// import { User, Mail, Shield, Pencil } from 'lucide-react';
// import { uploadProfileImage } from '../api/api';

// const UserProfile = () => {
//   const { user, updateUser } = useAuth();
//   const [preview, setPreview] = useState(user?.profileImage || null);
//   const fileInputRef = useRef();

//   const handleImageChange = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;

//     setPreview(URL.createObjectURL(file));

//     try {
//       const token = localStorage.getItem('token');
//       const res = await uploadProfileImage(file, token);
//       const updatedUser = res.data.user;
//       const fullImagePath = `http://localhost:5678${updatedUser.profileImage}`;

//       updateUser({ ...updatedUser, profileImage: fullImagePath });
//       localStorage.setItem('user', JSON.stringify({ ...updatedUser, profileImage: fullImagePath }));
//       setPreview(fullImagePath);
//     } catch (err) {
//       console.error('Upload failed', err);
//       alert('Failed to upload profile image');
//     }
//   };

//   return (
//   <div className="flex min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white animate-fade-in">
//     <Sidebar />
//     <main className="ml-20 lg:ml-64 w-full px-6 py-12 flex flex-col items-center">
//       {/* Heading */}
//       <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-8 animate-slide-down">
//         👤 User Profile
//       </h1>

//       {/* Profile Image */}
//       <div className="relative group bg-slate-900 p-6 rounded-2xl border-2 border-yellow-500 shadow-lg hover:shadow-yellow-500/40 transition-all duration-300 animate-fade-in">
//         <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto relative">
//           <img
//             src={preview || '/default-avatar.png'}
//             alt="Profile"
//             className="w-full h-full object-cover rounded-full border-4 border-yellow-500"
//           />
//           <button
//             onClick={() => fileInputRef.current.click()}
//             className="absolute bottom-2 right-2 bg-yellow-500 p-2 rounded-full shadow-md hover:bg-yellow-400 transition"
//           >
//             <Pencil className="w-5 h-5 text-black" />
//           </button>
//         </div>
//         <input
//           type="file"
//           accept="image/*"
//           ref={fileInputRef}
//           onChange={handleImageChange}
//           className="hidden"
//         />
//         <p className="text-center mt-4 text-yellow-300 text-sm">Click ✎ to update image</p>
//       </div>

//       {/* User Info Cards */}
//       {user && (
//         <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 px-4 animate-fade-in">
//           {/* Email */}
//           <div className="bg-slate-900 p-6 rounded-xl border border-green-500 shadow-md hover:shadow-green-500/30 transition duration-300">
//             <div className="flex items-center gap-3 text-green-400 mb-3">
//               <Mail className="w-5 h-5" />
//               <h2 className="text-lg font-semibold">Email</h2>
//             </div>
//             <p className="text-slate-300 break-all">{user.email}</p>
//           </div>

//           {/* User ID */}
//           <div className="bg-slate-900 p-6 rounded-xl border border-blue-600 shadow-md hover:shadow-blue-500/30 transition duration-300">
//             <div className="flex items-center gap-3 text-blue-400 mb-3">
//               <User className="w-5 h-5" />
//               <h2 className="text-lg font-semibold">User ID</h2>
//             </div>
//             <p className="text-slate-300 break-all">{user.userId || user.id}</p>
//           </div>

//           {/* Role */}
//           <div className="col-span-1 md:col-span-2 bg-slate-900 p-6 rounded-xl border border-purple-500 shadow-md hover:shadow-purple-500/30 transition duration-300">
//             <div className="flex items-center gap-3 text-purple-400 mb-3">
//               <Shield className="w-5 h-5" />
//               <h2 className="text-lg font-semibold">Role</h2>
//             </div>
//             <p className="capitalize text-slate-300">{user.role}</p>
//           </div>
//         </div>
//       )}

//       {!user && (
//         <p className="text-red-400 text-lg mt-10 animate-slide-down">
//           ⚠️ No user data available. Please log in.
//         </p>
//       )}
//     </main>
//   </div>
// );
// };

// export default UserProfile;





import React, { useRef, useState } from 'react';
import Sidebar from '../components/Sidebar';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Shield, Pencil, Trash2 } from 'lucide-react';
import { uploadProfileImage, deleteProfileImage } from '../api/api';

const UserProfile = () => {
  const { user, updateUser } = useAuth();
  const [preview, setPreview] = useState(user?.profileImage || null);
  const fileInputRef = useRef();

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));

    try {
      const token = localStorage.getItem('token');
      const res = await uploadProfileImage(file, token);
      const updatedUser = res.data.user;
      const fullImagePath = `http://localhost:5678${updatedUser.profileImage}`;

      updateUser({ ...updatedUser, profileImage: fullImagePath });
      localStorage.setItem('user', JSON.stringify({ ...updatedUser, profileImage: fullImagePath }));
      setPreview(fullImagePath);
    } catch (err) {
      console.error('Upload failed', err);
      alert('Failed to upload profile image');
    }
  };

  const handleDeleteImage = async () => {
    try {
      const token = localStorage.getItem('token');
      await deleteProfileImage(token);

      updateUser({ ...user, profileImage: null });
      localStorage.setItem('user', JSON.stringify({ ...user, profileImage: null }));
      setPreview(null);
    } catch (err) {
      console.error('Failed to delete profile image:', err);
      alert('Failed to delete profile image');
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white animate-fade-in">
      <Sidebar />
      <main className="ml-20 lg:ml-64 w-full px-6 py-12 flex flex-col items-center">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-600 mb-8 animate-slide-down">
          👤 User Profile
        </h1>

        {/* Profile Image */}
        <div className="relative group bg-slate-900 p-6 rounded-2xl border-2 border-yellow-500 shadow-lg hover:shadow-yellow-500/40 transition-all duration-300 animate-fade-in">
          <div className="w-40 h-40 sm:w-48 sm:h-48 mx-auto relative">
            {preview ? (
              <img
                src={preview}
                alt="Profile"
                className="w-full h-full object-cover rounded-full border-4 border-yellow-500"
              />
            ) : (
              <div className="w-full h-full bg-slate-800 flex items-center justify-center rounded-full border-4 border-yellow-500">
                <User className="w-16 h-16 text-yellow-300" />
              </div>
            )}

            {/* Upload Button */}
            <button
              onClick={() => fileInputRef.current.click()}
              className="absolute bottom-2 right-2 bg-yellow-500 p-2 rounded-full shadow-md hover:bg-yellow-400 transition"
            >
              <Pencil className="w-5 h-5 text-black" />
            </button>

            {/* Delete Button */}
            {preview && (
              <button
                onClick={handleDeleteImage}
                className="absolute bottom-2 left-2 bg-red-500 p-2 rounded-full shadow-md hover:bg-red-400 transition"
              >
                <Trash2 className="w-5 h-5 text-white" />
              </button>
            )}
          </div>

          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleImageChange}
            className="hidden"
          />
          <p className="text-center mt-4 text-yellow-300 text-sm">Click ✎ to update image</p>
        </div>

        {/* User Info */}
        {user ? (
          <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 px-4 animate-fade-in">
            <div className="bg-slate-900 p-6 rounded-xl border border-green-500 shadow-md hover:shadow-green-500/30 transition duration-300">
              <div className="flex items-center gap-3 text-green-400 mb-3">
                <Mail className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Email</h2>
              </div>
              <p className="text-slate-300 break-all">{user.email}</p>
            </div>

            <div className="bg-slate-900 p-6 rounded-xl border border-blue-600 shadow-md hover:shadow-blue-500/30 transition duration-300">
              <div className="flex items-center gap-3 text-blue-400 mb-3">
                <User className="w-5 h-5" />
                <h2 className="text-lg font-semibold">User ID</h2>
              </div>
              <p className="text-slate-300 break-all">{user.userId || user.id}</p>
            </div>

            <div className="col-span-1 md:col-span-2 bg-slate-900 p-6 rounded-xl border border-purple-500 shadow-md hover:shadow-purple-500/30 transition duration-300">
              <div className="flex items-center gap-3 text-purple-400 mb-3">
                <Shield className="w-5 h-5" />
                <h2 className="text-lg font-semibold">Role</h2>
              </div>
              <p className="capitalize text-slate-300">{user.role}</p>
            </div>
          </div>
        ) : (
          <p className="text-red-400 text-lg mt-10 animate-slide-down">
            ⚠️ No user data available. Please log in.
          </p>
        )}
      </main>
    </div>
  );
};

export default UserProfile;
