// File: src/components/tabs/CertificatesContent.jsx
import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const CertificatesContent = ({ certificates, handleApiCall, fetchDashboardData }) => {
    const initialState = {
        title: '',
        issuer: '',
        date: '',
        description: '',
    };
    const [newCertificate, setNewCertificate] = useState(initialState);
    const [certificateFile, setCertificateFile] = useState(null);
    const [editingCertificateId, setEditingCertificateId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setNewCertificate(initialState);
        setCertificateFile(null);
        setEditingCertificateId(null);
        const fileInput = document.getElementById('certificateInput');
        if (fileInput) fileInput.value = '';
    };

    const handleChange = (e) => {
        setNewCertificate({ ...newCertificate, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (!editingCertificateId && !certificateFile) {
            alert('Please upload a certificate file.');
            setIsSubmitting(false);
            return;
        }
        
        const method = editingCertificateId ? 'PUT' : 'POST';
        const url = editingCertificateId ? `${API_URL}/api/admin/certificates/${editingCertificateId}` : `${API_URL}/api/admin/certificates`;
        const formData = new FormData();

        formData.append('title', newCertificate.title);
        formData.append('issuer', newCertificate.issuer);
        formData.append('date', newCertificate.date);
        formData.append('description', newCertificate.description);

        if (certificateFile) {
            formData.append('certificate', certificateFile);
        }
        
        const result = await handleApiCall(url, method, formData, true);

        if (result) {
            alert(`Certificate ${editingCertificateId ? 'updated' : 'added'} successfully!`);
            resetForm();
            fetchDashboardData();
        }
        setIsSubmitting(false);
    };

    const handleEdit = (cert) => {
        setEditingCertificateId(cert._id);
        setNewCertificate({
            title: cert.title,
            issuer: cert.issuer,
            date: cert.date,
            description: cert.description || '',
        });
        setCertificateFile(null);
        const fileInput = document.getElementById('certificateInput');
        if (fileInput) fileInput.value = '';
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this certificate?')) return;

        const result = await handleApiCall(`${API_URL}/api/admin/certificates/${id}`, 'DELETE');
        if (result) {
            alert('Certificate deleted successfully!');
            fetchDashboardData();
        }
    };

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">Manage Certificates</h3>
            <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800">
                <h4 className="text-xl font-semibold text-cyan-400">{editingCertificateId ? 'Edit Certificate' : 'Add New Certificate'}</h4>
                
                <input name="title" value={newCertificate.title} onChange={handleChange} placeholder="Certificate Title" required className="w-full p-2 border rounded-md bg-gray-700 text-white" />
                <div className="flex space-x-4">
                    <input name="issuer" value={newCertificate.issuer} onChange={handleChange} placeholder="Issuer (e.g., Udemy, Coursera)" required className="w-1/2 p-2 border rounded-md bg-gray-700 text-white" />
                    <input name="date" value={newCertificate.date} onChange={handleChange} placeholder="Date Issued (e.g., October 2025)" required className="w-1/2 p-2 border rounded-md bg-gray-700 text-white" />
                </div>
                <div className="space-y-2">
                    <input
                        id="certificateInput"
                        type="file"
                        accept="application/pdf,image/*"
                        onChange={(e) => setCertificateFile(e.target.files?.[0] || null)}
                        className="w-full p-2 border rounded-md bg-gray-700 text-white file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:font-semibold file:bg-cyan-50 file:text-cyan-700 hover:file:bg-cyan-100"
                    />
                    <p className="text-xs text-gray-400">
                        {editingCertificateId
                            ? 'Choose a new PDF or image only if you want to replace the current certificate file.'
                            : 'Upload certificate as PDF or image.'}
                    </p>
                </div>
                
                <textarea
                    name="description"
                    value={newCertificate.description}
                    onChange={handleChange}
                    placeholder="Certificate Description (e.g., Learned about React, Node.js, MongoDB...)"
                    rows="3"
                    className="w-full p-2 border rounded-md bg-gray-700 text-white"
                />
                
                <div className="flex space-x-4">
                    <button type="submit" disabled={isSubmitting} className={`bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}>
                        {isSubmitting ? 'Saving...' : (editingCertificateId ? 'Update Certificate' : 'Add Certificate')}
                    </button>
                    {editingCertificateId && (
                        <button type="button" onClick={resetForm} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            <h4 className="font-bold text-xl pt-4 border-t border-gray-700 text-cyan-400">Current Certificates ({certificates.length})</h4>
            <div className="space-y-3">
                {certificates.map((cert) => (
                    <div key={cert._id} className="p-3 border rounded-lg flex justify-between items-center bg-gray-800">
                        <div className="flex-1">
                            <h5 className="font-bold text-white">{cert.title}</h5>
                            <p className="text-xs text-gray-400">by {cert.issuer} on {cert.date}</p>
                            <p className="text-xs text-cyan-300 mt-1">{cert.fileName || 'certificate uploaded'}</p>
                            {cert.description && (
                                <p className="text-sm text-gray-300 mt-2 whitespace-pre-wrap">{cert.description}</p>
                            )}
                        </div>
                        <div className="flex space-x-2 ml-4">
                            <button onClick={() => handleEdit(cert)} className="text-cyan-400 hover:text-cyan-300">Edit</button>
                            <button onClick={() => handleDelete(cert._id)} className="text-red-500 hover:text-red-400">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default CertificatesContent;
