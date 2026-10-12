import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import axios from 'axios';

const API = 'http://localhost:5000/api';

function App() {
  const [file, setFile] = useState(null);
  const [jobDesc, setJobDesc] = useState('');
  const [jobRole, setJobRole] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const onDrop = useCallback((accepted) => {
    setFile(accepted[0]);
    setError('');
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    maxFiles: 1,
  });

  const analyze = async () => {
    if (!file) return setError('Please upload your resume first');
    if (jobDesc.length < 50) return setError('Please paste a job description (min 50 chars)');

    setLoading(true);
    setError('');

    const fd = new FormData();
    fd.append('resume', file);
    fd.append('jobDescription', jobDesc);
    fd.append('jobRole', jobRole);

    try {
      const { data } = await axios.post(`${API}/analyze`, fd);
      setResult(data.analysis);
    } catch (e) {
      setError(e.response?.data?.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setFile(null);
    setJobDesc('');
    setJobRole('');
    setResult(null);
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-bold">
              JF
            </div>
            <span className="font-bold text-lg text-slate-800">JobFit Analyzer</span>
          </div>
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm text-slate-500 hover:text-slate-800 transition"
          >
            GitHub →
          </a>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-10">
        {/* Hero */}
        {!result && (
          <div className="text-center mb-10">
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-3">
              Match Your Resume to <span className="text-indigo-600">Any Job</span>
            </h1>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">
              Upload your resume, paste a job description, and get an AI-powered match score with skill gap analysis in seconds.
            </p>
          </div>
        )}

        {/* Input Section */}
        {!result && (
          <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6 md:p-8 space-y-6">
            {/* Dropzone */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                1. Upload Resume
              </label>
              <div
                {...getRootProps()}
                className={`border-2 border-dashed rounded-xl p-10 text-center cursor-pointer transition-all ${
                  isDragActive
                    ? 'border-indigo-500 bg-indigo-50 scale-[1.01]'
                    : file
                    ? 'border-green-400 bg-green-50'
                    : 'border-slate-300 hover:border-indigo-400 hover:bg-slate-50'
                }`}
              >
                <input {...getInputProps()} />
                {file ? (
                  <div className="flex items-center justify-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <span className="text-green-600 text-xl">✓</span>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold text-slate-800">{file.name}</p>
                      <p className="text-xs text-slate-500">
                        {(file.size / 1024).toFixed(1)} KB
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <span className="text-2xl">📄</span>
                    </div>
                    <p className="font-medium text-slate-700">
                      {isDragActive ? 'Drop your resume here' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">PDF or DOCX, max 5MB</p>
                  </>
                )}
              </div>
            </div>

            {/* Job Role */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                2. Job Role <span className="text-slate-400 font-normal">(optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. MERN Stack Developer Intern"
                value={jobRole}
                onChange={(e) => setJobRole(e.target.value)}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                3. Paste Job Description
              </label>
              <textarea
                placeholder="Paste the full job description here from LinkedIn, Naukri, or Internshala..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
                rows={8}
                className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition resize-none"
              />
              <p className="text-xs text-slate-400 mt-1">
                {jobDesc.length} chars {jobDesc.length > 0 && jobDesc.length < 50 && '(min 50 needed)'}
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3">
                <span className="text-red-500 text-lg">⚠️</span>
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Button */}
            <button
              onClick={analyze}
              disabled={loading}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-4 rounded-xl font-semibold text-lg hover:from-indigo-700 hover:to-purple-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Analyzing with AI...
                </span>
              ) : (
                '🚀 Analyze Match'
              )}
            </button>
          </div>
        )}

        {/* Results */}
        {result && <Results data={result} onReset={reset} />}
      </main>

      <footer className="text-center text-sm text-slate-400 py-8">
        Built with MERN Stack + Google Gemini AI
      </footer>
    </div>
  );
}

function Results({ data, onReset }) {
  const score = data.matchScore || 0;
  const scoreColor =
    score >= 70 ? 'text-green-600' : score >= 50 ? 'text-amber-500' : 'text-red-500';
  const scoreBg =
    score >= 70 ? 'from-green-500 to-emerald-600' : score >= 50 ? 'from-amber-400 to-orange-500' : 'from-red-500 to-rose-600';

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Score Card */}
      <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-8 text-center">
        <p className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-4">
          Match Score
        </p>
        <div className="relative inline-flex items-center justify-center mb-4">
          <svg className="w-40 h-40 transform -rotate-90">
            <circle cx="80" cy="80" r="70" stroke="#e2e8f0" strokeWidth="12" fill="none" />
            <circle
              cx="80"
              cy="80"
              r="70"
              stroke="url(#gradient)"
              strokeWidth="12"
              fill="none"
              strokeLinecap="round"
              strokeDasharray={`${(score / 100) * 440} 440`}
              className="transition-all duration-1000"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor={score >= 70 ? '#22c55e' : score >= 50 ? '#f59e0b' : '#ef4444'} />
                <stop offset="100%" stopColor={score >= 70 ? '#10b981' : score >= 50 ? '#f97316' : '#e11d48'} />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className={`text-5xl font-bold ${scoreColor}`}>{score}</span>
          </div>
        </div>
        <p className="text-slate-600 max-w-2xl mx-auto">{data.summary}</p>
      </div>

      {/* Skills */}
      <div className="grid md:grid-cols-2 gap-6">
        <SkillCard
          title="Matched Skills"
          icon="✅"
          items={data.matchedSkills}
          color="green"
          emptyMsg="No matching skills found"
        />
        <SkillCard
          title="Missing Skills"
          icon="❌"
          items={data.missingSkills}
          color="red"
          emptyMsg="Great! No missing skills"
        />
      </div>

      {/* Feedback */}
      <div className="grid md:grid-cols-2 gap-6">
        <ListCard title="💪 Strengths" items={data.strengths} color="blue" />
        <ListCard title="⚠️ Weaknesses" items={data.weaknesses} color="amber" />
      </div>

      {/* Suggestions */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 rounded-2xl p-6 border border-indigo-100">
        <h3 className="font-bold text-lg text-slate-800 mb-4 flex items-center gap-2">
          💡 Suggestions to Improve
        </h3>
        <ul className="space-y-3">
          {data.suggestions?.map((s, i) => (
            <li key={i} className="flex gap-3 items-start">
              <span className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                {i + 1}
              </span>
              <span className="text-slate-700">{s}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Reset */}
      <div className="text-center pt-4">
        <button
          onClick={onReset}
          className="px-6 py-3 bg-slate-800 text-white rounded-xl font-medium hover:bg-slate-900 transition"
        >
          ← Analyze Another Resume
        </button>
      </div>
    </div>
  );
}

function SkillCard({ title, icon, items = [], color, emptyMsg }) {
  const colorMap = {
    green: 'bg-green-100 text-green-700 border-green-200',
    red: 'bg-red-100 text-red-700 border-red-200',
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6">
      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
        <span>{icon}</span> {title}
      </h3>
      {items?.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {items.map((skill, i) => (
            <span
              key={i}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium border ${colorMap[color]}`}
            >
              {skill}
            </span>
          ))}
        </div>
      ) : (
        <p className="text-slate-400 text-sm">{emptyMsg}</p>
      )}
    </div>
  );
}

function ListCard({ title, items = [], color }) {
  const colorMap = {
    blue: 'border-l-blue-500',
    amber: 'border-l-amber-500',
  };
  return (
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/50 p-6">
      <h3 className="font-bold text-slate-800 mb-4">{title}</h3>
      {items?.length > 0 ? (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li
              key={i}
              className={`pl-3 border-l-2 ${colorMap[color]} text-slate-600 text-sm`}
            >
              {item}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-slate-400 text-sm">No data</p>
      )}
    </div>
  );
}

export default App;