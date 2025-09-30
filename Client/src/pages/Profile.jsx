// File: Profile.jsx (Admin Dashboard Main Component)
import React, { useState, useEffect, useCallback } from 'react';
import myPhoto from '../assets/my_photo.jpeg'; // Local fallback image
import AboutContent from './tabs/AboutContent';
import SkillsContent from './tabs/SkillsContent';
import ProjectsContent from './tabs/ProjectsContent';
import MessagesContent from './tabs/MessagesContent';
import AccountContent from './tabs/AccountContent';

// VITE Environment Variable को एक्सेस करें
const API_URL = import.meta.env.VITE_API_URL;

const tabs = [
    { id: 'About', label: 'Bio & Summary' },
    { id: 'Skills', label: 'Skills & Tech Stack' },
    { id: 'Projects', label: 'Projects (CRUD)' },
    { id: 'Messages', label: 'Contact Messages' },
    { id: 'Account', label: 'Personal Info 👤' },
];

const Profile = () => {
    const [activeTab, setActiveTab] = useState('About');
    const [info, setInfo] = useState({});
    const [skills, setSkills] = useState([]);
    const [projects, setProjects] = useState([]);
    const [messages, setMessages] = useState([]); 
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Success message state

    // --- 1. API Helper Function ---
    // isFormData flag determines how Content-Type header is handled.
    const handleApiCall = useCallback(async (url, method, body = null, isFormData = false) => {
        setError('');
        setSuccessMessage('');
        try {
            const options = { method, headers: {} };
            
            if (body) {
                if (isFormData) {
                    // FormData के लिए Content-Type सेट नहीं किया जाता है
                    options.body = body; 
                } else {
                    // JSON data के लिए Content-Type सेट करें
                    options.headers['Content-Type'] = 'application/json';
                    options.body = JSON.stringify(body);
                }
            }
            
            // NOTE: Authentication token भेजने का logic यहाँ जोड़ें अगर route protected है:
            // options.headers['Authorization'] = `Bearer ${YOUR_AUTH_TOKEN}`;

            const response = await fetch(url, options);
            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                let errorData = { message: `API call failed with status: ${response.status}` };
                
                if (contentType && contentType.indexOf("application/json") !== -1) {
                    errorData = await response.json();
                } else {
                     errorData.message = await response.text() || errorData.message;
                }

                throw new Error(errorData.message);
            }
            return response.json();
        } catch (err) {
            console.error("API Call Error:", err.message);
            setError(err.message);
            return null;
        }
    }, []); 

    // --- 2. Data Fetching Function ---
    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            // NOTE: Production में fetch calls को handleApiCall के माध्यम से token के साथ भेजना बेहतर है
            const [infoRes, skillsRes, projectsRes, messagesRes] = await Promise.all([
                fetch(`${API_URL}/api/admin/info`),
                fetch(`${API_URL}/api/admin/skills`),
                fetch(`${API_URL}/api/admin/projects`),
                fetch(`${API_URL}/api/admin/messages`)
            ]);

            const [infoData, skillsData, projectsData, messagesData] = await Promise.all([
                infoRes.json(),
                skillsRes.json(),
                projectsRes.json(),
                messagesRes.json()
            ]);

            setInfo(infoData);
            setSkills(skillsData);
            setProjects(projectsData);
            setMessages(messagesData); 

        } catch (err) {
            setError('Failed to fetch dashboard data. Ensure backend is running.');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }, []); 

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    // --- 3. CRITICAL FIX: handleInfoUpdate (Using FormData) ---
    const handleInfoUpdate = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccessMessage('');

        // 💡 FIX: Backend route पर Multer लगा है, इसलिए FormData का उपयोग ज़रूरी है।
        const formData = new FormData();

        // info state के सभी text fields को FormData में append करें
        Object.keys(info).forEach(key => {
            // Arrays या objects को छोड़ दें, या उन्हें JSON.stringify करके भेजें अगर backend accept करता है।
            // यहाँ हम सिर्फ primitive values (text/number fields) भेज रहे हैं।
            if (info[key] !== null && typeof info[key] !== 'object') { 
                formData.append(key, info[key]);
            }
        });
        
        // profileImage field को भी append करें, भले ही वह खाली हो
        formData.append('profileImage', null); 

        const updatedData = await handleApiCall(
            `${API_URL}/api/admin/info`, 
            'PUT', 
            formData, 
            true // 💡 isFormData: true
        );

        if (updatedData) {
            setInfo(updatedData); 
            setSuccessMessage('Bio and summary updated successfully! ✅');
        }
        setLoading(false);
    };


    // --- 4. Tab Content Rendering ---
    const renderTabContent = () => {
        const commonProps = { 
            handleApiCall, 
            fetchDashboardData,
            info,
            setInfo,
            skills,
            projects,
            messages
        };

        switch (activeTab) {
            case 'About':
                // 💡 AboutContent को update handler पास करें
                return <AboutContent {...commonProps} handleInfoUpdate={handleInfoUpdate} />; 
            case 'Skills':
                return <SkillsContent {...commonProps} />;
            case 'Projects':
                return <ProjectsContent {...commonProps} />;
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
                                <p className="text-sm text-gray-400">MERN Stack Manager</p>
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
                                                {tab.id === 'Projects' && `(${projects.length})`}
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
                    
                    <div className="md:w-3/4 bg-gray-900 p-8 rounded-xl shadow-inner border border-gray-700/50">
                        {renderTabContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;