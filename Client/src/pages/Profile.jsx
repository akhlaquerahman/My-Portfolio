// File: Profile.jsx (Admin Dashboard Main Component)
import React, { useState, useEffect, useCallback } from 'react';
import myPhoto from '../assets/my_photo.jpeg'; // Local fallback image

// Sabhi tab components ko import karein
import AboutContent from './tabs/AboutContent';
import SkillsContent from './tabs/SkillsContent';
import ProjectsContent from './tabs/ProjectsContent';
import MessagesContent from './tabs/MessagesContent';
import AccountContent from './tabs/AccountContent';
import ExperienceContent from './tabs/ExperienceContent';     // Naya component import
import CertificatesContent from './tabs/CertificateContent.jsx'; // Naya component import


// VITE Environment Variable ko access karein
const API_URL = import.meta.env.VITE_API_URL;

// Tabs ki list ko update karein
const tabs = [
    { id: 'About', label: 'Bio & Summary' },
    { id: 'Experience', label: 'Experience (CRUD)' },
    { id: 'Skills', label: 'Skills & Tech Stack' },
    { id: 'Projects', label: 'Projects (CRUD)' },
    { id: 'Certificates', label: 'Certificates (CRUD)' },
    { id: 'Messages', label: 'Contact Messages' },
    { id: 'Account', label: 'Personal Info 👤' },
];

