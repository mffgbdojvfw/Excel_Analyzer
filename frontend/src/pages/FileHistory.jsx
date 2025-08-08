



import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import {
  getAllFilesAdmin,
  getFileHistory,
  deleteFileAdmin,
  getBase64FileById,
  deleteUserFile
} from '../api/api';

import {
  FileText,
  CalendarClock,
  RefreshCw,
  Download,
  Trash2,
  Search,
  Filter,
  FileSearch,
} from 'lucide-react';

const FileHistory = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [loadingId, setLoadingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const token = localStorage.getItem('token');
        const user = JSON.parse(localStorage.getItem('user'));
        setIsAdmin(user?.role === 'admin');
        const res = user?.role === 'admin' ? await getAllFilesAdmin(token) : await getFileHistory(token);
        setHistory(res.data.files || []);
      } catch (err) {
        console.error('Failed to fetch history:', err);
      }
    };
    fetchHistory();
  }, []);

  const getFilteredHistory = () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    return history
      .filter((item) => {
        const date = new Date(item.uploadedAt);
        if (filter === 'today') return date.toDateString() === today.toDateString();
        if (filter === 'yesterday') return date.toDateString() === yesterday.toDateString();
        return true;
      })
      .filter((item) => {
        const date = new Date(item.uploadedAt);
        const inRange =
          (!startDate || date >= new Date(startDate)) &&
          (!endDate || date <= new Date(endDate));
        const name = (item.originalName || item.filename || '').toLowerCase();
        return inRange && name.includes(searchTerm.toLowerCase());
      });
  };

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this file?")) return;
  //   try {
  //     const token = localStorage.getItem('token');
  //     setLoadingId(id);
  //     await deleteFileAdmin(id, token);
  //     setHistory(history.filter((file) => file._id !== id));
  //   } catch (err) {
  //     console.error("Failed to delete file:", err);
  //     alert('Delete failed');
  //   } finally {
  //     setLoadingId(null);
  //   }
  // };

  const handleDelete = async (id) => {
  if (!window.confirm("Are you sure you want to delete this file?")) return;
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));
    setLoadingId(id);

    if (user?.role === 'admin') {
      await deleteFileAdmin(id, token);
    } else {
      await deleteUserFile(id, token);
    }

    setHistory((prev) => prev.filter((file) => file._id !== id));
  } catch (err) {
    console.error("Delete error:", err.response?.data || err.message);
    alert(err.response?.data?.error || 'Delete failed');
  } finally {
    setLoadingId(null);
  }
};


  const handleReload = async (item) => {
    try {
      const token = localStorage.getItem('token');
      setLoadingId(item._id);
      const res = await getBase64FileById(item._id, token);
      const { base64, name } = res.data;
      navigate('/upload', {
        state: {
          base64,
          name: name || item.originalName || item.filename || 'file.xlsx',
        },
      });
    } catch (err) {
      console.error('Reload failed:', err);
      alert('Failed to reload file.');
    } finally {
      setLoadingId(null);
    }
  };

  const handleDownload = async (id, filename) => {
    try {
      const token = localStorage.getItem('token');
      setLoadingId(id);
      const res = await fetch(`http://localhost:5678/api/uploads/download/${id}`, {
        method: 'GET',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = filename || 'file.xlsx';
      a.click();
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error('Download failed:', err);
      alert('Download failed');
    } finally {
      setLoadingId(null);
    }
  };

  const handleSelect = (id) => {
    setSelectedFiles((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // const handleBulkDelete = async () => {
  //   if (!window.confirm('Delete selected files?')) return;
  //   try {
  //     const token = localStorage.getItem('token');
  //     for (let id of selectedFiles) {
  //       await deleteFileAdmin(id, token);
  //     }
  //     setHistory(history.filter((f) => !selectedFiles.includes(f._id)));
  //     setSelectedFiles([]);
  //   } catch (err) {
  //     console.error("Bulk delete failed", err);
  //   }
  // };



  const handleBulkDelete = async () => {
  if (!window.confirm('Delete selected files?')) return;
  try {
    const token = localStorage.getItem('token');
    const user = JSON.parse(localStorage.getItem('user'));

    for (let id of selectedFiles) {
      if (user?.role === 'admin') {
        await deleteFileAdmin(id, token);
      } else {
        await deleteUserFile(id, token);
      }
    }

    setHistory(history.filter((f) => !selectedFiles.includes(f._id)));
    setSelectedFiles([]);
  } catch (err) {
    console.error("Bulk delete failed", err);
  }
};


  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white">
      <Sidebar />
      <main className="ml-20 lg:ml-64 w-full px-4 sm:px-6 py-8 space-y-8 animate-fade-in">
        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-violet-600 flex items-center gap-3">
          <FileText className="text-indigo-400" /> File Upload History
        </h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-2 sm:gap-4">
          {['all', 'today', 'yesterday'].map((f) => (
            <button
              key={f}
              className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 transition ${
                filter === f
                  ? 'bg-indigo-700 text-white'
                  : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
              }`}
              onClick={() => setFilter(f)}
            >
              <Filter size={16} /> {f.toUpperCase()}
            </button>
          ))}
        </div>

        {/* Date + Search */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white rounded px-4 py-2 w-full"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="bg-slate-900 border border-slate-700 text-white rounded px-4 py-2 w-full"
          />
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="Search by filename..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-slate-900 border border-slate-700 text-white rounded px-4 py-2 w-full"
            />
          </div>
        </div>

        {/* Bulk Delete */}
        {selectedFiles.length > 0 && (
          <button
            onClick={handleBulkDelete}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded flex items-center gap-2"
          >
            <Trash2 size={16} /> Delete Selected ({selectedFiles.length})
          </button>
        )}

        {/* File List */}
        <div className="space-y-4">
          {getFilteredHistory().length ? (
            getFilteredHistory().map((item) => (
              <div
                key={item._id}
                className="bg-slate-800 p-4 rounded-xl border border-slate-700 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shadow hover:shadow-indigo-500/10 transition"
              >
                <div className="flex items-start gap-3 w-full">
                  <input
                    type="checkbox"
                    checked={selectedFiles.includes(item._id)}
                    onChange={() => handleSelect(item._id)}
                  />
                  <div className="w-full">
                    <p className="font-semibold text-white flex items-center gap-2 truncate">
                      <FileText className="text-cyan-400" size={18} />
                      {item.originalName || item.filename}
                    </p>
                    <p className="text-sm text-slate-400 flex items-center gap-2">
                      <CalendarClock size={14} />{' '}
                      {new Date(item.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 w-full justify-end">
                  <button
                    onClick={() => navigate(`/insight/${item._id}`)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                  >
                    <FileSearch size={16} /> View Insight
                  </button>
                  <button
                    onClick={() => handleReload(item)}
                    disabled={loadingId === item._id}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                  >
                    <RefreshCw size={16} /> {loadingId === item._id ? 'Reloading...' : 'Reload'}
                  </button>
                  <button
                    onClick={() => handleDownload(item._id, item.originalName)}
                    disabled={loadingId === item._id}
                    className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                  >
                    <Download size={16} /> {loadingId === item._id ? 'Downloading...' : 'Download'}
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    disabled={loadingId === item._id}
                    className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded flex items-center gap-1 text-sm"
                  >
                    <Trash2 size={16} /> {loadingId === item._id ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-slate-400">No matching files found.</p>
          )}
        </div>
      </main>
    </div>
  );
};

export default FileHistory;
