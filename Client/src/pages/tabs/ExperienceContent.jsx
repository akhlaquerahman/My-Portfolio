// File: src/components/tabs/ExperienceContent.jsx
import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const ExperienceContent = ({ experiences, handleApiCall, fetchDashboardData }) => {
    const initialState = {
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        description: '',
    };
    const [newExperience, setNewExperience] = useState(initialState);
    const [editingExperienceId, setEditingExperienceId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const resetForm = () => {
        setNewExperience(initialState);
        setEditingExperienceId(null);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewExperience({ ...newExperience, [name]: value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        const method = editingExperienceId ? 'PUT' : 'POST';
        const url = editingExperienceId ? `${API_URL}/api/admin/experiences/${editingExperienceId}` : `${API_URL}/api/admin/experiences`;
        
        // Description ko newline se split karke bhejein taaki frontend par list mein dikhe
        const body = { ...newExperience };
        
        const result = await handleApiCall(url, method, body, false); // isFormData: false

        if (result) {
            alert(`Experience ${editingExperienceId ? 'updated' : 'added'} successfully!`);
            resetForm();
            fetchDashboardData();
        }
        setIsSubmitting(false);
    };

    const handleEdit = (exp) => {
        setEditingExperienceId(exp._id);
        setNewExperience({
            title: exp.title,
            company: exp.company,
            startDate: exp.startDate,
            endDate: exp.endDate,
            description: exp.description,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this experience?')) return;

        const result = await handleApiCall(`${API_URL}/api/admin/experiences/${id}`, 'DELETE');
        if (result) {
            alert('Experience deleted successfully!');
            fetchDashboardData();
        }
    };

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">Manage Professional Experience</h3>
            <form onSubmit={handleSubmit} className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800">
                <h4 className="text-xl font-semibold text-cyan-400">{editingExperienceId ? 'Edit Experience' : 'Add New Experience'}</h4>
                
                <div className="flex space-x-4">
                    <input name="title" value={newExperience.title} onChange={handleChange} placeholder="Job Title (e.g., Full Stack Developer)" required className="w-1/2 p-2 border rounded-md bg-gray-700 text-white" />
                    <input name="company" value={newExperience.company} onChange={handleChange} placeholder="Company Name" required className="w-1/2 p-2 border rounded-md bg-gray-700 text-white" />
                </div>

                <div className="flex space-x-4">
                    <input name="startDate" value={newExperience.startDate} onChange={handleChange} placeholder="Start Date (e.g., Jan 2022)" required className="w-1/2 p-2 border rounded-md bg-gray-700 text-white" />
                    <input name="endDate" value={newExperience.endDate} onChange={handleChange} placeholder="End Date (e.g., Present)" required className="w-1/2 p-2 border rounded-md bg-gray-700 text-white" />
                </div>

                <textarea
                    name="description"
                    value={newExperience.description}
                    onChange={handleChange}
                    placeholder="Description & Responsibilities (one point per line)"
                    required
                    rows="4"
                    className="w-full p-2 border rounded-md bg-gray-700 text-white"
                ></textarea>

                <div className="flex space-x-4">
                    <button type="submit" disabled={isSubmitting} className={`bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}>
                        {isSubmitting ? 'Saving...' : (editingExperienceId ? 'Update Experience' : 'Add Experience')}
                    </button>
                    {editingExperienceId && (
                        <button type="button" onClick={resetForm} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600">
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            <h4 className="font-bold text-xl pt-4 border-t border-gray-700 text-cyan-400">Current Experience ({experiences.length})</h4>
            <div className="space-y-3">
                {experiences.map((exp) => (
                    <div key={exp._id} className="p-3 border rounded-lg flex justify-between items-center bg-gray-800">
                        <div>
                            <h5 className="font-bold text-white">{exp.title} at {exp.company}</h5>
                            <p className="text-xs text-gray-400">{exp.startDate} - {exp.endDate}</p>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => handleEdit(exp)} className="text-cyan-400 hover:text-cyan-300">Edit</button>
                            <button onClick={() => handleDelete(exp._id)} className="text-red-500 hover:text-red-400">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ExperienceContent;