const Profile = () => {
    const [activeTab, setActiveTab] = useState('About');
    
    // Sabhi sections ke liye state
    const [info, setInfo] = useState({});
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [messages, setMessages] = useState([]);
    const [experiences, setExperiences] = useState([]);     // Naya state
    const [certificates, setCertificates] = useState([]); // Naya state
    
    // UI states
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // API calls ke liye reusable function
    const handleApiCall = useCallback(async (url, method, body = null, isFormData = false) => {
        setError('');
        setSuccessMessage('');
        try {
            const options = { method, headers: {} };
            
            if (body) {
                if (isFormData) {
                    options.body = body;  
                } else {
                    options.headers['Content-Type'] = 'application/json';
                    options.body = JSON.stringify(body);
                }
            }
            
            // Yahan Authentication token add kar sakte hain
            // options.headers['Authorization'] = `Bearer ${YOUR_TOKEN}`;

            const response = await fetch(url, options);
            if (!response.ok) {
                const errorData = await response.json().catch(() => ({ message: `API call failed with status: ${response.status}` }));
                throw new Error(errorData.message);
            }
            return response.json();
        } catch (err) {
            console.error("API Call Error:", err.message);
            setError(err.message);
            return null;
        }
    }, []); 

    // Dashboard ka saara data fetch karne ke liye function
    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // Promise.all se sabhi API calls ek saath karein
            const [infoRes, skillsRes, projectsRes, messagesRes, expRes, certRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/info`),
                fetch(`${API_URL}/api/admin/skills`),
                fetch(`${API_URL}/api/admin/projects`),
                fetch(`${API_URL}/api/admin/messages`),
                fetch(`${API_URL}/api/admin/experiences`),  // Experience data fetch
                fetch(`${API_URL}/api/admin/certificates`), // Certificate data fetch
            ]);

            const [infoData, skillsData, projectsData, messagesData, expData, certData] = await Promise.all([
                infoRes.json(),
                skillsRes.json(),
                projectsRes.json(),
                messagesRes.json(),
                expRes.json(),
                certRes.json(),
            ]);

            // Sabhi states ko update karein
            setInfo(infoData);
            setSkills(skillsData);
            setProjects(projectsData);
            setMessages(messagesData);
            setExperiences(expData);
            setCertificates(certData);

        } catch (err) {
            setError('Failed to fetch dashboard data. Make sure the backend server is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, [API_URL]); 

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // About/Info section ko update karne ke liye handler
    const handleInfoUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData();
        Object.keys(info).forEach(key => {
            if (info[key] !== null && typeof info[key] !== 'object') { 
                formData.append(key, info[key]);
            }
        });
        
        const updatedData = await handleApiCall(`${API_URL}/api/admin/info`, 'PUT', formData, true);
        
        if (updatedData) {
            setInfo(updatedData); 
            setSuccessMessage('Bio and summary updated successfully! ✅');
        }
        setLoading(false);
    };

    // Active tab ke hisaab se component render karein
    const renderTabContent = () => {
        const commonProps = { 
            handleApiCall, 
            fetchDashboardData,
            info,
            setInfo,
            skills,
            projects,
            messages,
            experiences,
            certificates,
        };

        switch (activeTab) {
            case 'About':
                return <AboutContent {...commonProps} handleInfoUpdate={handleInfoUpdate} />; 
            case 'Experience':
                return <ExperienceContent {...commonProps} />;
            case 'Skills':
                return <SkillsContent {...commonProps} />;
            case 'Projects':
                return <ProjectsContent {...commonProps} />;
            case 'Certificates':
                return <CertificatesContent {...commonProps} />;
            case 'Messages':
                return <MessagesContent {...commonProps} />;
            case 'Account':
                return <AccountContent {...commonProps} />;
            default: return null;
        }
    };

    if (loading) return <div className="text-center py-10 bg-gray-900 text-white min-h-screen">Loading Dashboard...</div>;

    const unreadMessageCount = messages.filter(m => !m.isRead).length;
    const profileImgSrc = info.profileImageUrl || myPhoto;

    return (
        <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center py-12 px-4 md:px-8">
            <div className="container mx-auto max-w-6xl">
                <h1 className="text-4xl font-extrabold text-center text-cyan-400 mb-8">Admin Dashboard</h1>
                
                {successMessage && <div className="bg-green-800 text-white p-4 rounded-lg mb-6 text-center">{successMessage}</div>} 
                {error && <div className="bg-red-900 text-red-300 p-4 rounded-lg mb-6 text-center">{error}</div>}

                <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl flex flex-col md:flex-row gap-8">
                    
                    {/* Left Sidebar for Navigation */}
                    <div className="md:w-1/4">
                        <div className="flex items-center space-x-4 mb-8 border-b border-gray-700 pb-4">
                            <img 
                                src={profileImgSrc} 
                                alt="Profile" 
                                className="w-16 h-16 rounded-full border-2 border-indigo-400 object-cover" 
                                onError={(e) => { e.target.onerror = null; e.target.src = myPhoto; }}
                            />
                            <div>
                                <h2 className="text-xl font-bold">{info.name || 'Admin'}</h2>
                                <p className="text-sm text-gray-400">Portfolio Manager</p>
                            </div>
                        </div>
                        <nav>
                            <ul className="space-y-2">
                                {tabs.map(tab => (
                                    <li key={tab.id}>
                                        <button
                                            onClick={() => setActiveTab(tab.id)}
                                            className={`w-full text-left p-3 rounded-lg font-semibold transition-colors duration-200 flex justify-between items-center ${
                                                activeTab === tab.id ? 'bg-indigo-600 text-white shadow-lg' : 'hover:bg-gray-700 text-gray-300'
                                            }`}
                                        >
                                            <span>{tab.label}</span>
                                            <span className="text-xs">
                                                {tab.id === 'Experience' && `(${experiences.length})`}
                                                {tab.id === 'Projects' && `(${projects.length})`}
                                                {tab.id === 'Certificates' && `(${certificates.length})`}
                                                {tab.id === 'Messages' && unreadMessageCount > 0 && 
                                                    <span className="bg-red-500 text-white font-bold px-2 py-0.5 rounded-full ml-2">{unreadMessageCount}</span>}
                                                {tab.id === 'Messages' && unreadMessageCount === 0 && `(${messages.length})`}
                                            </span>
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                    
                    {/* Main Content Area */}
                    <div className="md:w-3/4 bg-gray-900 p-8 rounded-xl shadow-inner border border-gray-700/50">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;