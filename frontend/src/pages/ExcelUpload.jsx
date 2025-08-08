
// // ExcelUpload.jsx
// import React, { useState, useRef, useEffect } from 'react';
// import * as XLSX from 'xlsx';
// import { Bar, Pie, Line, Doughnut, Scatter } from 'react-chartjs-2';
// import Sidebar from '../components/Sidebar';
// import {
//   Chart as ChartJS,
//   BarElement,
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend,
// } from 'chart.js';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { uploadExcelFile, getFileHistory, getBase64FileById } from '../api/api';
// import {
//   Upload,
//   FileDown,
//   BarChart2,
//   FileSearch,
//   RotateCcw,
//   Table,
//   MoveHorizontal,
//   MoveVertical,
// } from 'lucide-react';

// ChartJS.register(
//   BarElement,
//   ArcElement,
//   CategoryScale,
//   LinearScale,
//   PointElement,
//   LineElement,
//   Tooltip,
//   Legend
// );

// const ExcelUpload = () => {
//   const [data, setData] = useState([]);
//   const [columns, setColumns] = useState([]);
//   const [xCol, setXCol] = useState('');
//   const [yCol, setYCol] = useState('');
//   const [chartType, setChartType] = useState('bar');
//   const [uploadedFile, setUploadedFile] = useState(null);
//   const [history, setHistory] = useState([]);
//   const chartRef = useRef(null);
//   const navigate = useNavigate();
//   const location = useLocation();

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (!token) return;
//     const fetchHistory = async () => {
//       try {
//         const res = await getFileHistory(token);
//         setHistory(res.data.files);
//       } catch (err) {
//         console.error('Error fetching file history:', err);
//       }
//     };
//     fetchHistory();
//   }, []);

//   useEffect(() => {
//     if (location.state?.base64 && location.state?.name) {
//       handleBase64File(location.state.base64, location.state.name);
//       setUploadedFile({ name: location.state.name, base64: location.state.base64 });
//       window.history.replaceState({}, document.title);
//     }
//   }, [location.state]);

//   const handleFileUpload = async (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = async (evt) => {
//       const base64 = evt.target.result.split(',')[1];
//       setUploadedFile({ name: file.name, base64 });
//       handleBase64File(base64, file.name);
//       try {
//         const token = localStorage.getItem('token');
//         await uploadExcelFile(file, token);
//         const res = await getFileHistory(token);
//         setHistory(res.data.files);
//       } catch (err) {
//         console.error('File upload failed:', err);
//       }
//     };
//     reader.readAsDataURL(file);
//   };

//   const handleBase64File = (base64, name) => {
//     const binaryString = atob(base64);
//     const bytes = new Uint8Array(binaryString.length);
//     for (let i = 0; i < binaryString.length; i++) {
//       bytes[i] = binaryString.charCodeAt(i);
//     }
//     const wb = XLSX.read(bytes, { type: 'array' });
//     const wsname = wb.SheetNames[0];
//     const ws = wb.Sheets[wsname];
//     const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
//     const headers = jsonData[0];
//     const rows = jsonData.slice(1).filter((row) => row.length >= 2);
//     setColumns(headers);
//     setData(rows);
//     setXCol(headers[0]);
//     setYCol(headers[1]);
//   };

//   const generateColors = (count) => {
//     const backgroundColors = [];
//     const borderColors = [];
//     for (let i = 0; i < count; i++) {
//       const r = Math.floor(100 + Math.random() * 155);
//       const g = Math.floor(100 + Math.random() * 155);
//       const b = Math.floor(100 + Math.random() * 155);
//       backgroundColors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
//       borderColors.push(`rgba(${r}, ${g}, ${b}, 1)`);
//     }
//     return { backgroundColors, borderColors };
//   };

