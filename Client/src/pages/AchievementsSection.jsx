// src/components/AchievementsSection.js

import React from 'react';

const AchievementsSection = ({ stats }) => {
  // Agar stats available nahi hai, to default values 0 set kar dein taaki error na aaye.
  const experience = stats.experience || 0;
  const project = stats.project || 0;
  const hackathon = stats.hackathon || 0;
  const certificate = stats.certificate || 0;
  const award = stats.award || 0;
  const technology = stats.technology || 0;

  return (
    <div className="bg-gradient-to-r from-slate-800/90 to-slate-900/90 backdrop-blur-lg border-t border-cyan-500/30 relative z-10 shadow-2xl mt-auto">
      <div className="container mx-auto px-4 py-10">
        <h3 className="text-2xl md:text-3xl font-bold text-center text-white mb-8">
          My <span className="text-cyan-400">Achievements</span>
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6 text-center">
          {/* Experience */}
          <div className="group hover:scale-110 transition-all duration-300 bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/80 border border-slate-600/50 hover:border-cyan-400/50">
            <div className="text-3xl mb-2">💼</div>
            <h4 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300">{experience}+</h4>
            <p className="text-gray-300 text-xs font-medium">Years Experience</p>
          </div>
          
          {/* Projects Completed */}
          <div className="group hover:scale-110 transition-all duration-300 bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/80 border border-slate-600/50 hover:border-cyan-400/50">
            <div className="text-3xl mb-2">🚀</div>
            <h4 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300">{project}+</h4>
            <p className="text-gray-300 text-xs font-medium">Projects Completed</p>
          </div>
          
          {/* Hackathons */}
          <div className="group hover:scale-110 transition-all duration-300 bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/80 border border-slate-600/50 hover:border-cyan-400/50">
            <div className="text-3xl mb-2">🏆</div>
            <h4 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300">{hackathon}+</h4>
            <p className="text-gray-300 text-xs font-medium">Hackathons</p>
          </div>
          
          {/* Certificates */}
          <div className="group hover:scale-110 transition-all duration-300 bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/80 border border-slate-600/50 hover:border-cyan-400/50">
            <div className="text-3xl mb-2">🎓</div>
            <h4 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300">{certificate}+</h4>
            <p className="text-gray-300 text-xs font-medium">Certificates</p>
          </div>
          
          {/* Awards Won */}
          <div className="group hover:scale-110 transition-all duration-300 bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/80 border border-slate-600/50 hover:border-cyan-400/50">
            <div className="text-3xl mb-2">⭐</div>
            <h4 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300">{award}</h4>
            <p className="text-gray-300 text-xs font-medium">Awards Won</p>
          </div>
          
          {/* Technologies */}
          <div className="group hover:scale-110 transition-all duration-300 bg-slate-700/50 rounded-xl p-4 hover:bg-slate-700/80 border border-slate-600/50 hover:border-cyan-400/50">
            <div className="text-3xl mb-2">💡</div>
            <h4 className="text-2xl md:text-3xl font-bold text-cyan-400 mb-2 group-hover:text-cyan-300">{technology}+</h4>
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
  );
};

export default AchievementsSection;