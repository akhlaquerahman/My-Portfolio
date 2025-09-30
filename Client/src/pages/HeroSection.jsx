import React, { useState, useEffect } from 'react';
import myPhoto from '../assets/my_photo.jpeg'; // Local fallback image

// VITE Environment Variable को एक्सेस करें
const API_URL = import.meta.env.VITE_API_URL;

const HeroSection = () => {
    const [info, setInfo] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Default social media links 
    const DEFAULT_LINKS = {
      linkedin: "https://linkedin.com/in/akhlaque-rahman-6b1410293",
      twitter: "https://x.com/Akhlaque9631",
      instagram: "https://www.instagram.com/mr__.rahman_/?hl=en",
      facebook: "https://www.facebook.com/akhlaque.rahman.92",
      github: "https://github.com/AkhlaqueRahman"
    };

    const roles = [
      'Full Stack Developer',
      'AI/ML Engineer',
      'MERN Stack Developer',
      'Frontend Developer',
      'Backend Developer',
      'UI/UX Designer'
    ];

    const [currentRoleIndex, setCurrentRoleIndex] = useState(0);

    // --- Data Fetching and Role Rotation Logic ---
    useEffect(() => {
      const fetchAccountInfo = async () => {
        try {
          // Frontend is fetching the public /info route
          const response = await fetch(`${API_URL}/api/admin/info`); 
          if (!response.ok) {
            throw new Error('Failed to fetch account info');
          }
          const data = await response.json();
          setInfo(data);
          setLoading(false);
        } catch (err) {
          setError('Failed to load profile data. Check server.');
          setLoading(false);
        }
      };

      fetchAccountInfo();

      // Role Rotation
      const interval = setInterval(() => {
        setCurrentRoleIndex((prevIndex) => (prevIndex + 1) % roles.length);
      }, 2000);

      return () => clearInterval(interval);
    }, [roles.length]);

    // --- Loading and Error States ---
    if (loading) {
      return <div className="text-center text-white py-20 bg-slate-900 min-h-screen">Loading Hero Section...</div>;
    }

    if (error) {
      return <div className="text-center text-red-400 py-20 bg-slate-900 min-h-screen">{error}</div>;
    }
     
    // Helper function to safely get the correct URL (API data or default)
    const getLink = (key) => info[key] && info[key].startsWith('http') ? info[key] : DEFAULT_LINKS[key];

    // Determine image source (Database URL or local fallback)
    const profileImgSrc = info.profileImageUrl || myPhoto;

    return (
      <section id="hero" className="bg-slate-900 text-white min-h-screen py-12 px-4 md:px-8 relative overflow-hidden flex flex-col">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-20 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        </div>
        
        {/* Main Content Container */}
        <div className="container mx-auto flex flex-col lg:flex-row items-center justify-between gap-12 max-w-7xl relative z-10 flex-grow">
          
          {/* Left Section: Image with Glow Effect */}
          <div className="lg:w-1/2 flex justify-center lg:justify-start order-2 lg:order-1">
            <div className="relative">
              {/* Glowing Background Circle and Ring */}
              <div className="absolute inset-0 w-80 h-80 md:w-96 md:h-96 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-80 h-80 md:w-96 md:h-96 rounded-full bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 p-1 shadow-2xl">
                <div className="w-full h-full bg-slate-900 rounded-full p-4 flex items-center justify-center">
                  <img
                    src={profileImgSrc} 
                    alt="Profile"
                    className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-full transition-transform duration-300 hover:scale-105"
                    onError={(e) => { e.target.onerror = null; e.target.src = myPhoto; }}
                  />
                </div>
              </div>

              {/* Floating Elements */}
              <div className="absolute -top-4 -right-4 w-8 h-8 bg-cyan-400 rounded-full animate-bounce delay-300"></div>
              <div className="absolute -bottom-6 -left-6 w-6 h-6 bg-blue-400 rounded-full animate-bounce delay-700"></div>
              <div className="absolute top-1/2 -left-8 w-4 h-4 bg-purple-400 rounded-full animate-bounce delay-1000"></div>
            </div>
          </div>

          {/* Right Section: Text Content */}
          <div className="lg:w-1/2 text-center lg:text-left order-1 lg:order-2">
            <p className="text-lg text-cyan-400 font-semibold mb-2 animate-fade-in-up">
              Hello, I'm
            </p>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-red-400 to-green-500 bg-clip-text text-transparent mb-3">
              {info.name || 'Akhlaque Rahman'}
            </h1>
            <h2 className="text-xl md:text-2xl lg:text-3xl font-medium mb-4 animate-fade-in-up-delay-2 min-h-[3rem] flex items-center justify-center lg:justify-start">
              And I'm a <span className="text-cyan-400 ml-2 transition-all duration-500 ease-in-out transform">{roles[currentRoleIndex]}</span>
            </h2>
            
            {/* 💡 EMAIL and PHONE DISPLAY (FETCHED FROM DB) */}
            <div className='flex flex-wrap gap-x-6 gap-y-2 justify-center lg:justify-start mb-6 text-sm text-gray-400 animate-fade-in-up-delay-3'>
                {/* Email */}
                {info.email && (
                    <p className='flex items-center space-x-2'>
                        <span className='text-cyan-400'>📧</span>
                        <a 
                           href={`mailto:${info.email}`} 
                           className="hover:text-cyan-400 transition-colors duration-200"
                        >
                           {info.email}
                        </a>
                    </p>
                )}
                {/* Phone */}
                {info.phone && (
                    <p className='flex items-center space-x-2'>
                        <span className='text-cyan-400'>📞</span>
                        <a 
                           href={`tel:${info.phone}`} 
                           className="hover:text-cyan-400 transition-colors duration-200"
                        >
                           {info.phone}
                        </a>
                    </p>
                )}
            </div>
            {/* END EMAIL/PHONE */}


            <p className="text-base md:text-lg text-gray-300 mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed animate-fade-in-up-delay-3">
              {info.summary || 'A Full Stack Developer specializing in the MERN stack...'}
            </p>

            {/* Social Media Icons */}
            <div className="flex justify-center lg:justify-start space-x-4 mb-8 animate-fade-in-up-delay-4">
              {/* LinkedIn */}
              <a href={getLink('linkedin')} target="_blank" rel="noopener noreferrer" title="LinkedIn" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              </a>

              {/* Github */}
              <a href={getLink('github')} target="_blank" rel="noopener noreferrer" title="GitHub" className="w-10 h-10 bg-slate-800 hover:bg-gray-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d='M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.84 1.236 1.84 1.236 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.3-5.467-1.334-5.467-5.93 0-1.31.468-2.38 1.236-3.22-.124-.303-.535-1.523.117-3.176 0 0 1.008-.322 3.301 1.23a11.52 11.52 0 013.003-.404c1.018.005 2.045.138 3.003.404 2.291-1.552 3.297-1.23 3.297-1.23 .653 1.653 .242 2 .118 3 .77 .84 1 .91 1 .91 .77 .84 .118 2 .118 3 .77 .84 .118z'/></svg>
              </a>
              
              {/* Twitter (X) */}
              <a href={getLink('twitter')} target="_blank" rel="noopener noreferrer" title="Twitter" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              
              {/* Instagram */}
              <a href={getLink('instagram')} target="_blank" rel="noopener noreferrer" title="Instagram" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1.5 15h3a1.5 1.5 0 001.5-1.5v-7A1.5 1.5 0 0013.5 6h-3A1.5 1.5 0 009 7.5v7A1.5 1.5 0 0010.5 17zM12 10a2 2 0 100 4 2 2 0 000-4zm4.5-3.5a1 1 0 100 2 1 1 0 000-2z"/></svg>
              </a>
              
              {/* Facebook */}
              <a href={getLink('facebook')} target="_blank" rel="noopener noreferrer" title="Facebook" className="w-10 h-10 bg-slate-800 hover:bg-blue-600 rounded-lg flex items-center justify-center transition-all duration-300 hover:scale-110">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M22.676 0H1.324C.592 0 0 .592 0 1.324v21.352C0 23.408.592 24 1.324 24h11.492v-9.294H9.688V10.37h3.128V7.933c0-3.128 1.893-4.819 4.653-4.819 1.324 0 2.46.099 2.798.143v3.238h-1.99c-1.564 0-1.875.741-1.875 1.839v2.54h3.518l-.57 3.518h-2.948V24h6.115c.732 0 1.324-.592 1.324-1.324V1.324C24 .592 23.408 0 22.676 0z"/></svg>
              </a>
            </div>

          </div>
        </div>

        {/* Stats Section */}
        <div className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-lg border-t border-cyan-500/30 relative z-10 shadow-2xl mt-auto">
          <div className="container mx-auto px-4 py-10">
            <h3 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">
              My <span className="text-cyan-400">Achievements</span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
              <div className="group hover:scale-110 transition-all duration-300 bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/80 border border-slate-600/50 hover:border-cyan-400/50">
                <div className="text-3xl mb-2">💼</div>
                <h4 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300">{info.experience}+</h4>
                <p className="text-gray-300 text-xs font-medium">Years Experience</p>
              </div>
              
              <div className="group hover:scale-110 transition-all duration-300 bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/80 border border-slate-600/50 hover:border-cyan-400/50">
                <div className="text-3xl mb-2">🚀</div>
                <h4 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300">{info.project}+</h4>
                <p className="text-gray-300 text-xs font-medium">Projects Completed</p>
              </div>
              
              <div className="group hover:scale-110 transition-all duration-300 bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/80 border border-slate-600/50 hover:border-cyan-400/50">
                <div className="text-3xl mb-2">🏆</div>
                <h4 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300">{info.hackathon}+</h4>
                <p className="text-gray-300 text-xs font-medium">Hackathons</p>
              </div>
              
              <div className="group hover:scale-110 transition-all duration-300 bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/80 border border-slate-600/50 hover:border-cyan-400/50">
                <div className="text-3xl mb-2">🎓</div>
                <h4 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300">{info.certificate}+</h4>
                <p className="text-gray-300 text-xs font-medium">Certificates</p>
              </div>
              
              <div className="group hover:scale-110 transition-all duration-300 bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/80 border border-slate-600/50 hover:border-cyan-400/50">
                <div className="text-3xl mb-2">⭐</div>
                <h4 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300">{info.award}</h4>
                <p className="text-gray-300 text-xs font-medium">Awards Won</p>
              </div>
              
              <div className="group hover:scale-110 transition-all duration-300 bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/80 border border-slate-600/50 hover:border-cyan-400/50">
                <div className="text-3xl mb-2">💡</div>
                <h4 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300">{info.technology}+</h4>
                <p className="text-gray-300 text-xs font-medium">Technologies</p>
              </div>
            </div>
            
            {/* Additional Achievement Details */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 text-sm max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Passion-driven developer with expertise in modern web technologies, AI/ML, and full-stack development. 
                Proven track record in hackathons and continuous learning through certifications.
              </p>
            </div>
          </div>
        </div>

        {/* Custom Animations (CSS) */}
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
        
        .animate-fade-in-up-delay-1 {
          animation: fade-in-up 0.8s ease-out 0.2s both;
        }
        
        .animate-fade-in-up-delay-2 {
          animation: fade-in-up 0.8s ease-out 0.4s both;
        }
        
        .animate-fade-in-up-delay-3 {
          animation: fade-in-up 0.8s ease-out 0.6s both;
        }
        
        .animate-fade-in-up-delay-4 {
          animation: fade-in-up 0.8s ease-out 0.8s both;
        }
        
        .animate-fade-in-up-delay-5 {
          animation: fade-in-up 0.8s ease-out 1s both;
        }
        `}</style>
      </section>
    );
};

export default HeroSection;