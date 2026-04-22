import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { buildResumeDownloadUrl, buildResumeViewUrl } from '../utils/resume';

const API_URL = import.meta.env.VITE_API_URL;
const FALLBACK_RESUME_LINK = 'https://drive.google.com/drive/folders/1fCNruei836CoLnNmg0A-GttHQGP5yFa3?usp=sharing';

const ResumeViewerPage = () => {
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/resume`);

        if (response.ok) {
          const data = await response.json();
          setResume(data);
        } else {
          setResume(null);
        }
      } catch (error) {
        console.error('Error fetching resume:', error);
        setResume(null);
      } finally {
        setLoading(false);
      }
    };

    fetchResume();
  }, []);

  if (loading) {
    return (
      <section className="min-h-screen bg-slate-950 text-white px-4 py-16">
        <div className="max-w-4xl mx-auto bg-slate-900/80 border border-slate-800 rounded-3xl p-10 text-center">
          <p className="text-lg text-slate-300">Loading resume...</p>
        </div>
      </section>
    );
  }

  const viewUrl = resume?.resumeUrl
    ? buildResumeViewUrl(API_URL)
    : FALLBACK_RESUME_LINK;
  const downloadUrl = resume?.resumeUrl
    ? buildResumeDownloadUrl(API_URL)
    : FALLBACK_RESUME_LINK;

  return (
    <section className="min-h-screen bg-[radial-gradient(circle_at_top,_rgba(34,211,238,0.18),_transparent_28%),linear-gradient(180deg,_#020617_0%,_#0f172a_48%,_#111827_100%)] text-white px-4 py-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="bg-slate-900/75 backdrop-blur-xl border border-cyan-500/20 rounded-3xl p-8 shadow-2xl shadow-cyan-950/30">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
            <div>
              <p className="text-cyan-300 text-sm uppercase tracking-[0.35em] mb-3">Resume</p>
              <h1 className="text-4xl md:text-5xl font-black text-white">Preview and Download</h1>
              <p className="text-slate-300 mt-3 max-w-2xl">
                Open the resume in the browser, or download a local copy directly.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <a
                href={viewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full bg-white text-slate-900 font-semibold hover:bg-cyan-100 transition-colors"
              >
                Open in New Tab
              </a>
              <a
                href={downloadUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-5 py-3 rounded-full bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition-colors"
              >
                Download Resume
              </a>
              <Link
                to="/"
                className="px-5 py-3 rounded-full border border-slate-600 text-slate-200 font-semibold hover:border-cyan-400 hover:text-cyan-300 transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>

        <div className="bg-slate-900/80 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl">
          {resume?.resumeUrl ? (
            <div className="space-y-0">
              <iframe
                title="Resume Preview"
                src={viewUrl}
                className="w-full h-[80vh] bg-white"
              />
              <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/70 text-sm text-slate-400">
                If the preview still does not load, use <a href={viewUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200">Open in New Tab</a> or <a href={downloadUrl} target="_blank" rel="noopener noreferrer" className="text-cyan-300 hover:text-cyan-200">Download Resume</a>.
              </div>
            </div>
          ) : (
            <div className="p-12 text-center space-y-4">
              <h2 className="text-2xl font-bold text-white">Resume not uploaded yet</h2>
              <p className="text-slate-300">
                The live PDF is not available right now, so the fallback link is still available.
              </p>
              <a
                href={FALLBACK_RESUME_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex px-5 py-3 rounded-full bg-cyan-500 text-slate-950 font-semibold hover:bg-cyan-400 transition-colors"
              >
                Open Fallback Resume Link
              </a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ResumeViewerPage;
