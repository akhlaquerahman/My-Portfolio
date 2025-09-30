// File: src/components/tabs/ProjectsContent.jsx (UPDATED)
import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;

const PROJECT_CATEGORIES = ['Full Stack', 'Frontend', 'Backend', 'AI/ML'];
const PROJECT_FEATURED = [
    { key: 'false', label: 'No (Standard)' },
    { key: 'true', label: 'Yes (Featured)' }
];

const ProjectsContent = ({ projects, handleApiCall, fetchDashboardData }) => {
    const initialState = { 
        title: '', 
        description: '', 
        githubUrl: '', 
        liveUrl: '', 
        category: PROJECT_CATEGORIES[0], 
        featured: false,
        imageUrl: '',
        imagePublicId: '', 
        projectFile: null, // Holds the File object for upload
    };
    const [newProject, setNewProject] = useState(initialState);
    const [editingProjectId, setEditingProjectId] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false); // NEW: Submitting state

    const resetProjectForm = () => {
        setEditingProjectId(null);
        setNewProject(initialState);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setNewProject({ ...newProject, [name]: value });
    };

    const handleFileChange = (e) => {
        setNewProject({ ...newProject, projectFile: e.target.files[0] });
    };

    const handleProjectSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const method = editingProjectId ? 'PUT' : 'POST';
        const url = editingProjectId ? `${API_URL}/api/admin/projects/${editingProjectId}` : `${API_URL}/api/admin/projects`;
        
        // 1. Check file requirement
        if (!editingProjectId && !newProject.projectFile) {
            alert('Please select a project image for the new project.');
            setIsSubmitting(false);
            return;
        }

        // 2. Create FormData
        const formData = new FormData();
        
        // Append file if present
        if (newProject.projectFile) {
            formData.append('projectScreenshot', newProject.projectFile); // Matches multer field name
        }
        
        // Append all text/select fields
        for (const key in newProject) {
            // Skip the file object itself and URL/ID fields unless explicitly needed for the backend logic
            if (key === 'projectFile' || key === 'imageUrl' || newProject[key] === null) continue;

            // Send old public ID for PUT if we are keeping the old image OR uploading a new one.
            // The backend logic checks the key 'imagePublicId' in req.body to know what to delete.
            if (editingProjectId && key === 'imagePublicId') {
                formData.append(key, newProject[key] || ''); 
            } else if (key !== 'imagePublicId') {
                 // Send all other fields including featured (converted to string)
                formData.append(key, newProject[key]);
            }
        }
        
        const result = await handleApiCall(url, method, formData, true); // true for isFormData
        
        if (result) {
            alert(`Project ${editingProjectId ? 'updated' : 'added'} successfully!`);
            resetProjectForm();
            fetchDashboardData(); 
        }
        setIsSubmitting(false);
    };

    const handleProjectDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this project?')) return;
        
        // Backend DELETE route handles finding the publicId and deleting the image
        const result = await handleApiCall(`${API_URL}/api/admin/projects/${id}`, 'DELETE');
        
        if (result) {
            alert('Project deleted successfully! (Image removed from Cloudinary)');
            fetchDashboardData();
        }
    };

    const handleProjectEdit = (project) => {
        setEditingProjectId(project._id);
        setNewProject({
            title: project.title,
            description: project.description,
            githubUrl: project.githubUrl,
            liveUrl: project.liveUrl,
            category: project.category,
            featured: project.featured || false,
            // Store existing image details
            imageUrl: project.imageUrl,
            imagePublicId: project.imagePublicId, 
            projectFile: null, // Clear file selection on edit start
        });
    };

    // Helper to determine image source for preview
    const getPreviewUrl = () => {
        if (newProject.projectFile) {
            return URL.createObjectURL(newProject.projectFile);
        }
        // Fallback to URL from API or placeholder
        return newProject.imageUrl || 'https://placehold.co/64x64/2D3748/A0AEC0?text=NO+IMG';
    };


    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">Manage Projects (CRUD)</h3>
            <form onSubmit={handleProjectSubmit} className="space-y-4 p-4 border border-gray-700 rounded-lg bg-gray-800">
                <h4 className="text-xl font-semibold text-cyan-400">{editingProjectId ? 'Edit Project' : 'Add New Project'}</h4>
                
                {/* Image Preview and File Input */}
                <div className='flex items-center space-x-4 p-2 border border-slate-700 rounded-md'>
                    <img 
                        src={getPreviewUrl()} 
                        alt="Project Preview" 
                        className="w-16 h-16 object-cover rounded-md bg-slate-700"
                    />
                    <div className='flex-1'>
                        <label className="block text-sm font-medium text-gray-400">Project Screenshot {editingProjectId ? '' : '*'}</label>
                        <input 
                            type="file" 
                            name="projectScreenshot" 
                            onChange={handleFileChange} 
                            required={!editingProjectId} // Required only for new projects
                            className="w-full p-1 border rounded-md bg-gray-700 text-white text-sm" 
                            accept="image/*"
                        />
                         {editingProjectId && <p className="text-xs text-gray-500 mt-1">Leave blank to keep existing image. Current ID: {newProject.imagePublicId ? 'Set' : 'N/A'}</p>}
                    </div>
                </div>

                {/* Form Fields */}
                <div className='flex space-x-4'>
                    <input name="title" value={newProject.title} onChange={handleChange} placeholder="Project Title" required className="w-full p-2 border rounded-md bg-gray-700 text-white" />
                    <select name="category" value={newProject.category} onChange={handleChange} required className="w-1/3 p-2 border rounded-md bg-gray-700 text-white">
                        {PROJECT_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                    </select>
                    <select 
                        name="featured" 
                        value={String(newProject.featured)} 
                        onChange={handleChange} 
                        required 
                        className="w-1/3 p-2 border rounded-md bg-gray-700 text-white"
                    >
                        {PROJECT_FEATURED.map(fea => <option key={fea.key} value={fea.key}>{fea.label}</option>)}
                    </select>
                </div>
                <textarea name="description" value={newProject.description} onChange={handleChange} placeholder="Project Description" required className="w-full p-2 border rounded-md bg-gray-700 text-white"></textarea>
                
                {/* URLs */}
                <input name="githubUrl" value={newProject.githubUrl} onChange={handleChange} placeholder="GitHub URL" required className="w-full p-2 border rounded-md bg-gray-700 text-white" />
                <input name="liveUrl" value={newProject.liveUrl} onChange={handleChange} placeholder="Live Demo URL (Optional)" className="w-full p-2 border rounded-md bg-gray-700 text-white" />
                
                <div className="flex space-x-4">
                    <button type="submit" disabled={isSubmitting} className={`bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 transition-colors ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}>
                        {isSubmitting ? 'Processing...' : (editingProjectId ? 'Update Project' : 'Add Project')}
                    </button>
                    {editingProjectId && (
                        <button type="button" onClick={resetProjectForm} className="bg-gray-500 text-white py-2 px-4 rounded-md hover:bg-gray-600 transition-colors">
                            Cancel Edit
                        </button>
                    )}
                </div>
            </form>

            {/* Current Projects List */}
            <h4 className="font-bold text-xl pt-4 border-t border-gray-700 text-cyan-400">Current Projects ({projects.length})</h4>
            <div className="space-y-3">
                {projects.map((project) => (
                    <div key={project._id} className="p-3 border rounded-lg flex justify-between items-center bg-gray-800">
                        <div className="flex items-center space-x-3">
                             <img 
                                src={project.imageUrl}
                                alt="Project thumbnail"
                                className="w-10 h-10 object-cover rounded-md"
                            />
                            <div>
                                <h5 className="font-bold text-white">{project.title}</h5>
                                <p className="text-xs text-gray-400">Category: {project.category} {project.featured && <span className='text-yellow-400'>(Featured)</span>}</p>
                            </div>
                        </div>
                        <div className="flex space-x-2">
                            <button onClick={() => handleProjectEdit(project)} className="text-cyan-400 hover:text-cyan-300">Edit</button>
                            <button onClick={() => handleProjectDelete(project._id)} className="text-red-500 hover:text-red-400">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProjectsContent;