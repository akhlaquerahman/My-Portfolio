// File: src/components/tabs/AccountContent.jsx (UPDATED)
import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;
// Destructure required props
const AccountContent = ({ info, setInfo, handleApiCall, fetchDashboardData }) => {
    // State to store the selected file object
    const [profileFile, setProfileFile] = useState(null);
    const [isUpdating, setIsUpdating] = useState(false);

    const handleInfoUpdate = async (e) => {
        e.preventDefault();
        setIsUpdating(true);

        const url = `${API_URL}/api/admin/info`;
        
        // 1. Create FormData object
        const formData = new FormData();
        
        // 2. Append file if present
        if (profileFile) {
            formData.append('profileImage', profileFile); // Matches multer field name: 'profileImage'
        }
        
        // 3. Append all text fields from 'info' state
        for (const key in info) {
            // NOTE: 'profileImageUrl' is managed by Cloudinary. We send the old 'profileImageId' for cleanup.
            if (info[key] !== null && key !== 'profileImageUrl') {
                formData.append(key, info[key] || '');
            }
        }

        // 4. API Call with FormData
        const result = await handleApiCall(url, 'PUT', formData, true); // true for isFormData

        if (result) {
            alert(`Account Info/Bio updated successfully!`);
            // Update local state with the new data (includes new URL/ID from the API)
            setInfo(result); 
            setProfileFile(null); // Clear file selection state
            fetchDashboardData(); 
        }
        setIsUpdating(false);
    };

    // Helper to determine image source for preview
    const getPreviewUrl = () => {
        // Higher priority to newly selected file
        if (profileFile) {
            return URL.createObjectURL(profileFile);
        }
        // Fallback to URL from API or placeholder
        return info.profileImageUrl || 'placeholder_url'; 
    };

    return (
        <form onSubmit={handleInfoUpdate} className="space-y-6">
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">Manage Account Info & Profile Image</h3>
            
            {/* Current Profile Image Preview & Upload Input */}
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
                        onChange={(e) => setProfileFile(e.target.files[0])}
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm p-2 text-white text-sm file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
                        accept="image/*"
                    />
                    <p className="text-xs text-gray-500 mt-1">Current ID: <span className='line-clamp-1'>{info.profileImageId || 'N/A'}</span></p>
                </div>
            </div>

            {/* General Info Fields (rest of the form fields remain the same) */}
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Full Name</label>
                <input
                    type="text"
                    name="name"
                    value={info.name || ''}
                    onChange={(e) => setInfo({ ...info, name: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm p-3 text-white"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Email Address</label>
                <input
                    type="email"
                    name="email"
                    value={info.email || ''}
                    onChange={(e) => setInfo({ ...info, email: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm p-3 text-white"
                />
            </div>
            <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-400">Phone Number</label>
                <input
                    type="text"
                    name="phone"
                    value={info.phone || ''}
                    onChange={(e) => setInfo({ ...info, phone: e.target.value })}
                    className="mt-1 block w-full rounded-md border-gray-600 bg-gray-700 shadow-sm p-3 text-white"
                />
            </div>
            
            <button type="submit" disabled={isUpdating} className={`bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors ${isUpdating ? 'opacity-75 cursor-not-allowed' : ''}`}>
                {isUpdating ? 'Updating...' : 'Update Account Info'}
            </button>
        </form>
    );
};

export default AccountContent;