import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

const API_URL = import.meta.env.VITE_API_URL;

const AccountContent = ({ info, setInfo, handleApiCall, fetchDashboardData }) => {
  const [profileFile, setProfileFile] = useState(null);
  const [resumeFile, setResumeFile] = useState(null);
  const [currentResume, setCurrentResume] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isUploadingResume, setIsUploadingResume] = useState(false);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/resume`);
        if (response.ok) {
          const data = await response.json();
          setCurrentResume(data);
        } else {
          setCurrentResume(null);
        }
      } catch (error) {
        console.error('Error fetching resume:', error);
      }
    };

    fetchResume();
  }, []);

  const handleInfoUpdate = async (event) => {
    event.preventDefault();
    setIsUpdating(true);

    const url = `${API_URL}/api/admin/info`;
    const formData = new FormData();

    if (profileFile) {
      formData.append('profileImage', profileFile);
    }

    for (const key in info) {
      if (info[key] !== null && key !== 'profileImageUrl') {
        formData.append(key, info[key] || '');
      }
    }

    const result = await handleApiCall(url, 'PUT', formData, true);

    if (result) {
      alert('Account Info/Bio updated successfully!');
      setInfo(result);
      setProfileFile(null);
      fetchDashboardData();
    }

    setIsUpdating(false);
  };

  const handleResumeUpload = async (event) => {
    event.preventDefault();

    if (!resumeFile) {
      alert('Please select a PDF file');
      return;
    }

    setIsUploadingResume(true);
    const formData = new FormData();
    formData.append('resume', resumeFile);

    try {
      const response = await fetch(`${API_URL}/api/admin/resume`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setCurrentResume(data.data);
        setResumeFile(null);
        alert('Resume uploaded successfully!');
        document.getElementById('resumeInput').value = '';
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to upload resume');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      alert('Error uploading resume');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleDeleteResume = async () => {
    if (!window.confirm('Are you sure you want to delete your resume?')) {
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/resume`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setCurrentResume(null);
        alert('Resume deleted successfully!');
      } else {
        const errorData = await response.json().catch(() => ({}));
        alert(errorData.message || 'Failed to delete resume');
      }
    } catch (error) {
      console.error('Error deleting resume:', error);
      alert('Error deleting resume');
    }
  };

  const getPreviewUrl = () => {
    if (profileFile) {
      return URL.createObjectURL(profileFile);
    }

    return info.profileImageUrl || 'placeholder_url';
  };

  return (
    <div>
      <form onSubmit={handleInfoUpdate} className="space-y-6">
        <h3 className="text-2xl font-bold mb-4 text-cyan-400">Manage Account Info &amp; Profile Image</h3>

        <div className="flex items-center space-x-6 border p-4 rounded-lg border-slate-700 bg-gray-800">
          <img
            src={getPreviewUrl()}
            alt="Current Profile"
            className="w-20 h-20 rounded-full object-cover border-2 border-cyan-400"
          />
          <div className="flex-1">
            <label className="block text-sm font-medium text-gray-400 mb-2">Upload New Profile Image</label>
            <input
              type="file"
              name="profileImage"
              onChange={(event) => setProfileFile(event.target.files[0])}
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm p-2 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              accept="image/*"
            />
            <p className="text-xs text-gray-500 mt-1">
              Current ID: <span className="line-clamp-1">{info.profileImageId || 'N/A'}</span>
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">Full Name</label>
          <input
            type="text"
            name="name"
            value={info.name || ''}
            onChange={(event) => setInfo({ ...info, name: event.target.value })}
            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm p-3 text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">Email Address</label>
          <input
            type="email"
            name="email"
            value={info.email || ''}
            onChange={(event) => setInfo({ ...info, email: event.target.value })}
            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm p-3 text-white"
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-400">Phone Number</label>
          <input
            type="text"
            name="phone"
            value={info.phone || ''}
            onChange={(event) => setInfo({ ...info, phone: event.target.value })}
            className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm p-3 text-white"
          />
        </div>

        <button
          type="submit"
          disabled={isUpdating}
          className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors ${isUpdating ? 'opacity-75 cursor-not-allowed' : ''}`}
        >
          {isUpdating ? 'Updating...' : 'Update Account Info'}
        </button>
      </form>

      <div className="mt-10 p-6 border border-slate-600 rounded-lg bg-slate-800/50">
        <h3 className="text-2xl font-bold mb-4 text-cyan-400">Resume Management</h3>

        {currentResume ? (
          <div className="space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 bg-slate-700 p-4 rounded-lg">
              <div>
                <p className="text-white font-semibold">Current Resume</p>
                <p className="text-gray-400 text-sm">{currentResume.fileName || 'resume.pdf'}</p>
                <p className="text-gray-500 text-xs mt-1">
                  Uploaded: {new Date(currentResume.uploadedAt).toLocaleDateString()}
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Link
                  to="/resume"
                  className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  View Resume
                </Link>
                <button
                  onClick={handleDeleteResume}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition-colors"
                >
                  Delete Resume
                </button>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-gray-400 mb-4">No resume uploaded yet</p>
        )}

        <form onSubmit={handleResumeUpload} className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Upload New Resume (PDF)</label>
            <input
              id="resumeInput"
              type="file"
              onChange={(event) => setResumeFile(event.target.files[0])}
              accept="application/pdf,.pdf"
              className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm p-2 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
            />
            <p className="text-xs text-gray-500 mt-1">Only PDF files allowed</p>
          </div>
          <button
            type="submit"
            disabled={isUploadingResume || !resumeFile}
            className={`w-full bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-md transition-colors ${isUploadingResume || !resumeFile ? 'opacity-75 cursor-not-allowed' : ''}`}
          >
            {isUploadingResume ? 'Uploading...' : 'Upload Resume'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AccountContent;
