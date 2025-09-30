import React, { useState } from 'react';

const API_URL = import.meta.env.VITE_API_URL;
const SKILLS_CATEGORIES = ['Full Stack', 'DevOps & Tools', 'Programming Languages', 'AI/ML', 'Soft Skills'];

// Helper function to convert "Skill:Level, Skill2:Level2" string to Array of Objects
const parseSkillsInput = (inputString) => {
    return String(inputString)
        .split(',')
        .map(pair => {
            const [name, level] = pair.split(':').map(s => s.trim());
            // Basic validation
            if (name && level !== undefined && !isNaN(Number(level))) {
                return { name, level: Number(level) };
            }
            return null; // Ignore invalid pairs
        })
        .filter(skill => skill !== null);
};


// --- Sub-Component: SkillSetItem (For managing existing skills) ---
const SkillSetItem = ({ skillSet, handleApiCall, fetchDashboardData }) => {
    const [isEditing, setIsEditing] = useState(false);
    
    // Convert array of objects back to "Name:Level, Name2:Level2" string for editing
    const skillListString = Array.isArray(skillSet.skills) 
        ? skillSet.skills.map(s => `${s.name}:${s.level}`).join(', ') 
        : '';
        
    const [localSkillSet, setLocalSkillSet] = useState({ 
        ...skillSet,
        // 💡 CHANGE: Use the new string format for editing
        skillsInput: skillListString,
    });

    // 2. EDIT / UPDATE Existing Skill Set (Uses PUT)
    const handleUpdate = async () => {
        // 💡 CHANGE: Parse the string input into the new array format
        const skillsArray = parseSkillsInput(localSkillSet.skillsInput);
        
        if (!localSkillSet.category || skillsArray.length === 0) {
             alert("Category name and skill list cannot be empty. Format: Skill:Level, Skill2:Level2");
             return;
        }

        // 2. Data to send to API: (Assuming backend model expects 'skills' array of objects)
        const dataToSend = {
             category: localSkillSet.category,
             skills: skillsArray, // 💡 CHANGE: Send array of objects
        };

        // 3. API Call: **UPDATED to use PUT request to /api/admin/skills/:id**
        const result = await handleApiCall(
            `${API_URL}/api/admin/skills/${localSkillSet._id}`, 
            'PUT', 
            dataToSend
        ); 
        
        if (result) {
            alert(`Skill set for ${localSkillSet.category} updated successfully!`);
            setIsEditing(false);
            fetchDashboardData();
        }
    };
    
    // 3. DELETE Skill Set (Uses DELETE) - remains the same
    const handleSkillDelete = async (id) => {
        if (!window.confirm(`Are you sure you want to delete the ${skillSet.category} category?`)) return;
        const result = await handleApiCall(`${API_URL}/api/admin/skills/${id}`, 'DELETE');
        if (result) {
          alert('Skill set deleted!');
          fetchDashboardData();
        }
    };

    if (isEditing) {
        return (
            <div className="p-4 rounded-lg border border-indigo-600 bg-gray-700 space-y-3">
                <h4 className="block text-lg font-medium text-cyan-400">Editing Existing Skill Set:</h4>
                {/* Category Name Input (remains the same) */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">Category Name</label>
                    <input
                        type="text"
                        value={localSkillSet.category}
                        onChange={(e) => setLocalSkillSet({ ...localSkillSet, category: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 shadow-sm p-3 text-white"
                        required
                    />
                </div>
                {/* 💡 CHANGE: Skills Input Field (Now takes Level) */}
                <div className="space-y-2">
                    <label className="block text-sm font-medium text-gray-400">
                        Skills & Level (Format: SkillName:Level, Skill2:Level2)
                    </label>
                    <textarea
                        value={localSkillSet.skillsInput}
                        onChange={(e) => setLocalSkillSet({ ...localSkillSet, skillsInput: e.target.value })}
                        className="mt-1 block w-full rounded-md border-gray-600 bg-gray-800 shadow-sm p-3 text-white"
                        rows="3"
                        placeholder="e.g., HTML:90, CSS:85, React:75"
                        required
                    />
                </div>
                {/* ❌ REMOVED: Single Skill Level Input */}
                
                <div className="flex justify-end mt-4 space-x-2">
                    <button 
                        type="button"
                        onClick={handleUpdate} 
                        className="text-sm bg-green-600 text-white py-1 px-3 rounded-md hover:bg-green-700 transition-colors">
                        Save Changes
                    </button>
                    <button 
                        type="button"
                        onClick={() => setIsEditing(false)} 
                        className="text-sm bg-gray-500 text-white py-1 px-3 rounded-md hover:bg-gray-600 transition-colors">
                        Cancel
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="p-4 rounded-lg border border-gray-700 bg-gray-800 space-y-3">
            <div className="flex justify-between items-center mb-2">
                <h4 className="block text-lg font-medium text-white capitalize">{skillSet.category}</h4>
                <div className="flex space-x-2">
                    <button 
                        onClick={() => setIsEditing(true)}
                        className="text-sm bg-blue-600 text-white py-1 px-3 rounded-md hover:bg-blue-700 transition-colors">
                        Edit
                    </button>
                    <button 
                        onClick={() => handleSkillDelete(skillSet._id)}
                        className="text-sm bg-red-600 text-white py-1 px-3 rounded-md hover:bg-red-700 transition-colors">
                        Delete
                    </button>
                </div>
            </div>
            {/* 💡 CHANGE: Display skills with their individual levels (if model is updated) */}
            <div className="text-sm text-gray-300">
                {Array.isArray(skillSet.skills) 
                    ? skillSet.skills.map(s => `${s.name} (${s.level}%)`).join(', ')
                    : 'No skills found'}
            </div>
        </div>
    );
};

// --- Main Component: SkillsContent (New Category Form Updated) ---
const SkillsContent = ({ skills, handleApiCall, fetchDashboardData }) => {
    // 💡 CHANGE: Remove 'level' from state
    const [newSkillCategory, setNewSkillCategory] = useState({ category: '', skillsInput: '' }); 
    const [error, setError] = useState('');

    // 1. ADD NEW Skill Set (Uses POST)
    const handleAddNewCategory = async (e) => {
        e.preventDefault();
        setError('');

        const { category, skillsInput } = newSkillCategory;

        // 💡 CHANGE: Parse skills string
        const skillsArray = parseSkillsInput(skillsInput); 
        
        if (!category || skillsArray.length === 0) {
          setError("Category and skill list are required. Format: Skill:Level, Skill2:Level2");
          return;
        }

        const existingCategory = skills.find(s => s.category === category);
        
        if (existingCategory) {
             setError(`Error: The category '${category}' already exists. Please use the 'Edit' button.`);
             return;
        }

        // API Call: POST request to /api/admin/skills for creation 
        const result = await handleApiCall(`${API_URL}/api/admin/skills`, 'POST', { 
            category: category, 
            skills: skillsArray, // 💡 CHANGE: Send array of objects
        });
        
        if (result) {
          alert(`New skill category '${category}' added!`);
          setNewSkillCategory({ category: '', skillsInput: '' }); // 💡 CHANGE: Reset state
          fetchDashboardData();
        }
    };

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold mb-4 text-cyan-400">Manage Skills Categories</h3>
            {error && <div className="bg-red-900 text-red-300 p-2 rounded-md mb-4">{error}</div>}

            {/* 1. Add New Skill Category Form (Creation) */}
            <form onSubmit={handleAddNewCategory} className="pt-4 border-t border-gray-700">
                <h4 className="font-bold text-lg mb-2 text-cyan-400">Add New Category</h4>
                {/* Select Category (remains the same) */}
                <select 
                    name="category" 
                    value={newSkillCategory.category} 
                    onChange={(e) => setNewSkillCategory({ ...newSkillCategory, category: e.target.value })} 
                    required 
                    className="w-full p-2 border rounded-md bg-gray-700 text-white mb-2"
                >
                    <option value="">Select Category</option>
                    {SKILLS_CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
                
                {/* 💡 CHANGE: Skill Name and Level Input Field */}
                <input 
                    type="text" 
                    value={newSkillCategory.skillsInput} 
                    onChange={(e) => setNewSkillCategory({ ...newSkillCategory, skillsInput: e.target.value })} 
                    placeholder="Skills and Levels (e.g., HTML:90, CSS:85)" 
                    className="w-full p-2 border rounded-md bg-gray-700 text-white mb-3" 
                    required
                />
                
                {/* ❌ REMOVED: Old Level Input Field */}
                
                <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700">Add New Category</button>
            </form>
            
            {/* 2. Existing Skills List (Edit & Delete) */}
            <h4 className="font-bold text-xl pt-4 border-t border-gray-700 text-cyan-400">Existing Skill Sets ({skills.length})</h4>
            {skills.map((skillSet) => (
                <SkillSetItem 
                    key={skillSet._id} 
                    skillSet={skillSet} 
                    handleApiCall={handleApiCall} 
                    fetchDashboardData={fetchDashboardData} 
                />
            ))}
        </div>
    );
};

export default SkillsContent;