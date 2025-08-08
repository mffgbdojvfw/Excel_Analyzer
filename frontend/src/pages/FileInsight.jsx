



import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { generateInsight } from '../api/api';
import Sidebar from '../components/Sidebar';
import { Lightbulb, LoaderCircle, AlertTriangle, ArrowLeft } from 'lucide-react';

const FileInsight = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchInsight = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await generateInsight(id, token);
        setInsight(response.data.summary);
      } catch (err) {
        setError('⚠️ Failed to generate insight.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchInsight();
  }, [id]);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gradient-to-br from-slate-900 via-black to-slate-950 text-white">
      <Sidebar />

      <div className="md:ml-64 w-full px-4 sm:px-6 py-8 sm:py-12 flex flex-col items-center">
        {/* Header */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold mb-6 flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-white text-center">
          <Lightbulb className="text-yellow-400 w-7 h-7" />
          Insight Summary
        </h1>

        {/* Loader */}
        {loading && (
          <div className="text-base sm:text-lg text-blue-400 animate-pulse flex items-center gap-2">
            <LoaderCircle className="animate-spin" /> Generating insights...
          </div>
        )}

        {/* Error */}
        {!loading && error && (
          <div className="text-red-500 font-semibold flex items-center gap-2">
            <AlertTriangle className="text-red-600" /> {error}
          </div>
        )}

        {/* Insights */}
        {!loading && !error && (
          <div className="w-full max-w-4xl bg-slate-800 p-5 sm:p-6 rounded-xl shadow-xl border-l-4 border-blue-500">
            <ul className="list-disc pl-5 sm:pl-6 space-y-3 text-slate-100 text-sm sm:text-base leading-relaxed">
              {insight
                .split('\n')
                .map(line => line.trim())
                .filter(line => line.length > 0)
                .map((line, index) => {
                  const cleaned = line
                    .replace(/“|”/g, '"')
                    .replace(/‘|’/g, "'")
                    .replace(/\*\*/g, '')
                    .replace(/^\*\s*/, '');

                  const firstSentenceEnd = cleaned.indexOf(':');
                  if (firstSentenceEnd !== -1) {
                    const boldPart = cleaned.slice(0, firstSentenceEnd).trim();
                    const rest = cleaned.slice(firstSentenceEnd + 1).trim();
                    return (
                      <li key={index}>
                        <strong className="text-white">{boldPart}</strong>: {rest}
                      </li>
                    );
                  }

                  return <li key={index}>{cleaned}</li>;
                })}
            </ul>
          </div>
        )}

        {/* Back Button */}
        <div className="mt-10">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full shadow-md transition duration-300 text-sm sm:text-base"
          >
            <ArrowLeft /> Back
          </button>
        </div>
      </div>
    </div>
  );
};

export default FileInsight;