//   const getChartData = () => {
//     const xIndex = columns.indexOf(xCol);
//     const yIndex = columns.indexOf(yCol);
//     const validData = data
//       .filter((row) => row[xIndex] !== undefined && !isNaN(row[yIndex]))
//       .map((row) => [row[xIndex], Number(row[yIndex])]);
//     const labels = validData.map((row) => row[0]);
//     const values = validData.map((row) => row[1]);
//     const { backgroundColors, borderColors } = generateColors(values.length);
//     return {
//       labels,
//       datasets: [
//         {
//           label: `${yCol} vs ${xCol}`,
//           data: values,
//           backgroundColor: backgroundColors,
//           borderColor: borderColors,
//           borderWidth: 1,
//         },
//       ],
//     };
//   };

//   const getScatterData = () => {
//     const xIndex = columns.indexOf(xCol);
//     const yIndex = columns.indexOf(yCol);
//     return {
//       datasets: [
//         {
//           label: `${yCol} vs ${xCol}`,
//           data: data
//             .filter((row) => !isNaN(row[xIndex]) && !isNaN(row[yIndex]))
//             .map((row) => ({ x: Number(row[xIndex]), y: Number(row[yIndex]) })),
//           backgroundColor: 'rgba(153,102,255,0.6)',
//         },
//       ],
//     };
//   };

//   const renderChart = () => {
//     const chartData = getChartData();
//     const scatterData = getScatterData();
//     switch (chartType) {
//       case 'bar': return <Bar ref={chartRef} data={chartData} />;
//       case 'pie': return <Pie ref={chartRef} data={chartData} />;
//       case 'line': return <Line ref={chartRef} data={chartData} />;
//       case 'doughnut': return <Doughnut ref={chartRef} data={chartData} />;
//       case 'scatter': return <Scatter ref={chartRef} data={scatterData} />;
//       default: return null;
//     }
//   };

//   const downloadAsPDF = async () => {
//     const canvas = await html2canvas(document.getElementById('chart-container'));
//     const imgData = canvas.toDataURL('image/png');
//     const pdf = new jsPDF();
//     pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
//     pdf.save('chart.pdf');
//   };

//   const downloadAsExcel = () => {
//     if (!uploadedFile?.base64) return;
//     const link = document.createElement('a');
//     link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${uploadedFile.base64}`;
//     link.download = uploadedFile.name;
//     link.click();
//   };

//   const handleReload = async (fileId) => {
//     try {
//       const token = localStorage.getItem('token');
//       const res = await getBase64FileById(fileId, token);
//       const { base64, name } = res.data;
//       setUploadedFile({ name, base64 });
//       handleBase64File(base64, name);
//     } catch (err) {
//       console.error('Error reloading file:', err);
//       alert('Failed to reload file.');
//     }
//   };

//   return (
//     <div className="flex min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white font-sans">
//       <Sidebar />
//       <main className="ml-20 lg:ml-64 w-full px-6 py-10 space-y-10 animate-fade-in">
//         <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500 mb-10 flex items-center gap-3 tracking-tight">
//           <Table className="text-purple-400 animate-pulse" /> Excel Upload & Chart Builder
//         </h1>

//         {/* Upload Section */}
//         <label className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300">
//           <Upload className="w-5 h-5 animate-bounce" /> Upload Excel
//           <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
//         </label>

//         {data.length > 0 && (
//           <>
//             {/* Chart Controls */}
//             <div className="flex flex-wrap gap-6">
//               {[['X-Axis', xCol, setXCol, MoveHorizontal], ['Y-Axis', yCol, setYCol, MoveVertical], ['Chart Type', chartType, setChartType, BarChart2]].map(
//                 ([label, value, setter, Icon], i) => (
//                   <div key={i}>
//                     <label className="text-sm font-semibold flex items-center gap-1 text-cyan-300">
//                       <Icon className="w-4 h-4" /> {label}
//                     </label>
//                     <select
//                       className="bg-slate-900 border border-slate-700 p-2 rounded-lg text-white"
//                       value={value}
//                       onChange={(e) => setter(e.target.value)}
//                     >
//                       {(label === 'Chart Type'
//                         ? ['bar', 'pie', 'line', 'doughnut', 'scatter']
//                         : columns
//                       ).map((option) => (
//                         <option key={option}>{option}</option>
//                       ))}
//                     </select>
//                   </div>
//                 )
//               )}
//             </div>

