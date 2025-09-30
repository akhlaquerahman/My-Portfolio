import React, { useState, useEffect } from 'react';
import myPhoto from '../assets/my_photo.jpeg'; // Ye path aapke file structure ke hisab se sahi hona chahiye

const API_URL = import.meta.env.VITE_API_URL;

const AboutSection = () => {
  const [info, setInfo] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAccountInfo = async () => {
      try {
        const response = await fetch(`${API_URL}/api/admin/info`);
        if (!response.ok) {
          throw new Error('Failed to fetch account info');
        }
        const data = await response.json();
        setInfo(data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchAccountInfo();
  }, []);

  if (loading) {
    return <div className="text-center text-white py-20 bg-slate-800 min-h-screen">Loading About Section...</div>;
  }

  if (error) {
    return <div className="text-center text-red-400 py-20 bg-slate-800 min-h-screen">{error}</div>;
  }

  // 💡 CHANGE: Use profileImageUrl from info, fallback to myPhoto
  const profileImgSrc = info.profileImageUrl || myPhoto;
  
  // Note: strengthsList and weaknessesList are currently unused in JSX but kept here
  const strengthsList = info.strengths ? info.strengths.split('|').map(s => s.trim()) : [];
  const weaknessesList = info.weaknesses ? info.weaknesses.split('|').map(s => s.trim()) : [];

  return (
    <section id="about" className="bg-slate-800 text-white min-h-screen py-16 px-4 md:px-8 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-40 left-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-32 right-16 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-20 right-1/3 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-extrabold mb-4">
            About <span className="text-cyan-400">Me</span>
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-cyan-400 to-blue-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Section: Content */}
          <div className="space-y-8 order-2 lg:order-1">
            {/* Main Description */}
            <div className="space-y-6">
              <p className="text-lg text-gray-300 leading-relaxed">
                {info.about}
              </p>
            </div>
          </div>

          {/* Right Section: Enhanced Image */}
          <div className="flex justify-center lg:justify-end order-1 lg:order-2">
            <div className="relative">
              {/* Animated Background Elements */}
              <div className="absolute inset-0 w-80 h-96 md:w-96 md:h-[400px] bg-gradient-to-br from-cyan-400/20 via-blue-500/20 to-purple-600/20 rounded-3xl blur-2xl animate-pulse"></div>
              
              {/* Main Image Container */}
              <div className="relative w-80 h-96 md:w-96 md:h-[400px] rounded-3xl bg-gradient-to-br from-cyan-400 via-blue-500 to-purple-600 p-1 shadow-2xl hover:shadow-cyan-500/25 transition-all duration-500">
                <div className="w-full h-full bg-slate-900 rounded-3xl p-4 flex items-center justify-center overflow-hidden">
                  <img
                    // 💡 CHANGE: Use dynamic profileImgSrc from API or Fallback
                    src={profileImgSrc} 
                    alt="Akhlaque Rahman"
                    className="w-full h-full object-cover rounded-2xl transition-transform duration-500 hover:scale-105"
                    // 💡 ADD: Error fallback handler
                    onError={(e) => { e.target.onerror = null; e.target.src = myPhoto; }}
                  />
                </div>
              </div>

              {/* Floating Decoration Elements */}
              <div className="absolute -top-6 -right-6 w-12 h-12 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center text-white text-xl animate-bounce delay-300">
                💻
              </div>
              <div className="absolute -bottom-4 -left-4 w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center text-white animate-bounce delay-700">
                🎯
              </div>
              <div className="absolute top-1/2 -left-8 w-8 h-8 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center text-white text-sm animate-bounce delay-1000">
                ⚡
              </div>

              {/* Experience Badge */}
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-slate-800 to-slate-700 backdrop-blur-lg rounded-full px-6 py-3 border border-cyan-400/30 shadow-2xl">
                <div className="text-center">
                  <div className="text-cyan-400 font-bold text-lg">{info.experience || '3'}+ Years</div>
                  <div className="text-gray-400 text-xs">Experience</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Stats or Quote */}
        <div className="mt-20 text-center">
          <blockquote className="text-xl md:text-2xl italic text-gray-300 max-w-4xl mx-auto leading-relaxed">
            "Code is like humor. When you have to explain it, it's bad."
            <span className="block text-cyan-400 text-lg mt-4 not-italic">— Passionate about clean, efficient code</span>
          </blockquote>
        </div>
      </div>
      <style jsx>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 0.8s ease-out; }
        .animate-fade-in-up-delay-1 { animation: fade-in-up 0.8s ease-out 0.2s both; }
        .animate-fade-in-up-delay-2 { animation: fade-in-up 0.8s ease-out 0.4s both; }
        .animate-fade-in-up-delay-3 { animation: fade-in-up 0.8s ease-out 0.6s both; }
        .animate-fade-in-up-delay-4 { animation: fade-in-up 0.8s ease-out 0.8s both; }
        .animate-fade-in-up-delay-5 { animation: fade-in-up 0.8s ease-out 1s both; }
      `}</style>
    </section>
  );
};

export default AboutSection;