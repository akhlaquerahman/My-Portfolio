import React, { useState, useEffect } from 'react';

// VITE Environment Variable को एक्सेस करने का सही तरीका
const API_URL = import.meta.env.VITE_API_URL;

// Hardcoded colors and icons mapping 
const COLOR_MAP = {
    'Full Stack': 'from-cyan-400 to-blue-500',
    'DevOps & Tools': 'from-indigo-400 to-purple-500',
    'Programming Languages': 'from-yellow-400 to-orange-500',
    'AI/ML': 'from-orange-400 to-red-500',
    'Soft Skills': 'from-green-400 to-teal-500', 
    DEFAULT: 'from-gray-400 to-gray-500',
};

const ICON_MAP = {
    // Web & Frontend
    'HTML': '🌐',
    'CSS': '🎨',
    'JavaScript': '📜',
    'React.js': '⚛️',
    'React Router': '🔗',
    'Tailwind CSS': '💨',
    'Bootstrap': '🅱️',

    // Backend
    'Node.js': '🟢',
    'Express.js': '🚂',
    'MongoDB': '🍃',
    'Mongoose': '🍂',
    'REST APIs': '🔗',
    'MySQL': '🐬',
    'Axios': '📡',
    'Postman': '📮',
    'JWT (JSON Web Tokens)': '🔐',
    'Bcrypt.js': '🔑',
    'Socket.io': '🟠',
    'WebRTC': '📹',
    'Twilio': '📞',
    'Cloudinary': '☁️',

    // Version Control & Deployment
    'Git': '🐙',
    'GitHub': '🐱',
    'Vercel': '▲',
    'Netlify': '🌐',
    'Render': '🎬',
    'Railway': '🚆',
    'Docker': '🐳',
    'AWS': '☁️',

    // Programming Languages
    'C': '©️',
    'C++': '⚡',
    'SQL': '🗄️',
    'Python': '🐍',
    'Java': '☕',
    'PHP': '🐘',

    // Python Libraries & AI/ML
    'Numpy': '📊',
    'Matplotlib': '📈',
    'Pandas': '🐼',
    'Scikit-learn': '🔬',
    'NLP': '🗣️',
    'Generative AI': '🤖',

    // Soft Skills
    'English Communication': '🗨️',
    'Teamwork & Collaboration': '🤝',
    'Problem-Solving & Critical Thinking': '🧠',
    'Time Management & Productivity': '⏰',
    'Adaptability & Flexibility': '🌱',
    'Leadership & Ownership': '🏆',
    'Emotional Intelligence (EQ)': '💡',
    'Presentation & Public Speaking': '🎤',

    // Default
    DEFAULT: '🛠️',
};

// Helper function to process the new data format
const processSkills = (rawSkills) => {
    return rawSkills.map(skillSet => {
        const skillsList = Array.isArray(skillSet.skills) ? skillSet.skills.map(skill => ({
            name: skill.name,
            icon: ICON_MAP[skill.name] || ICON_MAP.DEFAULT,
            level: skill.level, 
        })) : [];

        return {
            category: skillSet.category,
            color: COLOR_MAP[skillSet.category] || COLOR_MAP.DEFAULT, 
            skills: skillsList,
        };
    });
};