//             {/* Chart Output */}
//             <div id="chart-container" className="bg-slate-900 p-6 rounded-2xl shadow-lg shadow-purple-500/10 animate-fade-in">
//               {renderChart()}
//             </div>

//             {/* Download Buttons */}
//             <div className="flex gap-4 mt-6">
//               <button onClick={downloadAsPDF} className="bg-gradient-to-r from-fuchsia-600 to-pink-600 hover:to-pink-700 text-white px-6 py-3 rounded-xl inline-flex gap-2 items-center transition">
//                 <FileDown className="w-4 h-4" /> Download PDF
//               </button>
//               <button onClick={downloadAsExcel} className="bg-gradient-to-r from-green-500 to-emerald-600 hover:to-emerald-700 text-white px-6 py-3 rounded-xl inline-flex gap-2 items-center transition">
//                 <FileDown className="w-4 h-4" /> Download Excel
//               </button>
//             </div>
//           </>
//         )}

//         {/* File History */}
//         <section>
//           <h2 className="text-2xl font-bold text-purple-300 mb-4">📁 Previous Uploads</h2>
//           {history.length > 0 ? (
//             <div className="bg-slate-800 p-4 rounded-xl space-y-4 shadow-inner">
//               {history.map((file) => (
//                 <div
//                   key={file._id}
//                   className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-700 px-6 py-4 rounded-lg border border-slate-600 shadow hover:shadow-lg transition"
//                 >
//                   <div>
//                     <span className="font-medium text-white">{file.originalName || file.filename}</span>
//                     <p className="text-sm text-slate-400">Uploaded on: {new Date(file.uploadedAt).toLocaleString()}</p>
//                   </div>
//                   <div className="flex gap-2 mt-3 md:mt-0">
//                     <button onClick={() => navigate(`/insight/${file._id}`)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm shadow inline-flex items-center gap-2">
//                       <FileSearch className="w-4 h-4" /> View Insight
//                     </button>
//                     <button onClick={() => handleReload(file._id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm shadow inline-flex items-center gap-2">
//                       <RotateCcw className="w-4 h-4" /> Reload
//                     </button>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           ) : (
//             <p className="text-slate-400">No previous uploads found.</p>
//           )}
//         </section>
//       </main>
//     </div>
//   );
// };

// export default ExcelUpload;