const SkillsSection = () => {
    const [processedSkills, setProcessedSkills] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeCategoryIndex, setActiveCategoryIndex] = useState(0);
    const [showAll, setShowAll] = useState(false);

    // --- DATA FETCHING LOGIC ---
    const fetchSkillsData = async () => {
        setLoading(true);
        setError(null);
        
        // 💡 API_URL Undefined चेक यहाँ भी लगाएं
        if (!API_URL) {
            setError('Configuration Error: Backend API URL is not set. Check your .env file.');
            setLoading(false);
            return;
        }

        try {
            const response = await fetch(`${API_URL}/api/admin/skills`);
            
            if (!response.ok) {
                throw new Error(`Failed to fetch skills. Status: ${response.status}`);
            }
            
            const rawData = await response.json();
            
            const dataForUI = processSkills(rawData);
            
            setProcessedSkills(dataForUI);
            
            if (dataForUI.length > 0) {
                setActiveCategoryIndex(0);
            }
        } catch (err) {
            console.error("Fetching error:", err);
            setError('Failed to load skills data. Please ensure the backend server is running and CORS is configured.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSkillsData();
    }, []); 
    
    const currentCategory = processedSkills[activeCategoryIndex] || { 
        category: 'Loading...', 
        color: COLOR_MAP.DEFAULT, 
        skills: [] 
    };

    // --- CONDITIONAL RENDERING (Missing UI added here) ---
    const loadingUI = (
        <div className="text-center py-20">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-cyan-400 mx-auto"></div>
            <p className="mt-4 text-xl text-gray-400">Loading skills...</p>
        </div>
    );

    const errorUI = (
        <div className="text-center py-20 bg-red-900/20 border border-red-700 rounded-lg max-w-lg mx-auto">
            <p className="text-xl font-semibold text-red-400">Error Loading Data</p>
            <p className="mt-2 text-red-300 text-sm">{error}</p>
        </div>
    );
    
    const noSkillsUI = (
        <div className="text-center py-20 bg-slate-800/50 border border-slate-700 rounded-lg max-w-lg mx-auto">
            <p className="text-xl font-semibold text-cyan-400">No Skills Found</p>
            <p className="mt-2 text-gray-400 text-sm">Please add some skills through the admin panel.</p>
        </div>
    );

    // Render checks
    if (loading) return loadingUI; 
    if (error) return errorUI; 
    if (processedSkills.length === 0) return noSkillsUI;
    
    return (
        <section id="skills" className="bg-slate-900 text-white min-h-screen py-16 px-4 md:px-8 relative overflow-hidden">
            <div className="container mx-auto max-w-7xl relative z-10">
                
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
                        My <span className="text-cyan-400">Skills</span>
                    </h2>
                    <p className="text-xl text-gray-300 max-w-3xl mx-auto mb-8">
                        A comprehensive toolkit of modern technologies and frameworks I use to build exceptional digital experiences
                    </p>
                    <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
                </div>

                {/* Category Filters */}
                <div className="flex flex-wrap justify-center gap-4 mb-12">
                    <button
                        onClick={() => setShowAll(!showAll)}
                        className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 ${
                            showAll 
                                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-lg shadow-cyan-500/25' 
                                : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700'
                        }`}
                    >
                        All Skills
                    </button>
                    {processedSkills.map((category, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                setActiveCategoryIndex(index);
                                setShowAll(false);
                            }}
                            className={`px-6 py-3 rounded-full font-semibold transition-all duration-300 cursor-pointer ${
                                activeCategoryIndex === index && !showAll
                                    ? `bg-gradient-to-r ${category.color} text-white shadow-lg`
                                    : 'bg-slate-800 text-gray-300 hover:bg-slate-700 border border-slate-700 hover:border-slate-600'
                            }`}
                        >
                            {category.category}
                        </button>
                    ))}
                </div>

                {/* Skills Display */}
                {showAll ? (
                    <div className="space-y-16">
                        {processedSkills.map((category, categoryIndex) => (
                            <div key={categoryIndex} className="animate-fade-in-up">
                                <h3 className={`text-2xl font-bold mb-8 bg-gradient-to-r ${category.color} bg-clip-text text-transparent`}>
                                    {category.category}
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
                                    {category.skills.map((skill, skillIndex) => (
                                        <div
                                            key={skillIndex}
                                            className="group bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/10"
                                        >
                                            <div className="text-center">
                                                <div className="text-3xl mb-3 group-hover:scale-110 transition-transform duration-300">
                                                    {skill.icon}
                                                </div>
                                                <p className="text-white font-semibold text-sm mb-3">{skill.name}</p>
                                                <div className="w-full bg-slate-700 rounded-full h-2 mb-2">
                                                    <div
                                                        className={`h-full rounded-full bg-gradient-to-r ${category.color} transition-all duration-1000`}
                                                        style={{ width: `${skill.level}%` }}
                                                    ></div>
                                                </div>
                                                <span className="text-xs text-gray-400">{skill.level}%</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="animate-fade-in-up">
                        <h3 className={`text-3xl font-bold text-center mb-12 bg-gradient-to-r ${currentCategory.color} bg-clip-text text-transparent`}>
                            {currentCategory.category}
                        </h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
                            {currentCategory.skills.map((skill, index) => (
                                <div
                                    key={index}
                                    className="group bg-slate-800/50 backdrop-blur-sm rounded-xl p-8 border border-slate-700/50 hover:border-cyan-400/50 transition-all duration-300 hover:scale-110 hover:shadow-xl hover:shadow-cyan-500/20"
                                >
                                    <div className="text-center">
                                        <div className="text-4xl mb-4 group-hover:scale-125 transition-transform duration-300">
                                            {skill.icon}
                                        </div>
                                        <p className="text-white font-bold text-lg mb-4">{skill.name}</p>
                                        <div className="w-full bg-slate-700 rounded-full h-3 mb-3">
                                            <div
                                                className={`h-full rounded-full bg-gradient-to-r ${currentCategory.color} transition-all duration-1000 ease-out`}
                                                style={{ width: `${skill.level}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm font-semibold text-cyan-400">{skill.level}%</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Animations */}
            <style jsx>{`
                @keyframes fade-in-up {
                    from {
                        opacity: 0;
                        transform: translateY(30px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
                
                .animate-fade-in-up {
                    animation: fade-in-up 0.8s ease-out;
                }
            `}</style>
        </section>
    );
};

export default SkillsSection;