import React, { useState, useRef, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Bar, Pie, Line, Doughnut, Scatter } from 'react-chartjs-2';
import Sidebar from '../components/Sidebar';
import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate, useLocation } from 'react-router-dom';
import { uploadExcelFile, getFileHistory, getBase64FileById } from '../api/api';
import {
  Upload,
  FileDown,
  BarChart2,
  FileSearch,
  RotateCcw,
  Table,
  MoveHorizontal,
  MoveVertical,
  ImageDown,
} from 'lucide-react';

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const ExcelUpload = () => {
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);
  const [xCol, setXCol] = useState('');
  const [yCol, setYCol] = useState('');
  const [chartType, setChartType] = useState('bar');
  const [uploadedFile, setUploadedFile] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);
  const chartRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  console.log("ExcelUpload rendered");

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;
    const fetchHistory = async () => {
      try {
        const res = await getFileHistory(token);
        setHistory(res.data.files);
      } catch (err) {
        console.error('Error fetching file history:', err);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    if (location.state?.base64 && location.state?.name) {
      handleBase64File(location.state.base64, location.state.name);
      setUploadedFile({ name: location.state.name, base64: location.state.base64 });
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (evt) => {
      const base64 = evt.target.result.split(',')[1];
      setUploadedFile({ name: file.name, base64 });
      handleBase64File(base64, file.name);
      try {
        const token = localStorage.getItem('token');
        setLoading(true);
        await uploadExcelFile(file, token);
        const res = await getFileHistory(token);
        setHistory(res.data.files);
      } catch (err) {
        console.error('File upload failed:', err);
        alert('Failed to upload file.');
      } finally {
        setLoading(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleBase64File = (base64, name) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    const wb = XLSX.read(bytes, { type: 'array' });
    const wsname = wb.SheetNames[0];
    const ws = wb.Sheets[wsname];
    const jsonData = XLSX.utils.sheet_to_json(ws, { header: 1 });
    const headers = jsonData[0];
    const rows = jsonData.slice(1).filter((row) => row.length >= 2);
    setColumns(headers);
    setData(rows);
    setXCol(headers[0]);
    setYCol(headers[1]);
  };

  const generateColors = (count) => {
    const backgroundColors = [];
    const borderColors = [];
    for (let i = 0; i < count; i++) {
      const r = Math.floor(100 + Math.random() * 155);
      const g = Math.floor(100 + Math.random() * 155);
      const b = Math.floor(100 + Math.random() * 155);
      backgroundColors.push(`rgba(${r}, ${g}, ${b}, 0.6)`);
      borderColors.push(`rgba(${r}, ${g}, ${b}, 1)`);
    }
    return { backgroundColors, borderColors };
  };

  const getChartData = () => {
    const xIndex = columns.indexOf(xCol);
    const yIndex = columns.indexOf(yCol);
    const validData = data
      .filter((row) => row[xIndex] !== undefined && !isNaN(row[yIndex]))
      .map((row) => [row[xIndex], Number(row[yIndex])]);
    const labels = validData.map((row) => row[0]);
    const values = validData.map((row) => row[1]);
    const { backgroundColors, borderColors } = generateColors(values.length);
    return {
      labels,
      datasets: [
        {
          label: `${yCol} vs ${xCol}`,
          data: values,
          backgroundColor: backgroundColors,
          borderColor: borderColors,
          borderWidth: 1,
        },
      ],
    };
  };

  const getScatterData = () => {
    const xIndex = columns.indexOf(xCol);
    const yIndex = columns.indexOf(yCol);
    return {
      datasets: [
        {
          label: `${yCol} vs ${xCol}`,
          data: data
            .filter((row) => !isNaN(row[xIndex]) && !isNaN(row[yIndex]))
            .map((row) => ({ x: Number(row[xIndex]), y: Number(row[yIndex]) })),
          backgroundColor: 'rgba(153,102,255,0.6)',
        },
      ],
    };
  };

  const renderChart = () => {
    const chartData = getChartData();
    const scatterData = getScatterData();
    switch (chartType) {
      case 'bar': return <Bar ref={chartRef} data={chartData} />;
      case 'pie': return <Pie ref={chartRef} data={chartData} />;
      case 'line': return <Line ref={chartRef} data={chartData} />;
      case 'doughnut': return <Doughnut ref={chartRef} data={chartData} />;
      case 'scatter': return <Scatter ref={chartRef} data={scatterData} />;
      default: return null;
    }
  };

  const downloadAsPDF = async () => {
    const canvas = await html2canvas(document.getElementById('chart-container'));
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF();
    pdf.addImage(imgData, 'PNG', 10, 10, 190, 100);
    pdf.save('chart.pdf');
  };

  const downloadAsPNG = async () => {
    const canvas = await html2canvas(document.getElementById('chart-container'));
    const link = document.createElement('a');
    link.href = canvas.toDataURL('image/png');
    link.download = 'chart.png';
    link.click();
  };

  const downloadAsExcel = () => {
    if (!uploadedFile?.base64) return;
    const link = document.createElement('a');
    link.href = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${uploadedFile.base64}`;
    link.download = uploadedFile.name;
    link.click();
  };

  const handleReload = async (fileId) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const res = await getBase64FileById(fileId, token);
      const { base64, name } = res.data;
      setUploadedFile({ name, base64 });
      handleBase64File(base64, name);
    } catch (err) {
      console.error('Error reloading file:', err);
      alert('Failed to reload file.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-[#0f0f0f] to-[#1a1a1a] text-white font-sans">
      <Sidebar />
      <main className="ml-20 lg:ml-64 w-full px-6 py-10 space-y-10 animate-fade-in">
        <h1 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-teal-400 to-purple-500 mb-10 flex items-center gap-3 tracking-tight">
          <Table className="text-purple-400 animate-pulse" /> Excel Upload & Chart Builder
        </h1>

        <label className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-pink-500 text-white px-6 py-3 rounded-xl shadow-lg cursor-pointer hover:scale-105 transition-transform duration-300">
          <Upload className="w-5 h-5 animate-bounce" /> Upload Excel
          <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} className="hidden" />
        </label>

        {loading && <p className="text-yellow-400 font-semibold">Processing... Please wait.</p>}

        {data.length > 0 && !loading && (
          <>
            <div className="flex flex-wrap gap-6">
              {[['X-Axis', xCol, setXCol, MoveHorizontal], ['Y-Axis', yCol, setYCol, MoveVertical], ['Chart Type', chartType, setChartType, BarChart2]].map(
                ([label, value, setter, Icon], i) => (
                  <div key={i}>
                    <label className="text-sm font-semibold flex items-center gap-1 text-cyan-300">
                      <Icon className="w-4 h-4" /> {label}
                    </label>
                    <select
                      className="bg-slate-900 border border-slate-700 p-2 rounded-lg text-white"
                      value={value}
                      onChange={(e) => setter(e.target.value)}
                    >
                      {(label === 'Chart Type'
                        ? ['bar', 'pie', 'line', 'doughnut', 'scatter']
                        : columns
                      ).map((option) => (
                        <option key={option}>{option}</option>
                      ))}
                    </select>
                  </div>
                )
              )}
            </div>

            <div id="chart-container" className="bg-slate-900 p-6 rounded-2xl shadow-lg shadow-purple-500/10 animate-fade-in">
              {renderChart()}
            </div>

            <div className="flex gap-4 mt-6 flex-wrap">
              <button onClick={downloadAsPDF} className="bg-gradient-to-r from-fuchsia-600 to-pink-600 text-white px-6 py-3 rounded-xl flex items-center gap-2">
                <FileDown className="w-4 h-4" /> Download PDF
              </button>
              <button onClick={downloadAsPNG} className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-xl flex items-center gap-2">
                <ImageDown className="w-4 h-4" /> Download Image
              </button>
              <button onClick={downloadAsExcel} className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-xl flex items-center gap-2">
                <FileDown className="w-4 h-4" /> Download Excel
              </button>
            </div>
          </>
        )}

        {/* File History */}
        <section>
          <h2 className="text-2xl font-bold text-purple-300 mb-4">📁 Previous Uploads</h2>
          {history.length > 0 ? (
            <div className="bg-slate-800 p-4 rounded-xl space-y-4 shadow-inner">
              {history.map((file) => (
                <div
                  key={file._id || file.id}
                  className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-700 px-6 py-4 rounded-lg border border-slate-600 shadow hover:shadow-lg transition"
                >
                  <div>
                    <span className="font-medium text-white">{file.originalName || file.filename}</span>
                    <p className="text-sm text-slate-400">Uploaded on: {new Date(file.uploadedAt).toLocaleString()}</p>
                  </div>
                  <div className="flex gap-2 mt-3 md:mt-0">
                    <button onClick={() => navigate(`/insight/${file._id}`)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-md text-sm shadow inline-flex items-center gap-2">
                      <FileSearch className="w-4 h-4" /> View Insight
                    </button>
                    <button onClick={() => handleReload(file._id)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2 rounded-md text-sm shadow inline-flex items-center gap-2">
                      <RotateCcw className="w-4 h-4" /> Reload
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-slate-400">No previous uploads found.</p>
          )}
        </section>
      </main>
    </div>
  );
};

export default ExcelUpload;
